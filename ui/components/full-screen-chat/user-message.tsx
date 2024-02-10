import * as React from "react";

interface ChatMessage {
  role: string;
  content: string;
}

export function UserMessage({ message }: { message: ChatMessage }) {
  return <p className="text-2xl">{message.content}</p>;
}
