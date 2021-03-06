// import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User as UserMD } from "../../../lib/users";

export interface IUser extends User {
  userId:string
}

const createOptions = (req:NextApiRequest):NextAuthOptions => ({
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/account/failure", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    async signIn({ user, account, profile }) {
      const userDB = new UserMD();
      const userId = await userDB.createUserIfNotExist({
        name: user.name,
        email: user.email,
        image: user.image,
      });

      user["userId"] = userId;
      return true;
    },
    async redirect({url, baseUrl}) {
      return "/";
    },
    async session({ session, token, user }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // const sessionUpdateQuery = url.parse(req.url, true).query.update;
      // if (sessionUpdateQuery !== undefined) {
      //   token.user.data = JSON.parse(sessionUpdateQuery)
      // } else {
      //   user && (token.user = user);
      // }

      user && (token.user = user);
      return token;
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // You can set the theme to 'light', 'dark' or use 'auto' to default to the
  // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
  theme: "light" as any,

  // Enable debug messages in the console if you are having problems
  debug: false,
});

const nextAuthDefault = async (req:NextApiRequest, res:NextApiResponse) => {
  return NextAuth(req, res, createOptions(req));
};

export default nextAuthDefault