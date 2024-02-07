"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface ChatHistoryEntry {
  session_id: string;
  human: string;
  ai: string;
  timestamp: string;
}

export default function Page() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/admin/chat_history");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Fetching error: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="md:p-4 flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight">
            Chat history
          </h2>
        </div>
        <div className="md:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl tracking-tight">
              List of past conversations
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Session id</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chatHistory.map((entry: ChatHistoryEntry) => (
                <TableRow key={entry.session_id}>
                  <TableCell className="font-medium">
                    {entry.session_id}
                  </TableCell>
                  <TableCell>{entry.human}</TableCell>
                  <TableCell>{entry.ai}</TableCell>
                  <TableCell>{format(entry.timestamp, "pp, PP")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
