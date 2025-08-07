import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectMongoDB, clientPromise } from '@/lib/mongo';
import UserInfo from '@/models/userInfoSchema';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, { collections: { Users: 'authUsers', Accounts: 'accounts', Sessions: 'sessions' } }),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Authorize: Starting for email', credentials?.email);
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          await connectMongoDB();
          const user = await UserInfo.findOne({ email: credentials.email });
          if (!user) {
            throw new Error('User not found. Please sign up with OTP.');
          }

          if (!user.isVerified) {
            throw new Error('Email not verified. Please verify your email.');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          const adapter = MongoDBAdapter(clientPromise, { collections: { Users: 'authUsers' } });
          let authUser = await adapter.getUserByEmail(credentials.email);
          if (!authUser) {
            console.log(`Authorize: Creating new authUser for ${credentials.email}`);
            authUser = await adapter.createUser({
              email: user.email,
              name: user.name || user.email.split('@')[0],
              image: user.profileImage || '',
            });
            await UserInfo.updateOne(
              { email: credentials.email },
              { authUserId: authUser.id },
              { upsert: true }
            );
          } else if (!user.authUserId || !user.authUserId.equals(authUser.id)) {
            console.log(`Authorize: Updating UserInfo authUserId for ${user.email}: ${user.authUserId} -> ${authUser.id}`);
            await UserInfo.updateOne(
              { email: credentials.email },
              { authUserId: authUser.id }
            );
          }

          console.log(`Authorize: Success for ${user.email}, authUser.id: ${authUser.id}`);
          return {
            id: authUser.id.toString(),
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
        } catch (error) {
          console.error('Authorize error:', error.message);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log(`SignIn: Starting for ${user.email}, provider: ${account?.provider}`);
        await connectMongoDB();
        const adapter = MongoDBAdapter(clientPromise, { collections: { Users: 'authUsers', Accounts: 'accounts', Sessions: 'sessions' } });

        if (account?.provider === 'google' || account?.provider === 'facebook') {
          const { email } = user;
          const { provider, providerAccountId } = account;

          // Always get authUser by email
          let authUser = await adapter.getUserByEmail(email);
          let userInfo = await UserInfo.findOne({ email });

          // If authUser doesn't exist, create it
          if (!authUser) {
            authUser = await adapter.createUser({
              email,
              name: user.name || email.split('@')[0],
              image: user.image || '',
            });
            console.log('SignIn: Created new authUser:', authUser);
          }

          // Always ensure account is linked to authUser
          const accountDoc = await clientPromise.then(client =>
            client.db().collection('accounts').findOne({ provider, providerAccountId })
          );
          if (!accountDoc || accountDoc.userId.toString() !== authUser.id.toString()) {
            // Remove any old account docs for this provider/providerAccountId
            await clientPromise.then(client =>
              client.db().collection('accounts').deleteMany({ provider, providerAccountId })
            );
            // Link account to current authUser
            await adapter.linkAccount({
              provider,
              providerAccountId,
              type: account.type,
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
              userId: authUser.id.toString(), // always a string!
            });
            console.log('SignIn: Linked account to authUser:', authUser.id.toString());
          }

          // Update or create UserInfo
          if (!userInfo) {
            userInfo = new UserInfo({
              authUserId: authUser.id,
              email,
              name: user.name || email.split('@')[0],
              provider,
              providerId: providerAccountId,
              isVerified: true,
              role: 'guest',
              subscription: 'no',
              phone: '',
              address: '',
              bio: '',
              profileImage: user.image || '',
              createdAt: new Date(),
            });
            await userInfo.save();
            console.log('SignIn: Created new UserInfo:', userInfo);
          } else {
            await UserInfo.updateOne(
              { email },
              {
                authUserId: authUser.id,
                provider,
                providerId: providerAccountId,
                isVerified: true,
                name: userInfo.name || user.name || email.split('@')[0],
                profileImage: userInfo.profileImage || user.image || '',
              }
            );
            console.log('SignIn: Updated UserInfo for', email);
          }

          user.id = authUser.id.toString();
          console.log(`SignIn: Completed successfully for ${email}, user.id: ${user.id}`);
          return true;
        }

        // Credentials provider
        console.log(`SignIn: Completed for credentials provider, email: ${user.email}`);
        return true;
      } catch (error) {
        console.error(`SignIn callback error for ${user.email}:`, error.message, error.stack);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        console.log('JWT: Input token:', token);
        if (user) {
          console.log('JWT: Populating token from user:', user);
          token.id = user.id || token.id;
          token.email = user.email || token.email;
          token.name = user.name || token.name;
          token.role = user.role || token.role;
          token.subscription = user.subscription || token.subscription;
          token.provider = user.provider || token.provider;
          token.providerId = user.providerId || token.providerId;
          token.isVerified = user.isVerified ?? token.isVerified;
          token.phone = user.phone || token.phone;
          token.address = user.address || token.address;
          token.dob = user.dob || token.dob;
          token.gender = user.gender || token.gender;
          token.bio = user.bio || token.bio;
          token.profileImage = user.profileImage || token.profileImage;
          token.createdAt = user.createdAt || token.createdAt;
        }
        if (account) {
          console.log('JWT: Adding account details:', account);
          token.provider = account.provider || token.provider;
          token.providerId = account.providerAccountId || token.providerId;
          token.accessToken = account.access_token || token.accessToken;
        }
        // Always set iat/exp
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        console.log('JWT: Output token:', token);
        return token;
      } catch (error) {
        console.error('JWT callback error:', error.message, error.stack);
        // Return the incoming token to avoid breaking session
        return token;
      }
    },
    async session({ session, token }) {
      try {
        console.log('Session: Input token:', token, 'Input session:', session);
        // Always assign user info from token
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
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
        session.accessToken = token.accessToken;
        session.expires = new Date(token.exp * 1000).toISOString();
        console.log('Session: Output session:', session);
        return session;
      } catch (error) {
        console.error('Session callback error:', error.message, error.stack);
        // Return the incoming session to avoid breaking session
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 24 * 60 * 60, // 24 hours
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
    },
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 900,
      },
    },
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 900,
      },
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);