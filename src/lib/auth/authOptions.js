import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectMongoDB, clientPromise } from "@/lib/mongo";
import User from "@/models/userSchema";
import nodemailer from "nodemailer";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
        try {
          const transport = nodemailer.createTransport(server);
          const result = await transport.sendMail({
            to: email,
            from,
            subject: "Sign in to DumpsXpert",
            text: `Please click the following link to sign in: ${url}`,
            html: `<p>Please click the following link to sign in:</p><a href="${url}">Sign in</a>`,
          });
          console.log("Email sent successfully:", result);
        } catch (error) {
          console.error("Error sending verification email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        await connectMongoDB();
        const mongooseUser = await User.findOne({ email: user.email });
        if (mongooseUser) {
          token.id = mongooseUser._id.toString();
          token.role = mongooseUser.role;
          token.subscription = mongooseUser.subscription;
        } else {
          const newUser = new User({
            name: user.name || user.email.split("@")[0],
            email: user.email,
            provider: account?.provider || "email",
            providerId: account?.providerAccountId,
            isVerified: account?.provider === "google" ? true : false,
            role: "guest",
            subscription: "no",
            profileImage: user.image,
          });
          await newUser.save();
          token.id = newUser._id.toString();
          token.role = newUser.role;
          token.subscription = newUser.subscription;
        }
      }

      if (account) token.provider = account.provider;
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.subscription = token.subscription;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      await connectMongoDB();
      const existingUser = await User.findOne({ email: user.email });

      if (account?.provider === "google") {
        if (existingUser) {
          if (existingUser.provider !== "google") {
            existingUser.provider = "google";
            existingUser.providerId = account.providerId;
            existingUser.isVerified = true;
            existingUser.name = existingUser.name || user.name || user.email.split("@")[0];
            await existingUser.save();
          }
          return profile?.email_verified && (profile?.email?.endsWith("@gmail.com") ?? false);
        }
      } else if (account?.provider === "email") {
        if (existingUser) {
          return true;
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
