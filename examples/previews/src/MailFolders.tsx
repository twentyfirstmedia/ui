import * as React from "react";
import { MailFolders } from "@twentyfirstmedia/ui-core";
import type { MailFolder } from "@twentyfirstmedia/ui-core";
import { FOLDERS } from "./_mail";

const rename = (list: MailFolder[], id: string, label: string): MailFolder[] =>
  list.map((f) =>
    f.id === id ? { ...f, label } : { ...f, children: f.children && rename(f.children, id, label) },
  );
const remove = (list: MailFolder[], id: string): MailFolder[] =>
  list
    .filter((f) => f.id !== id)
    .map((f) => ({ ...f, children: f.children && remove(f.children, id) }));

export default function Preview() {
  const [folders, setFolders] = React.useState(FOLDERS);
  return (
    <div className="tf-panel" style={{ maxWidth: 300 }}>
      <MailFolders
        folders={folders}
        defaultSelected="inbox"
        defaultOpen={["clients"]}
        onRename={(id, label) => setFolders((l) => rename(l, id, label))}
        onDelete={(id) => setFolders((l) => remove(l, id))}
        onEmpty={() => {}}
        onCreate={(label, parent) =>
          setFolders((l) => {
            const folder = { id: "f" + Date.now(), label };
            if (!parent) return l.concat([folder]);
            const add = (list: MailFolder[]): MailFolder[] =>
              list.map((f) =>
                f.id === parent
                  ? { ...f, children: (f.children || []).concat([folder]) }
                  : { ...f, children: f.children && add(f.children) },
              );
            return add(l);
          })
        }
      />
    </div>
  );
}
