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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

import Link from "next/link";

export default function Page() {
  const [collections, setCollections] = useState([]);
  const [currentCollectionsPage, setCurrentCollectionsPage] = useState(1);
  const [currentCollectionsRows, setCurrentCollectionsRows] = useState([]);
  const collectionsRowsPerPage = 10;

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
  const chatHistoyRowsPerPage = 50;

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

  const getPaginationContent = (currentPage, totalPages, paginationFunc) => {
    const paginationContent = [];
    
    if (currentPage - 1 > 0) {
      paginationContent.push(
        <PaginationItem
          key={-2}
          onClick={() => paginationFunc(currentPage - 1)}
        >
          <PaginationPrevious />
        </PaginationItem>
      );
    }

    if (currentPage - 2 >= 1) {
      paginationContent.push(
        <PaginationItem
          key={-1}
        >
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (currentPage - 1 > 0) {
      paginationContent.push(
        <PaginationItem
          key={currentPage - 1}
          onClick={() => paginationFunc(currentPage - 1)}
        >
          <PaginationLink>{currentPage - 1}</PaginationLink>
        </PaginationItem>
      );
    }

    paginationContent.push(
      <PaginationItem
        key={currentPage}
        onClick={() => paginationFunc(currentPage)}
      >
        <PaginationLink isActive>{currentPage}</PaginationLink>
      </PaginationItem>
    );

    if (currentPage + 1 <= totalPages) {
      paginationContent.push(
        <PaginationItem
          key={currentPage + 1}
          onClick={() => paginationFunc(currentPage + 1)}
        >
          <PaginationLink>{currentPage + 1}</PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage + 2 <= totalPages) {
      paginationContent.push(
        <PaginationItem
          key={totalPages+1}
        >
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (currentPage + 1 <= totalPages) {
      paginationContent.push(
        <PaginationItem
          key={totalPages+2}
          onClick={() => paginationFunc(currentPage + 1)}
        >
          <PaginationNext />
        </PaginationItem>
      );
    }
    return paginationContent;
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
          <Pagination>
            <PaginationContent>
              {getPaginationContent(
                currentCollectionsPage,
                Math.ceil(collections.length / collectionsRowsPerPage),
                vectorStorePaginate
              )}
            </PaginationContent>
          </Pagination>
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
                  <TableCell>{new Date(chat.timestamp).toLocaleString()}</TableCell>
                  {/* Dialog for detailed view of selected chat */}
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      {/* Render a trigger cell in each row */}
                      <TableCell className="text-xs cursor-pointer">
                        <Maximize size={16} strokeWidth={0.5} absoluteStrokeWidth />
                      </TableCell>
                    </DialogTrigger>
                    <DialogContent className="flex max-w-fit max-h-fit overflow-auto">
                      <div className="w-full container">
                        <DialogHeader>
                          <DialogTitle className="text-center">Chat Details</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 pb-8">
                          {/* Render detailed information about the selected chat */}
                          <div className="flex flex-col">
                            <div className="flex mb-2">
                              <span className="w-1/3 text-muted-foreground">Session Id:</span>
                              <span className="w-2/3">{chat.session_id}</span>
                            </div>
                            <div className="flex mb-2">
                              <span className="w-1/3 text-muted-foreground">Question:</span>
                              <span className="w-2/3">{chat.human}</span>
                            </div>
                            <div className="flex mb-2">
                              <span className="w-1/3 text-muted-foreground">Answer:</span>
                              <span className="w-2/3">{chat.ai}</span>
                            </div>
                            <div className="flex mb-2">
                              <span className="w-1/3 text-muted-foreground">Timestamp:</span>
                              <span className="w-2/3">{new Date(chat.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination for Chat History Table */}
          <Pagination>
            <PaginationContent>
              {getPaginationContent(
                currentChatHistoryPage,
                Math.ceil(chatHistory.length / chatHistoyRowsPerPage),
                chatHistoryPaginate
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
