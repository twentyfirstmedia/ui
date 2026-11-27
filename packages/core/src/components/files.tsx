"use client";
/**
 * FileBrowser: a folder's files and subfolders as a grid or a list, with breadcrumbs, search,
 * preview (images and PDFs from your URLs), upload by drop and picker with progress per file,
 * new folder, rename in place, move through a folder picker, trash, and the bulk action bar for a
 * selection. The app does the storage and the uploads; the component shows and asks.
 */
import * as React from "react";
import { cx } from "../cx.js";
import { useFormat, useLinkAs, useStrings } from "../context.js";
import { FILES_STRINGS } from "../strings.js";
import { Icon } from "../Icon.js";
import { registerIcons, type IconName } from "../icons.js";
import { folderInput, folderPlus, layoutGrid } from "../icon-library.js";
import { moveFocus, useControlled, useId } from "../hooks.js";
import { Button, IconButton } from "./foundation.js";
import { SearchField, cbox } from "./inputs.js";
import { Segmented } from "./forms.js";
import { Breadcrumb } from "./navigation.js";
import { Popover } from "./overlays.js";
import { ConfirmDialog, EmptyState, Menu, Modal } from "./feedback.js";
import { Progress } from "./data-display.js";
import { Spinner, TreeView } from "./building-blocks.js";
import { BulkActionBar } from "./common.js";
import { Drawer, FileThumb } from "./workspace.js";
import type {
  FileBrowserFolder,
  FileBrowserItem,
  FileBrowserProps,
  FileKind,
  MenuItem,
  TreeItem,
} from "./types.js";

registerIcons({ folderInput, folderPlus, layoutGrid });

const TINT: Record<string, string> = {
  pdf: "blush",
  doc: "sky",
  sheet: "mint",
  fig: "lilac",
  img: "butter",
  zip: "butter",
  folder: "sky",
};

/** The kind of a file from its own `kind`, its MIME type or its extension. */
export function fileKindOf(
  item: Pick<FileBrowserItem, "kind" | "name" | "mime">,
): FileKind | "folder" {
  if (item.kind) return item.kind;
  const mime = item.mime || "";
  const ext = (/\.([a-z0-9]+)$/i.exec(item.name)?.[1] || "").toLowerCase();
  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (mime.startsWith("image/") || /^(png|jpe?g|gif|webp|avif|svg|heic)$/.test(ext)) return "img";
  if (/^(xlsx?|csv|ods|numbers|sheet)$/.test(ext) || mime.includes("spreadsheet")) return "sheet";
  if (/^(zip|tar|gz|7z|rar)$/.test(ext) || mime.includes("zip")) return "zip";
  if (ext === "fig" || ext === "sketch") return "fig";
  return "doc";
}

function previewKind(item: FileBrowserItem): "image" | "pdf" | null {
  if (!item.preview) return null;
  const k = fileKindOf(item);
  if (k === "pdf") return "pdf";
  if (k === "img" || (item.mime || "").startsWith("image/")) return "image";
  return null;
}

function toTree(folders: FileBrowserFolder[], skip: Set<string>): TreeItem[] {
  return folders
    .filter((f) => !skip.has(f.id))
    .map((f) => ({
      id: f.id,
      label: f.name,
      icon: "folder" as IconName,
      ...(f.children?.length ? { children: toTree(f.children, skip) } : {}),
    }));
}

type Ask = { kind: "folder" | "move" | "trash"; ids: string[] } | null;

export function FileBrowser(p: FileBrowserProps) {
  const t = useStrings(FILES_STRINGS);
  const { formatNumber, formatDate } = useFormat();
  const Link = useLinkAs(p.linkAs);
  const uid = useId("fb");
  const [view, setView] = useControlled<"grid" | "list">(
    p.view,
    p.defaultView ?? "grid",
    p.onViewChange,
  );
  const [selected, setSelected] = useControlled<string[]>(
    p.selected,
    p.defaultSelected ?? [],
    p.onSelectedChange,
  );
  const [query, setQuery] = useControlled<string>(p.query, p.defaultQuery ?? "", p.onQueryChange);
  const [previewId, setPreview] = useControlled<string | null>(
    p.preview,
    p.defaultPreview ?? null,
    p.onPreviewChange,
  );
  const [ask, setAsk] = React.useState<Ask>(null);
  const [folderName, setFolderName] = React.useState("");
  const [target, setTarget] = React.useState<string | undefined>(undefined);
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [drag, setDrag] = React.useState(false);
  const picker = React.useRef<HTMLInputElement>(null);
  const list = React.useRef<HTMLUListElement>(null);

  const q = query.trim().toLowerCase();
  const shown = React.useMemo(() => {
    const filtered =
      p.localSearch === false || !q
        ? p.items
        : p.items.filter((i) => i.name.toLowerCase().includes(q));
    if (p.foldersFirst === false) return filtered;
    return [...filtered].sort(
      (a, b) => Number(fileKindOf(b) === "folder") - Number(fileKindOf(a) === "folder"),
    );
  }, [p.items, q, p.localSearch, p.foldersFirst]);
  const on = new Set(selected);
  const allOn = shown.length > 0 && shown.every((i) => on.has(i.id));
  const someOn = !allOn && shown.some((i) => on.has(i.id));
  const byId = new Map(p.items.map((i) => [i.id, i]));
  const previewed = previewId ? byId.get(previewId) : undefined;

  const size = (s: number | string | undefined) => {
    if (s == null || s === "") return "";
    if (typeof s === "string") return s;
    const units = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"];
    let v = s,
      u = 0;
    while (v >= 1000 && u < units.length - 1) {
      v /= 1000;
      u++;
    }
    return formatNumber(v, {
      style: "unit",
      unit: units[u],
      unitDisplay: "short",
      maximumFractionDigits: u === 0 || v >= 10 ? 0 : 1,
    });
  };
  const when = (d: FileBrowserItem["modified"]) => {
    if (d == null) return "";
    if (typeof d === "string" && Number.isNaN(Date.parse(d))) return d;
    const date = new Date(d);
    return formatDate(date, {
      day: "numeric",
      month: "short",
      ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
    });
  };
  const metaOf = (i: FileBrowserItem) =>
    i.meta ??
    (fileKindOf(i) === "folder"
      ? i.count != null
        ? t.itemsN(i.count)
        : when(i.modified)
      : [size(i.size), when(i.modified)].filter(Boolean).join(" · "));

  const toggle = (id: string) =>
    setSelected(on.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const open = (i: FileBrowserItem) => {
    if (fileKindOf(i) === "folder") {
      p.onNavigate?.(i.id);
      return;
    }
    p.onOpen?.(i);
    if (previewKind(i) && p.previewOnOpen !== false) setPreview(i.id);
  };
  const startRename = (i: FileBrowserItem) => {
    if (!p.onRename) return;
    setDraft(i.name);
    setRenaming(i.id);
  };
  const commitRename = () => {
    const id = renaming;
    setRenaming(null);
    const item = id ? byId.get(id) : undefined;
    const name = draft.trim();
    if (item && name && name !== item.name) void p.onRename?.(item.id, name);
  };
  const askMove = (ids: string[]) => {
    setTarget(undefined);
    setAsk({ kind: "move", ids });
  };
  const askTrash = (ids: string[]) => setAsk({ kind: "trash", ids });
  const selIds = selected.filter((id) => byId.has(id));
  const canMove = !!p.onMove && !!p.folders;

  const menuFor = (i: FileBrowserItem): (MenuItem | "-")[] => {
    const ids = [i.id];
    const items: (MenuItem | "-")[] = [{ label: t.open, icon: "eye", onClick: () => open(i) }];
    if (p.onRename)
      items.push({ label: t.rename, icon: "edit", shortcut: "F2", onClick: () => startRename(i) });
    if (canMove) items.push({ label: t.moveTo, icon: "folderInput", onClick: () => askMove(ids) });
    if (p.onDownload && fileKindOf(i) !== "folder")
      items.push({ label: t.download, icon: "download", onClick: () => p.onDownload?.(ids) });
    if (p.onTrash)
      items.push("-", {
        label: t.moveToTrash,
        icon: "trash",
        danger: true,
        onClick: () => askTrash(ids),
      });
    return items;
  };

  const onItemKey = (e: React.KeyboardEvent<HTMLElement>, i: FileBrowserItem) => {
    if (moveFocus(e, list.current, ".tf-fb-open", view === "grid" ? "both" : "vertical")) return;
    if (e.key === " ") {
      e.preventDefault();
      toggle(i.id);
    } else if (e.key === "F2") {
      e.preventDefault();
      startRename(i);
    } else if ((e.key === "Delete" || e.key === "Backspace") && p.onTrash) {
      e.preventDefault();
      askTrash(on.has(i.id) ? selIds : [i.id]);
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      setSelected(shown.map((x) => x.id));
    } else if (e.key === "Escape" && selected.length) {
      setSelected([]);
    }
  };

  const files = (fl: FileList | null) => {
    const arr = fl ? Array.from(fl) : [];
    if (arr.length) p.onUpload?.(arr);
  };

  const item = (i: FileBrowserItem) => {
    const kind = fileKindOf(i);
    const folder = kind === "folder";
    const checked = on.has(i.id);
    const thumb = folder ? (
      <Icon name="folder" size={view === "grid" ? 36 : 18} />
    ) : i.thumbnail ? (
      <img src={i.thumbnail} alt="" loading="lazy" draggable={false} />
    ) : view === "grid" ? (
      <FileThumb kind={kind} title={i.name} />
    ) : (
      <Icon name={kind === "img" ? "image" : kind === "sheet" ? "chart" : "file"} size={18} />
    );
    return (
      <li
        key={i.id}
        className={cx(
          "tf-fb-item",
          checked && "on",
          folder && "folder",
          p.surface && "tf-" + p.surface,
        )}
      >
        <span className="tf-fb-check">
          {cbox({ checked, onChange: () => toggle(i.id), label: t.selectItem(i.name) })}
        </span>
        {renaming === i.id ? (
          <span className="tf-fb-open renaming">
            <span className={cx("tf-fb-thumb", "tf-thumb", "tf-bg-" + (TINT[kind] || "sky"))}>
              {thumb}
            </span>
            <input
              className="tf-input tf-fb-rename"
              aria-label={t.renameItem(i.name)}
              value={draft}
              autoFocus
              onFocus={(e) => {
                const dot = e.target.value.lastIndexOf(".");
                e.target.setSelectionRange(0, dot > 0 && !folder ? dot : e.target.value.length);
              }}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(null);
              }}
              onBlur={commitRename}
            />
          </span>
        ) : (
          <button
            type="button"
            className="tf-fb-open"
            aria-label={folder ? t.openFolder(i.name) : undefined}
            onClick={() => open(i)}
            onDoubleClick={(e) => e.preventDefault()}
            onKeyDown={(e) => onItemKey(e, i)}
          >
            <span className={cx("tf-fb-thumb", "tf-thumb", "tf-bg-" + (TINT[kind] || "sky"))}>
              {thumb}
            </span>
            <span className="tf-fb-name">{i.name}</span>
            <span className="tf-fb-meta">
              {metaOf(i)}
              {i.shared && <Icon name="users" size={12} label={t.shared} />}
            </span>
            {view === "list" && <span className="tf-fb-col date">{when(i.modified)}</span>}
            {view === "list" && (
              <span className="tf-fb-col size">{folder ? "" : size(i.size)}</span>
            )}
          </button>
        )}
        <span className="tf-fb-more">
          <Popover
            align="end"
            width={220}
            trigger={(s) => (
              <IconButton
                icon="more"
                variant="ghost"
                size="sm"
                label={t.actionsFor(i.name)}
                aria-haspopup="menu"
                aria-expanded={s.open}
                onClick={s.toggle}
              />
            )}
          >
            {(s) => (
              <Menu items={menuFor(i)} label={t.actionsFor(i.name)} autoFocus onClose={s.close} />
            )}
          </Popover>
        </span>
      </li>
    );
  };

  const doneAsk = () => setAsk(null);
  const movingIds = ask?.kind === "move" ? ask.ids : [];

  return (
    <section
      className={cx("tf-fb", drag && "dragging", p.className)}
      style={p.style}
      aria-label={p.label || t.files}
      aria-busy={p.loading || undefined}
      onDragOver={(e) => {
        if (!p.onUpload || !Array.from(e.dataTransfer?.types || []).includes("Files")) return;
        e.preventDefault();
        if (!drag) setDrag(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDrag(false);
      }}
      onDrop={(e) => {
        if (!p.onUpload) return;
        e.preventDefault();
        setDrag(false);
        files(e.dataTransfer.files);
      }}
    >
      <div className="tf-fb-bar">
        {p.path && p.path.length > 0 && (
          <Breadcrumb
            className="tf-fb-crumbs"
            linkAs={Link}
            items={p.path.map((c) => ({ label: c.name, ...(c.href ? { href: c.href } : {}) }))}
            onNavigate={
              p.path.some((c) => c.href) ? undefined : (n) => p.onNavigate?.(p.path?.[n]?.id ?? "")
            }
          />
        )}
        <div className="tf-fb-tools">
          {p.search !== false && (
            <SearchField
              className="tf-fb-search"
              placeholder={p.searchPlaceholder || t.searchFiles}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          <Segmented
            size="sm"
            label={t.view}
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { value: "grid", label: t.gridView, icon: "layoutGrid" },
              { value: "list", label: t.listView, icon: "list" },
            ]}
          />
          {p.actions}
          {p.onCreateFolder && (
            <Button
              size="sm"
              variant="secondary"
              icon="folderPlus"
              onClick={() => {
                setFolderName("");
                setAsk({ kind: "folder", ids: [] });
              }}
            >
              {t.newFolder}
            </Button>
          )}
          {p.onUpload && (
            <>
              <Button size="sm" icon="upload" onClick={() => picker.current?.click()}>
                {t.upload}
              </Button>
              <input
                ref={picker}
                type="file"
                multiple
                accept={p.accept}
                hidden
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  files(e.target.files);
                  e.target.value = "";
                }}
              />
            </>
          )}
        </div>
      </div>

      {p.uploads && p.uploads.length > 0 && (
        <ul className="tf-fb-uploads" aria-label={t.uploads}>
          {p.uploads.map((u) => (
            <li key={u.id} className={cx("tf-fb-upload", u.error && "error")}>
              <Icon name={u.error ? "x" : u.progress >= 100 ? "check" : "upload"} size={16} />
              <span className="tf-fb-upload-text">
                <b>{u.name}</b>
                <small>
                  {u.error ||
                    [
                      u.size != null ? size(u.size) : "",
                      u.parts && u.parts > 1 ? t.uploadPart(u.part ?? 0, u.parts) : "",
                      u.progress >= 100 ? t.fileUploaded : t.uploadPercent(Math.round(u.progress)),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                </small>
                {!u.error && u.progress < 100 && (
                  <Progress value={u.progress} label={t.uploadingFile(u.name)} />
                )}
              </span>
              {p.onCancelUpload && u.progress < 100 && !u.error && (
                <IconButton
                  icon="x"
                  variant="ghost"
                  size="sm"
                  label={t.cancelUploadOf(u.name)}
                  onClick={() => p.onCancelUpload?.(u.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {shown.length > 0 && (
        <div className={cx("tf-fb-head", view)}>
          <label className="tf-check">
            {cbox({
              checked: allOn,
              indeterminate: someOn,
              onChange: () =>
                setSelected(
                  allOn
                    ? selected.filter((id) => !shown.some((i) => i.id === id))
                    : shown.map((i) => i.id),
                ),
              label: t.selectAll,
            })}
            <span>{t.itemsN(shown.length)}</span>
          </label>
          {view === "list" && (
            <>
              <span className="tf-fb-col date" aria-hidden>
                {t.modified}
              </span>
              <span className="tf-fb-col size" aria-hidden>
                {t.size}
              </span>
              <span className="tf-fb-more" />
            </>
          )}
        </div>
      )}

      {p.loading && !shown.length ? (
        <div className="tf-fb-loading">
          <Spinner label={t.loadingFiles} />
        </div>
      ) : shown.length ? (
        <ul ref={list} className={cx("tf-fb-items", view)} aria-labelledby={uid + "-n"}>
          {shown.map(item)}
        </ul>
      ) : (
        <EmptyState
          icon={q ? "search" : "folder"}
          tint="sky"
          title={q ? t.noFilesMatch(query.trim()) : p.emptyText || t.emptyFolder}
          text={!q && p.onUpload ? t.filesDropHint : undefined}
        />
      )}
      <span id={uid + "-n"} className="tf-sr-only">
        {p.label || t.files}
      </span>

      {drag && (
        <div className="tf-fb-drop" aria-hidden>
          <Icon name="upload" size={28} />
          <b>{t.dropToUpload}</b>
        </div>
      )}

      <BulkActionBar
        count={selIds.length}
        onClear={() => setSelected([])}
        actions={[
          ...(p.onDownload
            ? [
                {
                  label: t.download,
                  icon: "download" as IconName,
                  onClick: () => p.onDownload?.(selIds),
                },
              ]
            : []),
          ...(canMove
            ? [{ label: t.move, icon: "folderInput" as IconName, onClick: () => askMove(selIds) }]
            : []),
          ...(p.onRename && selIds.length === 1
            ? [
                {
                  label: t.rename,
                  icon: "edit" as IconName,
                  onClick: () => {
                    const one = byId.get(selIds[0] ?? "");
                    if (one) startRename(one);
                  },
                },
              ]
            : []),
          ...(p.onTrash
            ? [
                {
                  label: t.moveToTrash,
                  icon: "trash" as IconName,
                  danger: true,
                  onClick: () => askTrash(selIds),
                },
              ]
            : []),
        ]}
      />

      {previewed && (
        <Drawer
          title={previewed.name}
          subtitle={metaOf(previewed)}
          width={720}
          onClose={() => setPreview(null)}
        >
          <div className="tf-fb-preview">
            {previewKind(previewed) === "image" ? (
              <img src={previewed.preview} alt={previewed.alt ?? previewed.name} />
            ) : previewKind(previewed) === "pdf" ? (
              <iframe src={previewed.preview} title={t.previewOf(previewed.name)} />
            ) : (
              <EmptyState icon="file" tint="sky" title={t.noPreview} />
            )}
          </div>
          <div className="tf-fb-preview-actions">
            {previewed.href && (
              <Button asChild variant="secondary" icon="arrowUpRight">
                <Link href={previewed.href}>{t.open}</Link>
              </Button>
            )}
            {p.onDownload && (
              <Button icon="download" onClick={() => p.onDownload?.([previewed.id])}>
                {t.download}
              </Button>
            )}
          </div>
        </Drawer>
      )}

      {ask?.kind === "folder" && (
        <Modal
          title={t.newFolder}
          icon="folderPlus"
          onClose={doneAsk}
          actions={[
            <Button key="c" variant="ghost" onClick={doneAsk}>
              {t.cancel}
            </Button>,
            <Button key="ok" type="submit" form={uid + "-nf"} disabled={!folderName.trim()}>
              {t.create}
            </Button>,
          ]}
        >
          <form
            id={uid + "-nf"}
            onSubmit={(e) => {
              e.preventDefault();
              const name = folderName.trim();
              if (!name) return;
              doneAsk();
              void p.onCreateFolder?.(name);
            }}
          >
            <label className="tf-col" style={{ gap: 6 }}>
              <span className="tf-label">{t.folderName}</span>
              <input
                className="tf-input"
                autoFocus
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </label>
          </form>
        </Modal>
      )}

      {ask?.kind === "move" && (
        <Modal
          title={t.moveItems(movingIds.length)}
          icon="folderInput"
          onClose={doneAsk}
          actions={[
            <Button key="c" variant="ghost" onClick={doneAsk}>
              {t.cancel}
            </Button>,
            <Button
              key="ok"
              disabled={!target}
              onClick={() => {
                if (!target) return;
                doneAsk();
                setSelected(selected.filter((id) => !movingIds.includes(id)));
                void p.onMove?.(movingIds, target);
              }}
            >
              {t.moveHere}
            </Button>,
          ]}
        >
          <div className="tf-fb-picker">
            <TreeView
              label={t.chooseFolder}
              items={toTree(p.folders || [], new Set(movingIds))}
              defaultOpen={(p.folders || []).map((f) => f.id)}
              selected={target}
              onSelect={setTarget}
            />
          </div>
        </Modal>
      )}

      <ConfirmDialog
        open={ask?.kind === "trash"}
        danger
        icon="trash"
        title={t.trashTitle(ask?.kind === "trash" ? ask.ids.length : 0)}
        text={t.trashText}
        confirmLabel={t.moveToTrash}
        onConfirm={() => {
          const ids = ask?.ids || [];
          doneAsk();
          setSelected(selected.filter((id) => !ids.includes(id)));
          void p.onTrash?.(ids);
        }}
        onCancel={doneAsk}
      />
    </section>
  );
}
