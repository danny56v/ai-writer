import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import client from "./lib/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "./lib/zod";
import { ObjectId } from "mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          const users = await client.db().collection("users");
          const user = await users.findOne({ email });
          if (!user || !user.password) {
            return null;
          }
          const validUser = await bcrypt.compare(password, user.password);

          if (!validUser) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            hasPassword: !!user.password,
          };
        } catch (error) {
          console.log(error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user?.email) {
        const email = user.email.toLowerCase();
        const users = await client.db().collection("users");
        const existingUser = await users.findOne({ email });

        if (existingUser) {
          const existingId = existingUser._id.toString();
          const emailVerifiedFromProvider = Boolean((profile as { email_verified?: boolean })?.email_verified);

          if (emailVerifiedFromProvider && !existingUser.emailVerified) {
            await users.updateOne(
              { _id: existingUser._id },
              { $set: { emailVerified: new Date(), updatedAt: new Date() } }
            );
          }

          user.id = existingId;
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub; // attach the user id to the session payload
      }
      const userId = token?.sub;
      if (userId) {
        const database = client.db();
        type UserDocument = {
          password?: string;
          email?: string;
          emailVerified?: Date | null;
          name?: string | null;
          stripeCustomerId?: string | null;
        };
        const users = database.collection<UserDocument>("users");
        const accounts = database.collection("accounts");

        const objectId = new ObjectId(userId);
        const [user, googleAccount] = await Promise.all([
          users.findOne(
            { _id: objectId },
            { projection: { password: 1, email: 1, emailVerified: 1, name: 1, stripeCustomerId: 1 } }
          ),
          accounts.findOne({ userId: objectId, provider: "google" }, { projection: { _id: 1 } }),
        ]);

        const mutableUser = session.user as typeof session.user & {
          hasPassword?: boolean;
          hasGoogleAccount?: boolean;
          canChangeEmail?: boolean;
          emailVerified?: Date | null;
          stripeCustomerId?: string | null;
        };

        if (user?.email) {
          mutableUser.email = user.email;
        }
        if (typeof user?.name === "string") {
          mutableUser.name = user.name;
        }
        if (user?.stripeCustomerId) {
          mutableUser.stripeCustomerId = user.stripeCustomerId;
        } else {
          delete mutableUser.stripeCustomerId;
        }
        mutableUser.emailVerified = user?.emailVerified ?? null;
        mutableUser.hasPassword = !!user?.password;
        mutableUser.hasGoogleAccount = !!googleAccount;
        mutableUser.canChangeEmail = !!user?.password && !googleAccount;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
