import { NextRequest } from "next/server";
import { updateTextGenerationCalls} from "@/scripts/mongo";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const email = searchParams.get("email") as string;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!pattern.test(email)) {
      throw new Error("Invalid email input");
    }

    await updateTextGenerationCalls(email)

    return Response.json({ message: "Successfully logged" }, { status: 200 });
  } catch (error: Error | any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}