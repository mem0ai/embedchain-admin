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
import Link from "next/link";

interface CollectionEntry {
  name: string;
  tenant: string;
  database: string;
}

export default function Page() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/admin/collections");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCollections(data);
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
          <h2 className="text-2xl font-semibold tracking-tight">Collections</h2>
        </div>
        <div className="md:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl tracking-tight">
              List of collections in vector store
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Database</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection: CollectionEntry) => (
                <TableRow key={collection.name}>
                  <TableCell className="underline underline-offset-2">
                    <Link href={`/admin/collections/${collection.name}`}>
                      {collection.name}
                    </Link>
                  </TableCell>
                  <TableCell>{collection.tenant}</TableCell>
                  <TableCell>{collection.database}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
