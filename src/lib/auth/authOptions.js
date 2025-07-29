const NextAuth = require("next-auth").default;
const GoogleProvider = require("next-auth/providers/google").default;
const EmailProvider = require("next-auth/providers/email").default;
const { MongoDBAdapter } = require("@next-auth/mongodb-adapter");
const { connectMongoDB, clientPromise } = require("@/lib/mongo");
const User = require("@/models/userSchema");
const nodemailer = require("nodemailer");

const authOptions = {
  adapter: MongoDBAdapter(clientPromise, { collections: { Users: "User" } }),
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
        port: Number(process.env.EMAIL_SERVER_PORT),
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
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        await connectMongoDB();
        const mongooseUser = await User.findOne({ email: user.email });

        if (mongooseUser) {
          token.id = mongooseUser._id.toString();
          token.name = mongooseUser.name;
          token.email = mongooseUser.email;
          token.role = mongooseUser.role;
          token.subscription = mongooseUser.subscription;
          token.provider = mongooseUser.provider;
          token.providerId = mongooseUser.providerId;
          token.isVerified = mongooseUser.isVerified;
          token.phone = mongooseUser.phone;
          token.address = mongooseUser.address;
          token.dob = mongooseUser.dob;
          token.gender = mongooseUser.gender;
          token.bio = mongooseUser.bio;
          token.profileImage = mongooseUser.profileImage;
          token.createdAt = mongooseUser.createdAt;
        } else {
          const newUser = new User({
            name: user.name || user.email.split("@")[0],
            email: user.email,
            provider: account?.provider || "email",
            providerId: account?.providerAccountId,
            isVerified: account?.provider === "google",
            role: "guest",
            subscription: "no",
            profileImage: user.image || "",
            phone: "",
            address: "",
            dob: null,
            gender: null,
            bio: "",
            createdAt: new Date(),
          });

          await newUser.save();

          token.id = newUser._id.toString();
          token.name = newUser.name;
          token.email = newUser.email;
          token.role = newUser.role;
          token.subscription = newUser.subscription;
          token.provider = newUser.provider;
          token.providerId = newUser.providerId;
          token.isVerified = newUser.isVerified;
          token.phone = newUser.phone;
          token.address = newUser.address;
          token.dob = newUser.dob;
          token.gender = newUser.gender;
          token.bio = newUser.bio;
          token.profileImage = newUser.profileImage;
          token.createdAt = newUser.createdAt;
        }
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

      if (account?.provider === "google") {
        if (existingUser) {
          if (existingUser.provider !== "google") {
            existingUser.provider = "google";
            existingUser.providerId = account.providerAccountId;
            existingUser.isVerified = true;
            existingUser.name = existingUser.name || user.name || user.email.split("@")[0];
            await existingUser.save();
          }
          return profile?.email_verified && profile?.email?.endsWith("@gmail.com");
        }
      } else if (account?.provider === "email") {
        if (existingUser) {
          existingUser.provider = "email";
          existingUser.providerId = null;
          existingUser.name = existingUser.name || user.name || user.email.split("@")[0];
          await existingUser.save();
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

const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

module.exports = {
  authOptions,
  handlers,
  auth,
  signIn,
  signOut,
};