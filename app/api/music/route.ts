import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({ auth: process.env["REPLICATE_API_TOKEN"] });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!prompt) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const isPro = await checkSubscription();

    if (!isPro)
      return new NextResponse("Pro subscription required", { status: 403 });

    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        },
      },
    );

    return NextResponse.json(response);
  } catch (err) {
    console.log(`[MUSIC_ERROR]: ${err}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
