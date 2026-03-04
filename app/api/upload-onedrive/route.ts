import { NextResponse } from "next/server";
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function getAccessToken() {
  if (!process.env.TENANT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error("Missing Azure environment variables");
  }

  const response = await axios.post(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ File size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB limit" },
        { status: 400 }
      );
    }

    if (!process.env.ONEDRIVE_USER_ID) {
      throw new Error("ONEDRIVE_USER_ID not configured");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const accessToken = await getAccessToken();

    // ✅ sanitize filename
    const fileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

    // ✅ control folder here
    const folderPath = "ERP/uploads";

    // STEP 1 — Create Upload Session
    const sessionRes = await axios.post(
      `https://graph.microsoft.com/v1.0/users/${process.env.ONEDRIVE_USER_ID}/drive/root:/${folderPath}/${fileName}:/createUploadSession`,
      {
        item: {
          "@microsoft.graph.conflictBehavior": "rename",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadUrl = sessionRes.data.uploadUrl;

    // STEP 2 — Upload File
    const uploadRes = await axios.put(uploadUrl, buffer, {
      headers: {
        "Content-Length": buffer.length,
        "Content-Range": `bytes 0-${buffer.length - 1}/${buffer.length}`,
      },
    });

    return NextResponse.json({
      success: true,
      file: uploadRes.data,
    });

  } catch (error: any) {
    console.error("OneDrive Upload Error:", error.response?.data || error);

    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}