"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function UserSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("user-credentials", { email, password, redirect: false });
    if (res?.ok) window.location.href = "/products";
    else setError("Invalid credentials");
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="border rounded px-4 py-2">Sign in</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}


