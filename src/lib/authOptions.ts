import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "user-credentials",
      name: "User Credentials",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const db = await getDb();
        const user = await db.collection("users").findOne({ email: credentials.email });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user._id), email: user.email, name: user.name, role: user.role || "user" } as any;
      },
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: { email: { label: "Admin Email", type: "text" }, secret: { label: "Admin Secret", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.secret) return null;
        const db = await getDb();
        const admin = await db.collection("admins").findOne({ email: credentials.email });
        if (!admin) return null;
        const ok = await bcrypt.compare(credentials.secret, admin.secretHash);
        if (!ok) return null;
        return { id: String(admin._id), email: admin.email, name: admin.name || "admin", role: "admin" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
        token.userId = (user as any).id;
        token.name = (user as any).name;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = token.role;
      (session as any).userId = (token as any).userId;
      if (session.user) session.user.name = (token as any).name || session.user.name;
      return session;
    },
  },
};


