"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquareCode } from "lucide-react";
import { useForm } from "react-hook-form";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useProModal } from "@/hooks/use-pro-modal";
import { useHistoryStore } from "@/hooks/use-history-store";
import toast from "react-hot-toast";

const CodePage = () => {
  const proModal = useProModal();
  const historyStore = useHistoryStore();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [parentId, setParentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (historyStore.messages.length > 0) {
      setMessages(historyStore.messages);
      setParentId(historyStore.parentId);
      historyStore.clearMessages();
    }
  }, [historyStore]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const res = await axios.post("/api/code", {
        messages: newMessages,
        parentId,
      });

      setMessages((current) => [...current, userMessage, res.data]);
      setParentId(res.data.id);

      form.reset();
    } catch (err: any) {
      if (err?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Let Lobster code for you!"
        icon={MessageSquareCode}
        iconColor="text-red-500"
        bgColor="bg-red-500/10"
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Simple toggle button using react hooks."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              Send
            </Button>
          </form>
        </Form>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="start typing to ask the magic lobster!" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((m) => (
              <div
                key={m.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  m.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted",
                )}
              >
                {m.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <Markdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent my-6 pb-2 border-b border-gray-200 dark:border-gray-700"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 text-base leading-7 text-gray-700 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-6 pl-2 space-y-2 text-gray-700 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-6 pl-2 space-y-2 text-gray-700 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-2" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-red-500 pl-4 italic my-6 py-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg shadow-sm"
                        {...props}
                      />
                    ),
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="rounded-lg overflow-hidden my-4 shadow-md">
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
                          className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-mono text-sm font-medium"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    span: ({ node, className, ...props }) => {
                      const match = /katex/.exec(className || "");
                      return match ? (
                        <span
                          {...props}
                          className={className + " text-red-600 font-serif"}
                        />
                      ) : (
                        <span {...props} className={className} />
                      );
                    },
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {m.content.startsWith("```markdown")
                    ? m.content.replace(/^```markdown/, "").replace(/```$/, "")
                    : m.content}
                </Markdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodePage;
