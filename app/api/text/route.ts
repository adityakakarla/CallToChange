import { NextRequest, NextResponse } from "next/server";
import { updateTextGenerationCalls } from "@/scripts/mongo";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const email = searchParams.get("email");

    if (!email) {
      throw new Error("Email is required");
    }

    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!pattern.test(email)) {
      throw new Error("Invalid email input");
    }

    await updateTextGenerationCalls(email);

    return NextResponse.json({ message: "Successfully logged" }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
