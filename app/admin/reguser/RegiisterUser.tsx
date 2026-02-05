// app/admin/reguser/RegiisterUser.tsx
"use client";
import { useState } from "react";

export default function RegiisterUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleCreateUser(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/admin/createUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log({ data })
        if (res.ok) setMessage(`✅ User created: ${data.user.email}`);
        else setMessage(`❌ Error: ${data.error}`);
    }

    return (
        <div className="p-6">
            <h1 className="text-xl mb-4">Admin - Create User</h1>
            <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="User email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="User password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                />
                <button className="bg-blue-600 text-white py-2 rounded">Create User</button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
