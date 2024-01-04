"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export default function Page() {

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="p-4 md:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {" "}
              <h2 className="text-2xl font-semibold tracking-tight text-2xl">
                Embedchain Admin
              </h2>
            </div>
          </div>
            <h3 className="text-sm text-muted-foreground">
            Embedchain is an Open Source RAG Framework that makes it easy to create and deploy AI apps.
            </h3>
          <Separator className="my-4" />
          <div className="flex flex-col-2 space-x-4">
          <Link href="/admin/">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-light">Embedchain Admin</CardTitle>
                <CardDescription>Get observability into what is happening in your vector store.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/chat/">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-light">Chat UI</CardTitle>
                <CardDescription>Chat playground where you can add your data and chat with your data.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
