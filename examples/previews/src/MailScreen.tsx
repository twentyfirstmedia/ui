import * as React from "react";
import {
  AppShell,
  Button,
  Drawer,
  IconButton,
  InboxList,
  MailComposer,
  MailFilterBar,
  MailFolders,
  MailHtml,
  MailThread,
  PageHeader,
  Toaster,
  toast,
} from "@twentyfirstmedia/ui-core";
import type { InboxListItem, MailFilters } from "@twentyfirstmedia/ui-core";
import { FOLDERS, NEWSLETTER_HTML, PEOPLE } from "./_mail";

const MAILS: InboxListItem[] = [
  {
    id: 1,
    from: "Example Weekly",
    time: "09:12",
    subject: "The weekly digest",
    snippet: "Three things shipped this week: faster exports, saved views and a new audit log.",
    unread: true,
  },
  {
    id: 2,
    from: "Ida Nolan",
    time: "08:40",
    subject: "Seat upgrade before renewal",
    snippet: "We are growing faster than planned and need 40 more seats.",
    unread: true,
    attachments: true,
    agent: { label: "Draft ready", tone: "highlight" },
  },
  {
    id: 3,
    from: "Jonah Petit",
    time: "Yesterday",
    subject: "Pricing review moved",
    snippet: "Can we move the pricing review to Thursday so Growth can join?",
    starred: true,
  },
  {
    id: 4,
    from: "Northwind Billing",
    time: "Mon",
    subject: "Invoice RE-2026-0412",
    snippet: "Your invoice for April is attached.",
    attachments: true,
  },
];

function App() {
  const [open, setOpen] = React.useState<string | number>(1);
  const [items, setItems] = React.useState(MAILS);
  const [filters, setFilters] = React.useState<MailFilters>({});
  const [compose, setCompose] = React.useState(false);
  const [unsubscribed, setUnsubscribed] = React.useState(false);
  const shown = items.filter(
    (m) =>
      (!filters.unread || m.unread) &&
      (!filters.starred || m.starred) &&
      (!filters.attachments || m.attachments),
  );
  const current = items.find((m) => m.id === open);
  return (
    <AppShell
      brand="Halo"
      tag="Mail"
      user={{ name: "Mara Ellis", email: "mara@example.com" }}
      active="Inbox"
      dock={false}
    >
      <div className="tf-in">
        <PageHeader
          title="Inbox"
          subtitle="12 unread"
          actions={[
            <Button key="c" icon="edit" onClick={() => setCompose(true)}>
              Compose
            </Button>,
          ]}
        />
      </div>
      <div
        className="tf-grid tf-in"
        style={
          {
            "--cols": "248px minmax(0, 1fr)",
            alignItems: "start",
            "--d": "120ms",
          } as React.CSSProperties
        }
      >
        <div className="tf-panel" style={{ gap: 8 }}>
          <MailFolders
            folders={FOLDERS}
            defaultSelected="inbox"
            defaultOpen={["clients"]}
            onCreate={() => {}}
            onRename={() => {}}
            onDelete={() => {}}
            onEmpty={() => {}}
          />
        </div>
        <div className="tf-col" style={{ gap: 16 }}>
          <div className="tf-panel" style={{ gap: 12 }}>
            <MailFilterBar
              value={filters}
              onChange={setFilters}
              agents={[{ value: "support", label: "Support agent" }]}
            />
            <InboxList
              items={shown}
              selected={open}
              onOpen={(m) => {
                setOpen(m.id);
                setItems((l) => l.map((x) => (x.id === m.id ? { ...x, unread: false } : x)));
              }}
              selectable
              bulkActions={[
                {
                  label: "Archive",
                  icon: "archive",
                  onClick: (ids) => setItems((l) => l.filter((m) => !ids.includes(m.id))),
                },
                {
                  label: "Mark read",
                  icon: "check",
                  onClick: (ids) =>
                    setItems((l) =>
                      l.map((m) => (ids.includes(m.id) ? { ...m, unread: false } : m)),
                    ),
                },
              ]}
              onStar={(m, starred) =>
                setItems((l) => l.map((x) => (x.id === m.id ? { ...x, starred } : x)))
              }
            />
          </div>
          {current && (
            <div className="tf-panel" style={{ gap: 12 }}>
              <MailThread
                subject={current.subject}
                actions={
                  <>
                    <IconButton
                      icon="reply"
                      variant="ghost"
                      label="Reply"
                      onClick={() => setCompose(true)}
                    />
                    <IconButton icon="archive" variant="ghost" label="Archive" />
                  </>
                }
                unsubscribe={
                  current.id === 1
                    ? {
                        sender: "Example Weekly",
                        done: unsubscribed,
                        onUnsubscribe: () => {
                          setUnsubscribed(true);
                          toast("Unsubscribed from Example Weekly");
                        },
                      }
                    : undefined
                }
                messages={[
                  {
                    id: current.id,
                    from: current.from,
                    to: "to me",
                    time: current.time,
                    body:
                      current.id === 1 ? (
                        <MailHtml html={NEWSLETTER_HTML} title={current.subject} />
                      ) : (
                        current.snippet
                      ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
      {compose && (
        <Drawer title="New message" onClose={() => setCompose(false)} width={640}>
          <MailComposer
            senders={[
              { address: "mara@example.com", name: "Mara Ellis" },
              { address: "support@example.com" },
            ]}
            suggestions={PEOPLE}
            signature="Mara Ellis · Example Inc."
            onSend={() => setCompose(false)}
            onUndoSend={() => setCompose(true)}
            onSchedule={() => setCompose(false)}
            onFiles={() => {}}
          />
        </Drawer>
      )}
      <Toaster />
    </AppShell>
  );
}

export default function Preview() {
  return <App />;
}
