"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

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
      <h1 className="text-2xl font-semibold mb-4">Admin sign in</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input className="border rounded px-3 py-2" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Secret key" type="password" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <button className="border rounded px-4 py-2">Sign in</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}


