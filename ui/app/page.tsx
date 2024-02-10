"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  query: z.string().optional(),
});

function SearchForm() {
  const router = useRouter(); // Use the useRouter hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const query = values.query;
    if (query) {
      router.push(`/search?query=${query}`);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <div className="flex w-full space-x-2 items-center justify-center">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-[400px]">
                  <Input
                    {...field}
                    placeholder="Ask a question..."
                    autoComplete="off"
                    className="font-light text-lg h-12 w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="h-12"
              type="submit"
              disabled={form.getValues().query === ""}
            >
              <MagnifyingGlassIcon className="w-8 h-8 text-muted-foreground text-white" />
            </Button>
          </div>
        </form>
      </Form>
      <Button className="mt-4 h-6 bg-gray-500">
        <Link href="/admin/data/add" target="_blank">
          Add data sources
        </Link>
      </Button>
    </>
  );
}

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-screen-lg bg-background">
        <div className="md:p-4 flex flex-col items-center justify-center space-y-2">
          <h1 className="text-4xl font-medium tracking-tight">
            Chat with your data
          </h1>
          <h3 className="font-light text-sm tracking-tight">
            Built using
            <Link
              className="text-gray-900 underline underline-offset-2 px-1"
              href="https://github.com/embedchain/embedchain"
              target="_blank"
            >
              Embedchain
            </Link>
            ❤️ Code available on{" "}
            <Link
              href="https://github.com/embedchain/embedchain-admin"
              target="_blank"
              className="underline underline-offset-2"
            >
              GitHub
            </Link>
            .
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          <SearchForm />
        </div>
      </div>
    </div>
  );
}
