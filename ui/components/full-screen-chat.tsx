"use client";

import * as React from "react";

import { Plus, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentMessage } from "@/components/full-screen-chat/agent-message";
import { UserMessage } from "@/components/full-screen-chat/user-message";

interface ChatProps {
  sessionId: string;
  query?: string;
}

interface ChatMessage {
  role: "user" | "agent";
  content: string;
}

export function FullScreenChat({ sessionId, query }: ChatProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  React.useEffect(() => {
    if (query && sessionId) {
      sendQuery(query, sessionId);
    }
    }, [query, sessionId]);

  const sendQuery = async (query: string, sessionId: string) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "user",
          content: query,
        },
      ]);

      const response = await fetch(
        `/api/v1/chat?query=${query}&session_id=${sessionId}`,
      );

      if (response.ok) {
        const reader = response.body.getReader();

        // Function to wait for a state update
        const waitForUpdate = (updateFn) =>
          new Promise((resolve) => {
            updateFn();
            setTimeout(resolve, 0); // Use setTimeout to wait for the next event loop tick
          });

        const processStream = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("stream completed");
              break;
            }
            const chunk = new TextDecoder("utf-8").decode(value);

            // Wait for each update to be "processed"
            await waitForUpdate(() =>
              setMessages((prevMessages) => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                if (lastMessage && lastMessage.role === "agent") {
                  // Append chunk to the last agent message
                  return prevMessages.map((msg, idx) =>
                    idx === prevMessages.length - 1
                      ? { ...msg, content: msg.content + chunk }
                      : msg,
                  );
                } else {
                  // Or add a new agent message
                  return [...prevMessages, { role: "agent", content: chunk }];
                }
              }),
            );
          }
        };

        await processStream();
      }
    } catch (error) {
      console.error(
        "Error getting response from bot. Please try again.",
        error,
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "agent",
          content: "Error getting response from bot. Please try again.",
        },
      ]);
    }
  };

  return (
    <>
      <ScrollArea className="mt-6 h-[80vh] max-h-[calc(100vh - 200px)]">
        <CardContent>
          <div className="space-y-4">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <UserMessage key={index} message={message} />
              ) : (
                <AgentMessage key={index} message={message} />
              ),
            )}
          </div>
        </CardContent>
      </ScrollArea>
      <CardFooter className="bottom-0 my-4">
        <form
          onSubmit={async (event: any) => {
            event.preventDefault();
            const currentMessage = event.currentTarget.message.value;
            event.target.message.value = "";
            if (currentMessage === "") {
              return;
            }
            await sendQuery(currentMessage, sessionId);
          }}
          className="flex w-full items-center space-x-2"
        >
          <div>
            <Link href="/admin/data/add" target="_blank">
              <Plus className="h-6 w-6" />
              <span className="sr-only">Add data</span>
            </Link>
          </div>
          <Input
            id="message"
            placeholder={"Ask a question..."}
            className="flex-1 font-light text-lg h-12 w-full focus:ring-1 rounded-md px-4"
            autoComplete="off"
          />
          <Button type="submit" className="h-12">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </>
  );
}
