import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function DELETE(
  req: Request,
  { params }: { params: { historyId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.historyId) {
      return new NextResponse("History ID is required", { status: 400 });
    }

    const history = await prismadb.history.deleteMany({
      where: {
        id: params.historyId,
        userId: userId,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.log("[HISTORY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
