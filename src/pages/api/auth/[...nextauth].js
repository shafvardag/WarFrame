import MongoDb from "@/lib/mongodb.js";
import User from "@/models/user";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

// Function to generate an access token
function generateAccessToken(user) {
  return jwt.sign({
    id: user._id,
    email: user.email,
    name: user.name
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// NextAuth configuration
export const authentication = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await MongoDb(); // Ensure MongoDB connection
          const user = await User.findOne({ email });
          console.log("User fetched:", user); // Log user data
          if (!user) {
            throw new Error("User does not exist");
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log("Password match result:", passwordMatch); // Log password match result
          if (!passwordMatch) {
            throw new Error("Password does not match");
          }
          console.log("Data Fetch Successfully");
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
        token.accessToken = generateAccessToken(user);
        console.log("JWT Token:", token); // Log JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
      };
      session.accessToken = token.accessToken;
      console.log("Session object:", session); // Log session object
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login" // Custom sign-in page path
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
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