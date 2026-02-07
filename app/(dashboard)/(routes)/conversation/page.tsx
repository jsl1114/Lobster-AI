"use client";

import toast from "react-hot-toast";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessagesSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { useHistoryStore } from "@/hooks/use-history-store";
import { MessageContent } from "./components/message-content";

const ConversationPage = () => {
  const proModal = useProModal();
  const historyStore = useHistoryStore();
  const router = useRouter();
  const parentIdRef = useRef<string | undefined>(undefined);

  const { messages, sendMessage, setMessages, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/conversation",
      body: () => ({
        parentId: parentIdRef.current,
      }),
      fetch: async (input, init) => {
        const response = await fetch(input, init);

        if (response.status === 403) {
          proModal.onOpen();
        }

        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please try again later.");
        }

        const id = response.headers.get("x-message-id");
        if (id) {
          parentIdRef.current = id;
        }

        return response;
      },
    }),
    onError: (error) => {
      toast.error("Something went wrong");
    },
    onFinish: () => {
      router.refresh();
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (historyStore.messages.length > 0) {
      const formattedMessages = historyStore.messages.map((msg: any) => ({
        ...msg,
        id: msg.id || Math.random().toString(36).substring(7),
        parts: msg.parts || [{ type: "text", text: msg.content }],
      }));
      setMessages(formattedMessages);
      parentIdRef.current = historyStore.parentId;
      historyStore.clearMessages();
    }
  }, [historyStore, setMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await sendMessage({ text: values.prompt });
      form.reset();
    } catch (err: any) {
      // handled in onError
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model"
        icon={MessagesSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                      placeholder="How to pass AIT?"
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
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-muted">
              <BotAvatar />
              <div className="flex items-center gap-x-2">
                <p className="text-sm text-muted-foreground animate-pulse">
                  Lobster is thinking...
                </p>
              </div>
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="start typing to ask the magic lobster!" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((m) => {
              const textContent =
                m.parts
                  ?.filter((p: any) => p.type === "text")
                  .map((p: any) => p.text)
                  .join("") || "";
              return (
                <div
                  key={m.id}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                    m.role === "user"
                      ? "bg-white border border-black/10"
                      : "bg-muted",
                  )}
                >
                  {m.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <MessageContent content={textContent} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConversationPage;
