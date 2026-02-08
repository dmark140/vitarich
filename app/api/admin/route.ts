// eslint-disable-next-line @typescript-eslint/no-explicit-any
// app/api/admin/createUser/route.ts
export const runtime = "nodejs";
import { admin_db } from "@/lib/Supabase/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // const { email, password } = await req.json();
        const { data, error } = await admin_db.auth.admin.listUsers()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({
            user: data.users.map((u) => ({
                id: u.id,
                email: u.email,
            }))
        }, { status: 200 });
    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error", details: err.message },
            { status: 500 }
        );
    }
}
