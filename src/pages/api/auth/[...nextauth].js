import MongoDb from "@/lib/mongodb.js";
import User from "@/models/user";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

export const authentication = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await MongoDb();
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("User does not exist");
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("Password does not match");
          }
          console.log("Data Fetch Successfully");

          // You don't need to manually set the token in cookies here
          return { id: user._id, name: user.name, email: user.email };
        } catch (error) {
          console.log("Error in data fetching", error);
          throw error;  // Ensure the error is propagated
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
      };
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login"
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",  // Use a proper name for the cookie
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600
      }
    }
  }
};

const handler = nextAuth(authentication);
export default handler;
