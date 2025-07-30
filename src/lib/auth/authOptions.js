import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectMongoDB, clientPromise } from "@/lib/mongo";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, { collections: { Users: "User" } }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectMongoDB();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.isVerified) {
          throw new Error("User not found or not verified");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          subscription: user.subscription,
          provider: user.provider,
          providerId: user.providerId,
          isVerified: user.isVerified,
          phone: user.phone,
          address: user.address,
          dob: user.dob,
          gender: user.gender,
          bio: user.bio,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        };
      },
    }),
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
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.subscription = user.subscription;
        token.provider = user.provider;
        token.providerId = user.providerId;
        token.isVerified = user.isVerified;
        token.phone = user.phone;
        token.address = user.address;
        token.dob = user.dob;
        token.gender = user.gender;
        token.bio = user.bio;
        token.profileImage = user.profileImage;
        token.createdAt = user.createdAt;
      }

      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.subscription = token.subscription;
        session.user.provider = token.provider;
        session.user.providerId = token.providerId;
        session.user.isVerified = token.isVerified;
        session.user.phone = token.phone;
        session.user.address = token.address;
        session.user.dob = token.dob;
        session.user.gender = token.gender;
        session.user.bio = token.bio;
        session.user.profileImage = token.profileImage;
        session.user.createdAt = token.createdAt;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      await connectMongoDB();
      const existingUser = await User.findOne({ email: user.email });

      if (account?.provider === "google" || account?.provider === "facebook") {
        if (existingUser) {
          if (existingUser.provider !== account.provider) {
            existingUser.provider = account.provider;
            existingUser.providerId = account.providerAccountId;
            existingUser.isVerified = true;
            existingUser.name = existingUser.name || user.name || user.email.split("@")[0];
            await existingUser.save();
          }
          return (account.provider === "google" && profile?.email_verified && profile?.email?.endsWith("@gmail.com")) ||
                 (account.provider === "facebook");
        }
        return true;
      }

      return true; // Credentials provider handles validation
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/auth/signout",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);