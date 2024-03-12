import * as React from "react";
import Link from "next/link";
import { ChatBubbleIcon, ReaderIcon } from "@radix-ui/react-icons";

interface ChatMessage {
  role: string;
  content: { context: { source: string }[]; answer: string } | string;
}

interface ResponseType {
  context: { source: string }[];
  answer: string;
}

export function AgentMessage({ message }: { message: ChatMessage }) {
  const [parsedSources, setParsedSources] = React.useState<string[]>([]);
  const [parsedAnswer, setParsedAnswer] = React.useState("");

  const parseResponse = (response: ResponseType | string) => {
    const { content } = message;
    let sources: string[] = [];
    let answer: string = "";
    if (typeof response === "object" && content.context && content.answer) {
      sources = content.context.map((item) => item.source);
      answer = content.answer;
    } else if (typeof content === "string") {
      const sourcesMatch = content.match(/<sources>(.*?)<\/sources>/s);
      if (sourcesMatch && sourcesMatch[1]) {
        sources = sourcesMatch[1].trim().split("\n");
      }
      answer = content.split("</sources>").pop() || "";
    }
    return { sources, answer };
  };

  React.useEffect(() => {
    const parsedResponse = parseResponse(message);
    setParsedSources(parsedResponse.sources);
    setParsedAnswer(parsedResponse.answer);
  }, [message]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl flex justify-start items-center">
        <ReaderIcon />
        &nbsp;Sources
      </h3>
      <ol className="space-y-2">
        {parsedSources.map((source, idx) => source && (
          <li key={idx} className="text-gray-600 underline underline-offset-2">
            <Link href={JSON.parse(source).url}>{JSON.parse(source).url}</Link>
          </li>
        ))}
      </ol>
      <h3 className="text-xl flex justify-start items-center">
        <ChatBubbleIcon />
        &nbsp;Answer
      </h3>
      <p className="text-gray-600">{parsedAnswer}</p>
    </div>
  );
}
