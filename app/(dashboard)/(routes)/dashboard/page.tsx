import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import prismadb from "@/lib/prismadb";
import { ToolsList } from "./components/tools-list";
import { HistoryList } from "@/app/(dashboard)/(routes)/history/components/history-list";

const DashboardPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const latestHistory = await prismadb.history.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <ToolsList />
      {latestHistory && (
        <div className="px-4 md:px-20 lg:px-32 space-y-4 mt-10 pb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">
              Latest Conversation
            </h2>
            <Link
              href="/history"
              className="text-sm text-muted-foreground hover:text-primary transition flex items-center"
            >
              View history <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <HistoryList items={[latestHistory]} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
