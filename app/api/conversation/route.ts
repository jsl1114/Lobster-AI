import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  type LanguageModel,
} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

import { increaseApiLimit, checkAPiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import prismadb from "@/lib/prismadb";

const systemPrompt =
  "Your name is LobsterAI, you are lobster themed so in your response try to insert lobster sounds but not so frequently though. Please use the specific LaTeX math mode delimiters for your response as specified here: inline math mode : `$` and `$` ; display math mode: `$$\n` and `\n$$`. PLEASE STRICTLY ENACT THOSE RULES!";

/** Ordered list of Gemini models to try (highest priority first). */
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
] as const;

function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("429") ||
      msg.includes("rate limit") ||
      msg.includes("resource exhausted") ||
      msg.includes("too many requests") ||
      msg.includes("quota")
    );
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages, parentId } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      return new NextResponse("API KEY NOT CONFIGURED", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkAPiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro)
      return new NextResponse("Free trial has expired", { status: 403 });

    // Extract user prompt from the last message
    const lastMessage = messages[messages.length - 1] as UIMessage;
    const userPrompt =
      lastMessage.parts
        ?.filter((p: any) => p.type === "text")
        .map((p: any) => p.text)
        .join("") || "";

    // Create the history record to get an ID
    const historyRecord = await prismadb.history.create({
      data: {
        userId,
        prompt: userPrompt,
        answer: "",
        type: "conversation",
        parentId: parentId,
      },
    });

    const modelMessages = await convertToModelMessages(messages);

    const onFinish = async ({ text }: { text: string }) => {
      if (!isPro) {
        await increaseApiLimit();
      }
      await prismadb.history.update({
        where: { id: historyRecord.id },
        data: { answer: text },
      });
    };

    // Build the ordered list of models to attempt
    const modelsToTry: LanguageModel[] = [];

    if (process.env.GEMINI_API_KEY) {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      for (const id of GEMINI_MODELS) {
        modelsToTry.push(google(id));
      }
    }

    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      modelsToTry.push(
        openai(
          isPro && process.env.NEXT_PUBLIC_NODE_ENV === "development"
            ? "gpt-4-turbo"
            : "gpt-3.5-turbo",
        ),
      );
    }

    // Try each model; fall through on rate-limit errors
    for (let i = 0; i < modelsToTry.length; i++) {
      try {
        const result = streamText({
          model: modelsToTry[i],
          system: systemPrompt,
          messages: modelMessages,
          onFinish,
        });

        // Force the first chunk so a rate-limit error surfaces here
        // rather than after we've already returned the response
        const response = result.toUIMessageStreamResponse({
          headers: {
            "x-message-id": historyRecord.id,
          },
        });

        return response;
      } catch (err) {
        if (isRateLimitError(err) && i < modelsToTry.length - 1) {
          console.log(
            `[CONVERSATION] Rate limited on model ${i + 1}/${modelsToTry.length}, trying next...`,
          );
          continue;
        }
        throw err;
      }
    }

    // All models exhausted
    return new NextResponse("Rate limit exceeded. Please try again later.", {
      status: 429,
    });
  } catch (err) {
    console.log(`[CONVERSATION_ERROR]: ${err}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
