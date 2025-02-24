// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import FormData from "form-data";
import fs from "fs";

// Named export for POST method
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create temporary directory if it doesn't exist
    const tempDir = join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create temporary file path
    const tempFilePath = join(tempDir, `${Date.now()}-${file.name}`);

    // Convert File to Buffer and write to temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);

    // Create FormData for VAPI
    formData.append("file", tempFilePath);

    console.log("Uploading to VAPI...");

    // Upload to VAPI
    const vapiResponse = await fetch("https://api.vapi.ai/file", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_TOKEN}`,
      },
      body: formData,
    });

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    if (!vapiResponse.ok) {
      const error = await vapiResponse.json();
      return NextResponse.json(error, { status: vapiResponse.status });
    }

    const result = await vapiResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method if you need to handle GET requests
export async function GET() {
  try {
    // Fetch PDFs from the VAPI Knowledge Base API
    const response = await fetch("https://api.vapi.ai/knowledge-base", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_TOKEN}`,
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching data from VAPI:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch PDFs from VAPI", details: errorData },
        { status: response.status }
      );
    }

    // Parse the response from VAPI
    const data = await response.json();

    // Return the transformed data
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching PDFs:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred", details: error.message },
      { status: 500 }
    );
  }
}



