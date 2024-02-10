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
    {
      value: "pdf_file",
      docsLink: "https://docs.embedchain.ai/components/data-sources/pdf_file",
      label: "PDF File",
      description: "/path/to/file.pdf",
    },
    {
      value: "csv",
      docsLink: "https://docs.embedchain.ai/components/data-sources/csv",
      label: "CSV",
      description: "/path/to/file.csv",
    },
    {
      value: "directory",
      docsLink: "https://docs.embedchain.ai/components/data-sources/directory",
      label: "Directory",
      description: "/path/to/directory",
    },
    {
      value: "text",
      docsLink: "https://docs.embedchain.ai/components/data-sources/text-file",
      label: "Text",
      description: "String of text",
    },
    {
      value: "unstructured",
      docsLink:
        "https://docs.embedchain.ai/components/data-sources/unstructured",
      label: "Unstructured",
      description:
        "Unstructured data. Uses unstructured.io loader to load data.",
    },
    {
      value: "web_page",
      docsLink: "https://docs.embedchain.ai/components/data-sources/web_page",
      label: "Web Page",
      description: "https://www.forbes.com/profile/elon-musk",
    },
    {
      value: "beehiiv",
      docsLink: "https://docs.embedchain.ai/components/data-sources/beehiiv",
      label: "Beehiiv",
      description: "https://aibreakfast.beehiiv.com",
    },
    {
      value: "docx",
      docsLink: "https://docs.embedchain.ai/components/data-sources/docx",
      label: "DOCX",
      description: "https://example.com/content/intro.docx",
    },
    {
      value: "discord",
      docsLink: "https://docs.embedchain.ai/components/data-sources/discord",
      label: "Discord",
      description: "Discord channel id such as '1177296711023075338'",
    },
    {
      value: "docs_site",
      docsLink: "https://docs.embedchain.ai/components/data-sources/docs-site",
      label: "Docs Site",
      description: "https://docs.embedchain.ai/",
    },
    {
      value: "dropbox",
      docsLink: "https://docs.embedchain.ai/components/data-sources/dropbox",
      label: "Dropbox",
      description: "Dropbox file path such as '/path/to/file'",
    },
    {
      value: "gmail",
      docsLink: "https://docs.embedchain.ai/components/data-sources/gmail",
      label: "Gmail",
      description: "to: me label:inbox",
    },
    {
      value: "google_drive",
      docsLink:
        "https://docs.embedchain.ai/components/data-sources/google-drive",
      label: "Google Drive",
      description: "https://drive.google.com/drive/u/0/folders/xxx-xxx",
    },
    {
      value: "image",
      docsLink: "https://docs.embedchain.ai/components/data-sources/image",
      label: "Image",
      description: "Path to image file such as '/path/to/image.png'",
    },
    {
      value: "json",
      docsLink: "https://docs.embedchain.ai/components/data-sources/json",
      label: "JSON",
      description: "JSON file path such as '/path/to/file.json'",
    },
    {
      value: "mdx",
      docsLink: "https://docs.embedchain.ai/components/data-sources/mdx",
      label: "MDX",
      description: "Path to MDX file such as '/path/to/file.mdx'",
    },
    {
      value: "notion",
      docsLink: "https://docs.embedchain.ai/components/data-sources/notion",
      label: "Notion",
      description:
        "A Notion page link such as 'https://www.notion.so/my-page-cfbc134ca6464fc980d0391613959196'",
    },
    {
      value: "openapi",
      docsLink: "https://docs.embedchain.ai/components/data-sources/openapi",
      label: "OpenAPI",
      description:
        "https://github.com/openai/openai-openapi/blob/master/openapi.yaml",
    },
    {
      value: "sitemap",
      docsLink: "https://docs.embedchain.ai/components/data-sources/sitemap",
      label: "Sitemap",
      description: "https://nextjs.org/sitemap.xml",
    },
    {
      value: "slack",
      docsLink: "https://docs.embedchain.ai/components/data-sources/slack",
      label: "Slack",
      description: "in:general",
    },
    {
      value: "substack",
      docsLink: "https://docs.embedchain.ai/components/data-sources/substack",
      label: "Substack",
      description: "https://www.lennysnewsletter.com",
    },
    {
      value: "xml",
      docsLink: "https://docs.embedchain.ai/components/data-sources/xml",
      label: "XML",
      description: "content/data.xml",
    },
    {
      value: "youtube_channel",
      docsLink:
        "https://docs.embedchain.ai/components/data-sources/youtube-channel",
      label: "YouTube Channel",
      description: "@embedchain",
    },
    {
      value: "youtube_video",
      docsLink:
        "https://docs.embedchain.ai/components/data-sources/youtube_video",
      label: "YouTube Video",
      description: "https://www.youtube.com/watch?v=ea_XktsFU1Q",
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
        <Button type="submit">Save</Button>
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
