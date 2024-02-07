"use client";

import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  dataType: z.string().min(3).max(50),
  dataValue: z.string().min(3),
  metadata: z.string().optional(),
  envVariables: z.string().optional(),
});

function AddDataSourceForm() {
  const [selectedTypeDescription, setSelectedTypeDescription] = useState("");
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataType: "",
      dataValue: "",
      metadata: "",
      envVariables: "",
    },
  });
  function handleDataTypeChange(value: string) {
    const selectedDataType = dataTypes.find(
      (dataType) => dataType.value === value,
    );
    setSelectedTypeDescription(selectedDataType?.description || "");
    form.setValue("dataType", value);
  }

  const dataTypes = [
    { value: "beehiiv", label: "Beehiiv", description: "A Beehiiv page." },
    { value: "csv", label: "CSV", description: "A CSV file." },
    { value: "docx", label: "DOCX", description: "A DOCX file." },
    { value: "directory", label: "Directory", description: "A directory." },
    { value: "discord", label: "Discord", description: "A Discord server." },
    {
      value: "docs_site",
      label: "Docs Site",
      description: "A site with documentation.",
    },
    { value: "dropbox", label: "Dropbox", description: "A Dropbox file." },
    { value: "gmail", label: "Gmail", description: "An email from Gmail." },
    {
      value: "google_drive",
      label: "Google Drive",
      description: "A Google Drive file.",
    },
    { value: "image", label: "Image", description: "An image." },
    { value: "json", label: "JSON", description: "A JSON file." },
    { value: "mdx", label: "MDX", description: "An MDX file." },
    { value: "notion", label: "Notion", description: "A Notion page." },
    { value: "openapi", label: "OpenAPI", description: "An OpenAPI file." },
    { value: "pdf_file", label: "PDF File", description: "A PDF file." },
    { value: "rss_feed", label: "RSS Feed", description: "An RSS feed." },
    { value: "sitemap", label: "Sitemap", description: "A sitemap." },
    { value: "slack", label: "Slack", description: "A Slack channel." },
    { value: "substack", label: "Substack", description: "A Substack page." },
    { value: "text_file", label: "Text File", description: "A text file." },
    {
      value: "unstructured",
      label: "Unstructured",
      description: "Unstructured data.",
    },
    { value: "web_page", label: "Web Page", description: "A web page." },
    { value: "xml", label: "XML", description: "An XML file." },
    {
      value: "youtube_channel",
      label: "YouTube Channel",
      description: "A YouTube channel.",
    },
    {
      value: "youtube_video",
      label: "YouTube Video",
      description: "A video from YouTube.",
    },
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/v1/admin/data_sources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const response_json = await response.json();
    if (response?.ok) {
      toast({
        title: "Success",
        description: response_json.message,
      });
      form.reset();
    } else {
      toast({
        title: "Failed",
        description: response_json.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="dataType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data type</FormLabel>
              <Select
                onValueChange={handleDataTypeChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a data type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {dataTypes.map((dataType) => (
                      <SelectItem key={dataType.value} value={dataType.value}>
                        {dataType.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage data sources in your{" "}
                <Link href="/admin/data">data sources page</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data value</FormLabel>
              <Textarea {...field} />
              <FormDescription>
                Example: {selectedTypeDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metadata"
          render={({ field }) => (
            <FormItem>
              <FormLabel>(Optional) Metadata</FormLabel>
              <Textarea {...field} />
              <FormDescription>
                Metadata to store. Useful for metadata filtering in RAG apps.{" "}
                <br />
                Enter valid JSON only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="envVariables"
          render={({ field }) => (
            <FormItem>
              <FormLabel>(Optional) Environment variables</FormLabel>
              <Textarea {...field} />
              <FormDescription>
                Environment variables to set for adding data source such as
                `DROPBOX_ACCESS_TOKEN` etc. <br />
                Enter valid JSON only. Key is the env variable name and value is
                the env variable value.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default function Page() {
  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="md:p-4 flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">
            Add data source
          </h1>
        </div>
        <div className="md:p-4 flex flex-col space-y-4">
          <AddDataSourceForm />
        </div>
      </div>
    </div>
  );
}
