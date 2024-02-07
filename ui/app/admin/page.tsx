import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusIcon, Pencil1Icon } from "@radix-ui/react-icons";

interface Row {
  link: string;
  text: string;
  addLink: string;
  changeLink: string;
}

interface SectionProps {
  title: string;
  description: string;
  rows: Row[];
}

const Section: React.FC<SectionProps> = ({ title, description, rows }) => (
  <div className="md:p-4 flex flex-col">
    <div className="space-y-4">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
    </div>
    <h3 className="text-sm text-muted-foreground">{description}</h3>
    <Separator className="mt-2" />
    <Table>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={index} className="flex">
            <TableCell className="flex-grow font-sm underline underline-offset-2 pl-0">
              <Link href={row.link}>{row.text}</Link>
            </TableCell>
            {row.addLink && (
              <TableCell>
                <Link
                  className="flex flex-row items-center justify-start"
                  href={row.addLink}
                >
                  <PlusIcon className="text-green-400 mr-1" />
                  Add
                </Link>
              </TableCell>
            )}
            {row.changeLink && (
              <TableCell>
                <Link
                  className="flex flex-row items-center justify-start"
                  href={row.changeLink}
                >
                  <Pencil1Icon className="text-yellow-500 mr-1" />
                  Change
                </Link>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function Page() {
  const sections = [
    {
      title: "Data",
      description: "List, add, and change data sources.",
      rows: [
        {
          link: "/admin/data",
          text: "Data sources",
          addLink: "/admin/data/add",
          changeLink: "/admin/data",
        },
      ],
    },
    {
      title: "Vector store and embeddings",
      description:
        "List, add, and change vector store collections and embeddings.",
      rows: [
        {
          link: "/admin/collections",
          text: "Collections",
          addLink: "/admin/data/add",
          changeLink: "/admin/collections",
        },
      ],
    },
    {
      title: "Chat history",
      description: "Manage chat history.",
      rows: [
        // {
        //   link: '/admin/users',
        //   text: 'Users',
        //   addLink: '/admin/users/add',
        //   changeLink: '/admin/users',
        // },
        {
          link: "/admin/chat-history",
          text: "Chat history",
          changeLink: "/admin/chat-history",
        },
      ],
    },
    // {
    //   title: 'UI settings',
    //   description: 'Configure what is shown in the UI to end users',
    //   rows: [
    //     {
    //       link: '/admin/ui-settings',
    //       text: 'UI settings',
    //       addLink: '/admin/ui-settings/add',
    //       changeLink: '/admin/ui-settings',
    //     },
    //   ],
    // },
  ];

  return (
    <div className="mt-20 flex justify-center items-stretch">
      <div className="max-w-screen-lg w-full bg-background">
        <div className="md:p-4 flex flex-col">
          <h1 className="text-4xl font-semibold tracking-tight">
            Manage your RAG Apps
          </h1>
        </div>
        {sections.map((section, index) => (
          <Section key={index} {...section} />
        ))}
      </div>
    </div>
  );
}
