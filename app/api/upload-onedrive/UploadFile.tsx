"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-onedrive", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center p-10">
      <Card className="w-105">
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Upload a file to OneDrive
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* File Upload Area */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/40 transition">
            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />

            <span className="text-sm text-muted-foreground">
              Click to select a file
            </span>

            <Input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {/* Selected file */}
          {file && (
            <div className="text-sm text-muted-foreground border rounded-md p-2">
              Selected: <span className="font-medium text-foreground">{file.name}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            className="w-full"
            onClick={upload}
            disabled={!file || loading}
          >
            {loading ? "Uploading..." : "Upload File"}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}