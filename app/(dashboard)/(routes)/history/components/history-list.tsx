"use client";

import { History } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/hooks/use-history-store";
import { ArrowRight, Trash } from "lucide-react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

interface HistoryListProps {
  items: History[];
}

export const HistoryList = ({ items }: HistoryListProps) => {
  const router = useRouter();
  const historyStore = useHistoryStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onContinue = (item: History) => {
    historyStore.setMessages(
      [
        { role: "user", content: item.prompt },
        { role: "assistant", content: item.answer },
      ],
      item.id,
    );
    router.push(`/${item.type}`);
  };

  const onDelete = async (id: string) => {
    try {
      setLoadingId(id);
      await axios.delete(`/api/history/${id}`);
      toast.success("Conversation deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground mt-10">
        No history found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 bg-muted/50">
            <div className="flex items-center gap-x-2">
              <Badge
                variant={item.type === "code" ? "destructive" : "default"}
                className={cn(
                  item.type === "conversation" &&
                    "bg-violet-500 hover:bg-violet-600",
                )}
              >
                {item.type}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}{" "}
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                size="sm"
                variant="default"
                className={cn(
                  "gap-x-2 text-xs",
                  item.type === "code"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-violet-500 hover:bg-violet-600",
                )}
                onClick={() => onContinue(item)}
              >
                Continue
                <ArrowRight className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                disabled={loadingId === item.id}
                onClick={() => onDelete(item.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col gap-y-1">
              <span className="font-bold text-sm">Prompt:</span>
              <p className="text-sm text-muted-foreground">{item.prompt}</p>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="font-bold text-sm">Answer:</span>
              <div className="text-sm overflow-hidden bg-black/5 p-4 rounded-lg dark:bg-white/10">
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="rounded-lg overflow-hidden my-2 shadow-sm">
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0 }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 text-primary px-1 py-0.5 rounded font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    p: ({ node, ...props }) => (
                      <p className="mb-2 last:mb-0" {...props} />
                    ),
                  }}
                  className="overflow-hidden leading-6"
                >
                  {item.answer}
                </Markdown>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
