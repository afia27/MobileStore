import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    role?: "admin" | "user";
    userId?: string;
  }

  interface User {
    role?: "admin" | "user";
    id?: string;
    name?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "user";
    userId?: string;
    name?: string | null;
  }
}


