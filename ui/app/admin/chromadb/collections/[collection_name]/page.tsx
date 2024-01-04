"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Page({ params }: { params: { collection_name: string } }) {
  const [collectionData, setCollectionData] = useState([]);
  console.log(params)

  useEffect(() => {
    fetch(`/api/v1/admin/collections/chromadb/${params.collection_name}`)
      .then((response) => response.json())
      .then((data) => {
        setCollectionData(data);
      });
  }, []);

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="p-4 md:p-8 flex flex-col h-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {" "}
              <h2 className="text-2xl font-semibold tracking-tight">
                Collection: {params.collection_name}
              </h2>
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground">
            List of document chunks present in your collection: <span className="bg-gray-100">'{params.collection_name}'</span> in chromadb vector store.
            </h3>
          <Separator className="my-4" />
          <Accordion type="multiple">
          {collectionData?.data && collectionData.data.map((c, index) => (
            <AccordionItem key={index} value={index}>
              <AccordionTrigger>
                <div className="text-sm">
                  <div>
                    app_id: {" "}
                    <span className="text-sm font-light bg-gray-100">{c.metadata.app_id}</span>
                    {", "}
                    url:{" "}
                    <span className="text-sm font-light">{c.metadata.url}</span>
                  </div>
                  <div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-1">
                    <div>
                      <div className="text-gray-500 mb-1">Type</div>
                      <div>
                        {c.metadata.data_type}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Hash</div>
                      <div>
                        {c.metadata.hash}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Document Id</div>
                      <div>
                        {c.metadata.doc_id}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Chunk</div>
                    <div>
                      {c.document}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          </Accordion>
          </div>
        </div>
    </div>
  );
}
