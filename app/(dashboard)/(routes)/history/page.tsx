import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { Heading } from "@/components/heading";
import { HistoryIcon } from "lucide-react";

import { HistoryList } from "./components/history-list";

const HistoryPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const history = await prismadb.history.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <Heading
        title="History"
        description="View your past conversation and code generation history."
        icon={HistoryIcon}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4 pb-10">
        <HistoryList items={history} />
      </div>
    </div>
  );
};

export default HistoryPage;
