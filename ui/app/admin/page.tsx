"use client";

import { useState, useEffect } from "react";
import { Maximize } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";

export default function Page() {
  const [collections, setCollections] = useState([]);
  const [currentCollectionsPage, setCurrentCollectionsPage] = useState(1);
  const [currentCollectionsRows, setCurrentCollectionsRows] = useState([]);
  const collectionsRowsPerPage = 5;

  useEffect(() => {
    fetch("/api/v1/admin/collections")
      .then((response) => response.json())
      .then((data) => {
        setCollections(data);
      });
  }, []);

  useEffect(() => {
    const indexOfLastCollectionsRow = currentCollectionsPage * collectionsRowsPerPage;
    const indexOfFirstCollectionsRow = indexOfLastCollectionsRow - collectionsRowsPerPage;
    const updatedCurrentCollectionsRows = collections.slice(indexOfFirstCollectionsRow, indexOfLastCollectionsRow);
  
    setCurrentCollectionsRows(updatedCurrentCollectionsRows);
  }, [currentCollectionsPage, collections]);
  
  const vectorStorePaginate = (pageNumber) => {
    setCurrentCollectionsPage(pageNumber);
  };

  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatHistoryPage, setCurrentChatHistoryPage] = useState(1);
  const [currentChatRows, setCurrentChatRows] = useState([]);
  const chatHistoyRowsPerPage = 10;

  useEffect(() => {
    fetch("/api/v1/chat_history")
      .then((response) => response.json())
      .then((data) => {
        const history = data.response;
        if (Array.isArray(history)) {
          setChatHistory(history);
        } else {
          setChatHistory([]);
        }
      });
  }, []);

  useEffect(() => {
    const indexOfLastChatHistoryRow = currentChatHistoryPage * chatHistoyRowsPerPage;
    const indexOfFirstChatHistoryRow = indexOfLastChatHistoryRow - chatHistoyRowsPerPage;
    const updatedCurrentChatRows = chatHistory && chatHistory.length > 0
    ? chatHistory.slice(indexOfFirstChatHistoryRow, indexOfLastChatHistoryRow)
    : [];

    setCurrentChatRows(updatedCurrentChatRows);
  }, [currentChatHistoryPage, chatHistory]);

  const chatHistoryPaginate = (pageNumber) => {
    setCurrentChatHistoryPage(pageNumber);
  };

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="p-4 md:p-8 flex flex-col h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {" "}
              {/* Right-align heading and tooltip */}
              <h2 className="text-2xl font-semibold tracking-tight">
                Vector store collections
              </h2>
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground">
            See list of collections/indices present in your vector store.
          </h3>
          <Separator className="my-1" />
          {/* Vector Store Collections Table */}
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="w-[100px]">Id</TableHead> */}
                <TableHead>Name</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Database</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCollectionsRows.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-sm underline underline-offset-2">
                    <Link
                      href={`/admin/chromadb/collections/${collection.name}`}
                    >
                      {collection.name}
                    </Link>
                  </TableCell>
                  {/* <TableCell>{collection.name}</TableCell> */}
                  <TableCell>{collection?.tenant}</TableCell>
                  <TableCell>{collection?.database}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination for Vector Store Collections Table */}
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="pagination">
                {Array.from({ length: Math.ceil(collections.length / collectionsRowsPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentCollectionsPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} border border-gray-300 mx-1 rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md`}>
                    <button className="page-link px-3 py-1" onClick={() => vectorStorePaginate(i + 1)}>
                      <span className="text-sm">{i + 1}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-24"></div> {/* Empty div with margin for spacing */}
          {/* Chat History Table */}
          <h2 className="text-2xl font-semibold tracking-tight">
            Chat History
          </h2>
          <Separator className="my-1" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Id</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Answer</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentChatRows.map((chat, index) => (
                <TableRow key={index} className="cursor-pointer hover:bg-gray-100">
                  <TableCell>{chat.session_id}</TableCell>
                  <TableCell>{chat.human}</TableCell>
                  <TableCell>{`${chat.ai.substring(0, 70)} ....`}{" "}</TableCell>
                  <TableCell>{new Date(chat.timestamp).toUTCString()}</TableCell>
                  {/* Drawer for detailed view of selected chat */}
                  <Drawer key={index}>
                    <DrawerTrigger asChild>
                      {/* Render a trigger cell in each row */}
                      <TableCell className="text-xs cursor-pointer">
                        <Maximize size={16} strokeWidth={0.5} absoluteStrokeWidth />
                      </TableCell>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="w-full container">
                        <DrawerHeader>
                          <DrawerTitle>Chat Details</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 pb-8">
                          {/* Render detailed information about the selected chat */}
                          <table className="w-full">
                            <tbody>
                              <tr className="flex">
                                <td className="text-muted-foreground">Session Id:{" "}</td>
                                <td>{chat.session_id}</td>
                              </tr>
                              <tr className="flex">
                                <td className="text-muted-foreground">Question:{" "}</td>
                                <td>{chat.human}</td>
                              </tr>
                              <tr className="flex">
                                <td className="text-muted-foreground">Answer:{" "}</td>
                                <td>{chat.ai}</td>
                              </tr>
                              <tr className="flex">
                                <td className="text-muted-foreground">Timestamp:{" "}</td>
                                <td>{new Date(chat.timestamp).toUTCString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination for Chat History Table */}
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="pagination flex">
                {Array.from({ length: Math.ceil(chatHistory.length / chatHistoyRowsPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentChatHistoryPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} border border-gray-300 mx-1 rounded-tl-md rounded-tr-md rounded-bl-md rounded-br-md`}>
                    <button className="page-link px-3 py-1" onClick={() => chatHistoryPaginate(i + 1)}>
                      <span className="text-sm">{i + 1}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
