"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSignin() {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("admin-credentials", { email, secret, redirect: false });
    if (res?.ok) window.location.href = "/admin";
    else setError("Invalid admin credentials");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-4 text-stone-100">Admin sign in</h1>
      <form className="grid gap-3 bg-stone-900 border border-stone-800 rounded-xl p-5" onSubmit={onSubmit}>
        <Input placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Secret key" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <Button type="submit">Sign in</Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}


