export default function Page() {
    const sections = [
      {
        title: 'Data',
        description: 'List, add, and change data sources.',
        rows: [{ link: '/admin/data', text: 'Data sources' }],
      },
      {
        title: 'Vector store and embeddings',
        description: 'List, add, and change embeddings.',
        rows: [
          { link: '/admin/collections', text: 'Collections' },
          { link: '/admin/embeddings', text: 'Embeddings' },
        ],
      },
      {
        title: 'Users and chat history',
        description: 'List, add, and change users and chat history.',
        rows: [
          { link: '/admin/users', text: 'Users' },
          { link: '/admin/chat-history', text: 'Chat history' },
        ],
      },
      {
        title: 'UI settings',
        description: 'Configure what is shown in the UI to end users',
        rows: [
          { link: '/admin/ui-settings', text: 'UI settings' },
        ],
      },
    ];

    return (
      <div className="mt-20 flex justify-center items-stretch">
        <div className="max-w-screen-lg w-full bg-background">
          <div className="md:p-4 flex flex-col">
            <h2 className="text-2xl font-semibold tracking-tight">Data sources</h2>
          </div>
        </div>
      </div>
    );
  }