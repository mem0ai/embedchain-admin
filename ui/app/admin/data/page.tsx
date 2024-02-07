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
import { PlusIcon } from "@radix-ui/react-icons";

export default function Page() {
  const [dataSources, setDataSources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/admin/data_sources");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDataSources(data);
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
            Data sources
          </h2>
        </div>
        <div className="md:p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl tracking-tight">List of data sources</h3>
            <Link
              className="flex flex-row items-center justify-start underline underline-offset-2 text-sm"
              href="/admin/data/add"
            >
              <PlusIcon className="text-green-400 mr-1" />
              Add data source
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">App ID</TableHead>
                <TableHead>Data type</TableHead>
                <TableHead>Data Value</TableHead>
                <TableHead className="text-right">Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSources.map((dataSource) => (
                <TableRow key={dataSource.app_id}>
                  <TableCell className="font-medium">
                    {dataSource.app_id}
                  </TableCell>
                  <TableCell>{dataSource.data_type}</TableCell>
                  <TableCell>
                    {dataSource.data_type === "web_page" ? (
                      <Link
                        className="underline underline-offset-2"
                        href={dataSource.data_value}
                      >
                        {dataSource.data_value}
                      </Link>
                    ) : (
                      dataSource.data_value
                    )}
                  </TableCell>
                  <TableCell>{dataSource.metadata}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
