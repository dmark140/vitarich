// app/api/admin/createUser/route.ts
export const runtime = "nodejs";
import { admin_db } from "@/lib/Supabase/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { data, error } = await admin_db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ user: data.user }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
