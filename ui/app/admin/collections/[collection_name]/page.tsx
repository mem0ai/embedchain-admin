"use client";

import { useState, useEffect } from "react";
import { Maximize } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface CollectionEntry {
  metadata: {
    app_id: string;
    url: string;
    data_type: string;
    hash: string;
  };
  document: string;
}

export default function Page({
  params,
}: {
  params: { collection_name: string };
}) {
  const [collectionData, setCollectionData] = useState<{
    data: CollectionEntry[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/v1/admin/collections/chromadb/${params.collection_name}`)
      .then((response) => response.json())
      .then((data) => {
        setCollectionData(data);
      });
  }, [params.collection_name]);

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="md:p-4 flex flex-col">
          <h2 className="text-2xl font-semibold tracking-tight">
            Collection: {params.collection_name}
          </h2>
        </div>
        <div className="md:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm tracking-tight">
              {" "}
              List of document chunks present in collection:{" "}
              <span className="bg-gray-100">
                &apos;{params.collection_name}&apos;
              </span>{" "}
              in chromadb vector store.
            </h3>
          </div>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">app id</TableHead>
                <TableHead>url</TableHead>
                <TableHead>data type</TableHead>
                <TableHead>document hash</TableHead>
                <TableHead>document chunk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectionData?.data &&
                collectionData.data.map((c, index) => (
                  <TableRow key={index} className="text-xs">
                    <TableCell className="text-xs">
                      {c.metadata.app_id}
                    </TableCell>
                    <TableCell className="underline underline-offset-2">
                      <Link href={c.metadata.url} target="_blank">
                        {c.metadata.url}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {c.metadata.data_type}
                    </TableCell>
                    <TableCell>{c.metadata.hash}</TableCell>
                    <Drawer key={index}>
                      <DrawerTrigger asChild>
                        <TableCell className="text-xs cursor-pointer">
                          {`${c.document.substring(0, 50)} ....`}{" "}
                          <Maximize
                            size={16}
                            strokeWidth={0.5}
                            absoluteStrokeWidth
                          />
                        </TableCell>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="w-full container">
                          <DrawerHeader>
                            <DrawerTitle>Document chunk</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-4 pb-0">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="flex-1 text-center">
                                <div className="text-muted-foreground">
                                  {c.document}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 h-[120px]"></div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
