"use client";

import { useState, useEffect } from "react";
import { FullScreenChat } from "@/components/full-screen-chat";

function generateSessionId() {
  return Date.now().toString();
}

export default function Page() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    // Generate a new session ID (you can use any method to generate an ID)
    const newSessionId = generateSessionId(); // Replace this with your own logic
    const urlParams = new URLSearchParams(window.location.search);
    setQuery(urlParams.get("query"));
    setSessionId(newSessionId);
  }, []);

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="p-4 md:p-8 flex flex-col">
          <div className="flex-1 overflow-y-auto max-h-fit">
            <FullScreenChat sessionId={sessionId} query={query} />
          </div>
        </div>
      </div>
    </div>
  );
}
