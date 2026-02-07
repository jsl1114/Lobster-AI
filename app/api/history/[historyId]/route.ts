import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ historyId: string }> },
) {
  try {
    const { userId } = await auth();
    const { historyId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!historyId) {
      return new NextResponse("History ID is required", { status: 400 });
    }

    const history = await prismadb.history.deleteMany({
      where: {
        id: historyId,
        userId: userId,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.log("[HISTORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
