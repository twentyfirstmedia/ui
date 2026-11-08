import type { ReactNode } from "react";

export type Tint = "sky" | "mint" | "lilac" | "butter" | "blush";
export type IconName = "plus" | "minus" | "check" | "x" | "more" | "search" | "bell" | "clock" | "eye" | "edit" | "trash" | "users" | "user" | "home" | "chart" | "mail" | "grid" | "share" | "menu" | "play" | "calendar" | "file" | "card" | "swap" | "send" | "download" | "book" | "chevronDown" | "chevronLeft" | "image" | "pin" | "map" | "upload" | "copy" | "bed" | "ruler" | "wallet" | "ban" | "list" | "layers" | "bold" | "italic" | "underline" | "olist" | "heading" | "quote" | "undo" | "redo" | "monitor" | "phone" | "expand" | "sun" | "cookie" | "webhook" | "pause" | "archive" | "reply" | "help" | "cpu" | "chevronRight" | "arrowUpRight" | "sparkle" | "filter" | "settings" | "lock" | "link" | "paperclip" | "star" | "flag" | "trend" | "globe" | "inbox" | "logout" | "moon" | "zap" | "folder" | "refresh" | "shield" | "thumbUp" | "thumbDown" | "arrowUp" | "heart" | "tag" | "cart" | "package" | "truck" | "code" | "terminal" | "bot" | "key" | "server" | "database" | "branch";

export interface IconProps { name: IconName; size?: number; label?: string; className?: string }
export interface ButtonProps { variant?: "primary" | "secondary" | "soft" | "ghost" | "danger"; size?: "md" | "sm"; icon?: IconName; iconRight?: IconName; disabled?: boolean; type?: "button" | "submit"; onClick?: () => void; children?: ReactNode }
export interface IconButtonProps { icon: IconName; label: string; variant?: "soft" | "solid" | "outline"; size?: "sm" | "md" | "lg"; onClick?: () => void }
export interface ChipProps { selected?: boolean; icon?: IconName; count?: number; onClick?: () => void; children?: ReactNode }
export interface BadgeProps { tone?: "success" | "info" | "warning" | "danger" | "highlight" | "neutral"; dot?: boolean; live?: boolean; children?: ReactNode }
export interface TintIconProps { icon: IconName; tint?: Tint | "plain"; label?: string }
export interface AvatarProps { name: string; src?: string; size?: number; tint?: Tint }
export interface AvatarStackProps { names: string[]; max?: number; size?: number }
export interface FieldProps { label?: string; hint?: string; error?: string }
export interface InputProps extends FieldProps { type?: string; placeholder?: string; value?: string; defaultValue?: string; disabled?: boolean; onChange?: (e: unknown) => void }
export interface SelectProps extends FieldProps { options: string[]; value?: string; defaultValue?: string; onChange?: (e: unknown) => void }
export interface TextareaProps extends FieldProps { placeholder?: string; defaultValue?: string; rows?: number }
export interface SearchFieldProps { placeholder?: string; shortcut?: string; value?: string; onChange?: (e: unknown) => void }
export interface CheckboxProps { checked?: boolean; defaultChecked?: boolean; onChange?: (e: unknown) => void; children?: ReactNode }
export interface SwitchProps { checked?: boolean; defaultChecked?: boolean; onChange?: (e: unknown) => void; children?: ReactNode }
export interface TabsProps { items: string[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; block?: boolean }
export interface StatTileProps { value: ReactNode; label: string; tint?: Tint | "surface" | "placeholder"; delta?: string }
export interface CardProps { title?: string; description?: string; meta?: string[]; corner?: ReactNode; status?: ReactNode; actions?: ReactNode[]; tint?: Tint | "surface"; onClick?: () => void; children?: ReactNode }
export interface EventCardProps { kind?: "meeting" | "deadline" | "review" | "launch" | "incident"; label: string; date: string; time: string; tint?: Tint; icon?: IconName; actions?: boolean; children?: ReactNode }
export interface PanelProps { side?: boolean; title?: string; subtitle?: string; action?: ReactNode; children?: ReactNode }
export interface PageHeaderProps { crumbs?: string[]; title: string; subtitle?: string; actions?: ReactNode[] }
export interface TopBarProps { brand?: string; tag?: string; items: { label: string; icon: IconName }[]; active?: string; user?: { name: string; email?: string } }
export interface RailItem { label: string; icon: IconName; active?: boolean; count?: number }
export interface SideRailProps { top?: RailItem[]; bottom?: RailItem[] }
export interface DockProps { items: { label: string; icon: IconName; tint?: Tint | "plain" }[]; label?: string }
export interface TableColumn { key: string; label: string; align?: "left" | "right"; render?: (row: any) => ReactNode }
export interface TableProps { columns: TableColumn[]; rows: Record<string, any>[] }
export interface ProgressProps { value: number; tint?: "sky" | "mint" | "butter"; label?: string }
export interface ToastProps { icon?: IconName; tint?: Tint; action?: string; children?: ReactNode }
export interface EmptyStateProps { title: string; text?: string; icon?: IconName; tint?: Tint; action?: ReactNode }
export interface BreadcrumbProps { items: string[] }
export interface PaginationProps { total: number; page?: number }
export interface AppShellProps { active?: string; brand?: string; tag?: string; nav?: { label: string; icon: IconName }[]; user?: { name: string; email?: string }; side?: ReactNode; dock?: boolean; dockItems?: DockProps["items"]; railTop?: RailItem[]; railBottom?: RailItem[]; children?: ReactNode }
export interface StaggerProps { as?: string; className?: string; style?: Record<string, any>; delay?: number; children?: ReactNode }
export interface CountUpProps { value: string | number; duration?: number; delay?: number; className?: string }
export interface ListRowProps { avatar?: string; icon?: IconName; tint?: Tint | "plain"; leading?: ReactNode; title: ReactNode; subtitle?: ReactNode; meta?: ReactNode; trailing?: ReactNode; unread?: boolean; active?: boolean; onClick?: () => void }
export interface TimelineProps { items: { avatar?: string; icon?: IconName; tint?: Tint | "plain"; text: ReactNode; time: string }[]; delay?: number }
export interface FileRowProps { name: string; meta: string; kind?: "pdf" | "fig" | "sheet" | "doc" | "zip" }
export interface KanbanColumnProps { title: string; dot?: Tint; delay?: number; children?: ReactNode }
export interface ProgressRingProps { value: number; tint?: Tint | "ink"; size?: number; stroke?: number; caption?: string; label?: string }
export interface BarChartProps { data: { label: string; value: number; tint?: Tint | "ink" }[]; tint?: Tint | "ink"; height?: number; width?: number; barWidth?: number; format?: (v: number) => string; label?: string }
export interface LineChartProps { labels: string[]; series: { values: number[]; tint?: Tint | "ink"; area?: boolean }[]; height?: number; width?: number; format?: (v: number) => string; label?: string }
export interface SparklineProps { values: number[]; tint?: Tint | "ink"; width?: number; height?: number; label?: string }
export interface DonutProps { data: { label: string; value: number; tint?: Tint | "ink" }[]; center?: string; caption?: string; size?: number; stroke?: number; legend?: boolean; label?: string }
export interface SkeletonProps { variant?: "text" | "title" | "circle" | "block"; width?: number | string; height?: number | string }
export interface MenuProps { items: ({ label: string; icon?: IconName; shortcut?: string; danger?: boolean } | "-")[] }
export interface ModalProps { title: string; text?: string; icon?: IconName; tint?: Tint; actions?: ReactNode[]; onClose?: () => void; style?: Record<string, any>; children?: ReactNode }
/** Mounts a demo page with a "Replay motion" button that re-runs every entrance. */
export declare function mountPage(App: () => ReactNode, el?: Element): void;
export interface SubNavItem { id?: string; label: string; icon: IconName; count?: number }
export interface SubNavProps { eyebrow?: string; action?: { label: string; icon?: IconName; onClick?: () => void }; items: SubNavItem[]; current?: string; onPick?: (id: string) => void; children?: ReactNode }
export interface DrawerProps { title: string; subtitle?: string; avatar?: string; onClose?: () => void; width?: number | string; inline?: boolean; children?: ReactNode }
export interface PaletteItem { id?: string | number; group?: string; label: string; hint?: string; icon?: IconName; tint?: Tint | "plain"; run?: () => void; searchOnly?: boolean }
export interface CommandPaletteProps { items: PaletteItem[]; onClose?: () => void; placeholder?: string; inline?: boolean }
export interface NotificationItem { id: string | number; icon: IconName; tint?: Tint | "plain"; title: string; text?: string; time?: string; unread?: boolean }
export interface NotificationListProps { items: NotificationItem[]; onOpen?: (n: NotificationItem) => void; onReadAll?: () => void }
export interface FlowStep { kind: "trigger" | "condition" | "agent" | "approval" | "action"; text: string }
export interface FlowProps { steps: FlowStep[]; active?: number | null; waiting?: boolean; onApprove?: () => void; onReject?: () => void; tools?: (step: FlowStep, index: number) => ReactNode }
export type FileKind = "pdf" | "doc" | "sheet" | "fig" | "img" | "zip";
export interface FileCardProps { name: string; kind: FileKind; size?: string; meta?: string; shared?: boolean; onClick?: () => void }
export interface FileThumbProps { kind: FileKind; title?: string; big?: boolean; entries?: string[] }
export interface WizardProps { steps: { id?: string; label: string; icon?: IconName }[]; current?: number; done?: Record<string, boolean>; onPick?: (i: number) => void; footer?: ReactNode; brand?: string; label?: string; children?: ReactNode }
export interface PermissionMatrixProps { roles: { name: string; people?: number; locked?: boolean; levels: (0 | 1 | 2 | 3)[] }[]; areas: string[]; onChange?: (roleIndex: number, areaIndex: number, nextLevel: number) => void }
export interface InvoicePreviewProps { number: string | number; from?: string; to: string; issued: string; due: string; lines: { d: string; q: number; u: number; v: number }[]; note?: string; kind?: string; brand?: string; format?: (n: number) => string }
export interface TransactionRowProps { text: string; date: string; amount: number; matched?: boolean; matchRef?: string; hint?: string; onMatch?: () => void }
/** Traps keyboard focus inside `ref` while mounted, closes on Escape, and restores focus afterwards. */
export declare function useTrap(ref: { current: HTMLElement | null }, onClose?: () => void): void;

/* ── Kit 2: forms, overlays, data table, charts ── */
export type Tone = "success" | "info" | "warning" | "danger" | "highlight" | "neutral" | Status | "error";
export interface Option { value: string; label: string; hint?: string; icon?: IconName; avatar?: boolean; disabled?: boolean }
export interface FormFieldProps { id?: string; label?: string; required?: boolean; optional?: boolean; hint?: string; error?: string | null; success?: string | null; children?: ReactNode }
export interface TextFieldProps extends Omit<FormFieldProps, "children"> { type?: string; icon?: IconName; suffix?: ReactNode; value?: string; defaultValue?: string; placeholder?: string; disabled?: boolean; autoComplete?: string; onChange?: (e: unknown) => void; onBlur?: (e: unknown) => void }
export interface RadioGroupProps { label?: string; options: (string | Option)[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; cards?: boolean; hint?: string }
export interface SegmentedProps { options: (string | Option)[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; size?: "sm"; block?: boolean; label?: string }
export interface ComboboxProps { label?: string; options: (string | Option)[]; value?: string | string[] | null; defaultValue?: string | string[]; onChange?: (v: any) => void; multiple?: boolean; creatable?: boolean; placeholder?: string; hint?: string; error?: string; required?: boolean }
export interface TagInputProps { label?: string; value?: string[]; defaultValue?: string[]; onChange?: (v: string[]) => void; placeholder?: string; hint?: string; error?: string }
export interface DateRange { from: Date | null; to: Date | null }
export interface DatePickerProps { label?: string; range?: boolean; value?: Date | DateRange | null; defaultValue?: Date | DateRange; onChange?: (v: any) => void; presets?: boolean; min?: Date; max?: Date; today?: Date; placeholder?: string; hint?: string; error?: string; required?: boolean }
export interface CalendarProps { range?: boolean; value?: Date | DateRange | null; onChange: (v: any) => void; today?: Date; min?: Date; max?: Date; month?: Date }
export interface NumberInputProps { label?: string; value?: number; defaultValue?: number; onChange?: (n: number) => void; min?: number; max?: number; step?: number; unit?: string; hint?: string; error?: string }
export interface SliderProps { label?: string; min?: number; max?: number; step?: number; value?: number; defaultValue?: number; onChange?: (n: number) => void; format?: (n: number) => string; marks?: boolean; hint?: string }
export interface OtpInputProps { length?: number; onComplete?: (code: string) => void; error?: boolean; label?: string }
export interface UploadFile { id: string; name: string; size: number; progress: number }
export interface FileDropProps { files?: UploadFile[]; onChange?: (f: UploadFile[]) => void; title?: string; hint?: string; accept?: string; multiple?: boolean }
export interface TooltipProps { label: ReactNode; shortcut?: string; side?: "top" | "bottom" | "left" | "right"; children: ReactNode }
export interface PopoverProps { trigger: ReactNode | ((s: { open: boolean; toggle: () => void }) => ReactNode); open?: boolean; onOpenChange?: (o: boolean) => void; align?: "start" | "end"; side?: "top" | "bottom"; width?: number; flush?: boolean; block?: boolean; role?: string; children?: ReactNode | ((s: { close: () => void }) => ReactNode) }
export interface AlertProps { tone?: Exclude<Tone, "neutral">; title?: ReactNode; icon?: IconName; action?: ReactNode; onDismiss?: () => void; children?: ReactNode }
export interface ConfirmDialogProps { open: boolean; title: string; text?: string; danger?: boolean; icon?: IconName; confirmLabel?: string; cancelLabel?: string; confirmText?: string; onConfirm: () => void; onCancel: () => void }
export interface ToastOptions { text: ReactNode; tone?: Exclude<Tone, "neutral">; icon?: IconName; undo?: () => void; action?: { label: string; onClick: () => void }; duration?: number }
/** Shows a toast in the mounted <Toaster/>. Returns its id. */
export declare function toast(o: string | ToastOptions): string;
export interface ToasterProps { position?: "bottom" | "top" }
export interface FilterDef { key: string; label: string; icon?: IconName; options: string[] }
export interface FilterBarProps { filters: FilterDef[]; value: Record<string, string>; onChange: (v: Record<string, string>) => void; search?: string; query?: string; onQuery?: (q: string) => void; right?: ReactNode }
export interface DataColumn<R = any> { key: string; label: ReactNode; render?: (row: R) => ReactNode; align?: "left" | "right"; sortable?: boolean; sortValue?: (row: R) => any; hideable?: boolean; hidden?: boolean; width?: number | string }
export interface DataTableProps<R = any> { columns: DataColumn<R>[]; rows: R[]; rowKey?: string; selectable?: boolean; bulkActions?: { label: string; icon?: IconName; danger?: boolean; onClick: (rows: R[], clear: () => void) => void }[]; renderExpanded?: (row: R) => ReactNode; stickyHeader?: boolean; maxHeight?: number | string; defaultSort?: { key: string; dir: "asc" | "desc" }; toolbar?: ReactNode; columnToggle?: boolean; empty?: ReactNode }
export interface Series { name: string; tint?: Tint | "ink"; values: number[] }
export interface StackedBarChartProps { labels: string[]; series: Series[]; height?: number; width?: number; barWidth?: number; format?: (v: number) => string; legend?: boolean; label?: string }
export interface AreaChartProps { labels: string[]; series: Series[]; stacked?: boolean; height?: number; width?: number; format?: (v: number) => string; legend?: boolean; label?: string }
export interface HeatmapProps { rows: string[]; cols: string[]; values: number[][]; colEvery?: number; caption?: string; format?: (v: number) => string; label?: string }
export interface FunnelProps { steps: { label: string; value: number; tint?: Tint }[]; tint?: Tint; format?: (v: number) => string }
export interface GaugeProps { value: number; max?: number; caption?: string; format?: (v: number) => string; tint?: Tint | "ink"; thresholds?: [number, number]; size?: number; stroke?: number; showRange?: boolean; label?: string }
export interface LegendProps { items: { name?: string; label?: string; tint?: Tint | "ink" }[] }

/* ── Kit 3: AI chat & agents ── */
export interface Source { title: string; icon?: IconName; url?: string; onClick?: () => void }
export interface ChatMessageProps { role: "user" | "assistant" | "system"; name?: string; time?: string; model?: string; text?: string; streaming?: boolean; tint?: Tint; sources?: Source[]; attachments?: { name: string; size?: string; kind?: string }[]; usage?: string; onRetry?: () => void; onFeedback?: (v: "up" | "down") => void; actions?: boolean; before?: ReactNode; after?: ReactNode; children?: ReactNode }
export interface RichTextProps { text: string; streaming?: boolean; className?: string }
export interface CodeBlockProps { code: string; lang?: string }
export interface ToolCallProps { name: string; icon?: IconName; status?: "running" | "done" | "error" | "waiting"; summary?: ReactNode; duration?: string; input?: unknown; output?: unknown; defaultOpen?: boolean }
export interface ReasoningProps { steps?: string[]; text?: ReactNode; duration?: string; streaming?: boolean; defaultOpen?: boolean }
export interface ApprovalCardProps { title: string; text?: string; icon?: IconName; state?: "pending" | "approved" | "denied"; note?: string; approveLabel?: string; denyLabel?: string; onApprove?: () => void; onDeny?: () => void; onEdit?: () => void; children?: ReactNode }
export interface PromptStartersProps { items: { icon?: IconName; tint?: Tint; title: string; text?: string; prompt?: string }[]; onPick?: (prompt: string) => void }
export interface ModelOption { id: string; label: string; hint?: string }
export interface ModelPickerProps { models: ModelOption[]; value?: string; onChange?: (id: string) => void; side?: "top" | "bottom" }
export interface ComposerProps { value?: string; onChange?: (v: string) => void; onSend?: (text: string, files: File[]) => void; busy?: boolean; onStop?: () => void; placeholder?: string; label?: string; models?: ModelOption[]; model?: string; onModel?: (id: string) => void; commands?: { name: string; hint?: string; icon?: IconName; insert?: string }[]; onCommand?: (c: { name: string }) => void; attachments?: File[] | { name: string }[]; onAttach?: (files: FileList) => void; onRemoveAttachment?: (i: number) => void; hint?: string; left?: ReactNode; disabled?: boolean }
export interface AgentStatusProps { status: "Running" | "Thinking" | "Waiting for approval" | "Idle" | "Paused" | "Error" | string; step?: string }
export interface AgentMarkProps { tint?: Tint; icon?: IconName; size?: number; live?: boolean }
export interface TraceStep { kind?: "model" | "tool" | "search" | "memory" | "approval" | "message" | "error"; label: string; meta?: string; start?: number; ms?: number; detail?: ReactNode; status?: "done" | "running" | "error" }
export interface RunTraceProps { steps: TraceStep[]; defaultOpen?: number | null; footer?: ReactNode }
export interface UsageMeterProps { used: number; limit: number; label?: string; caption?: string; format?: (v: number) => string }

/* ── Kit 3: commerce ── */
export type ArtKind = "tee" | "mug" | "bottle" | "cap" | "tote" | "sneaker" | "watch" | "lamp";
export interface ProductArtProps { kind: ArtKind; tint?: Tint | "plain"; size?: number; label?: string }
export interface PriceProps { value: number; compareAt?: number; currency?: string; size?: "lg"; showSave?: boolean }
export interface RatingProps { value: number; count?: number; size?: number }
export interface StockBadgeProps { stock: number; low?: number; compact?: boolean }
export interface ProductCardProps { name: string; meta?: string; art: ArtKind; tint?: Tint; price: number; compareAt?: number; rating?: number; reviews?: number; badge?: string; badgeTone?: Tone; stock?: number; wished?: boolean; onWish?: () => void; added?: boolean; onAdd?: () => void; onClick?: () => void }
export interface VariantPickerProps { label: string; type?: "color"; options: (string | { value: string; label?: string; color?: string; disabled?: boolean })[]; value?: string; defaultValue?: string; onChange?: (v: string) => void }
export interface CartLineProps { name: string; variant?: string; note?: string; art: ArtKind; tint?: Tint; price: number; qty: number; onQty?: (n: number) => void; onRemove?: () => void }
export interface Discount { code: string; pct?: number; amount?: number; label?: string }
export interface OrderSummaryProps { lines: { name: string; variant?: string; art: ArtKind; tint?: Tint; price: number; qty: number }[]; showLines?: boolean; discount?: Discount | null; onCoupon?: (code: string | null) => boolean | void; shipping?: number | null; freeShippingFrom?: number; vat?: number; title?: string | false; action?: ReactNode }
export interface CheckoutStepsProps { steps?: string[]; current?: number; onPick?: (i: number) => void }
export interface OrderTimelineProps { status: "Placed" | "Paid" | "Packed" | "Shipped" | "Delivered" | "Refunded" | "Cancelled"; times?: Record<string, string> }
export interface PlanCardProps { name: string; text?: string; price: number | null; was?: number; per?: string; features?: string[]; featured?: boolean; flag?: string; current?: boolean; cta?: string; onPick?: () => void }

/* ── Kit 3: system screens ── */
export interface StatusScreenProps { code?: "404" | "500" | "403" | "maintenance" | "offline" | string; title?: string; text?: string; icon?: IconName; tint?: Tint; extra?: ReactNode; actions?: ReactNode[]; onHome?: () => void; onContact?: () => void; reference?: string }
export interface AuthCardProps { title: string; text?: string; icon?: IconName; tint?: Tint; brand?: string; foot?: ReactNode; children?: ReactNode }
/** Formats a number as a price: €32, €4.90. */
export declare function money(v: number, currency?: string): string;

/* ── Labels and locale: the kit ships no fixed copy ── */
/** Looks up a visible string. The key is the built-in English text; {placeholders} are filled from vars. */
export declare function L(key: string, vars?: Record<string, string | number>): string;
/** Like L, but placeholders may be React nodes. */
export declare function Lx(key: string, nodes: Record<string, ReactNode>): ReactNode[];
/** Maps built-in English texts to yours. replace: true swaps the whole set (language switch). */
export declare function setLabels(map: Record<string, string>, replace?: boolean): void;
/** BCP 47 tag (undefined = browser). Drives every number, money and date the kit renders. */
export declare function setLocale(tag: string | undefined, opts?: { currency?: string; weekStart?: 0 | 1 | 6 }): void;
export declare function formatNumber(v: number, opts?: Intl.NumberFormatOptions): string;
export declare function formatMoney(v: number, currency?: string, opts?: Intl.NumberFormatOptions): string;
export declare function formatDate(d: Date | string | number, opts?: Intl.DateTimeFormatOptions): string;

/* ── Kit 4: status, approvals, building blocks ── */
export type Status = "ok" | "running" | "signal" | "warn" | "danger" | "idle";
export type RiskFamily = "money" | "infra" | "comms" | "marketing" | "apps" | "legal";
export interface StatusShapeProps { status: Status }
export interface StatusIndicatorProps { status: Status; label?: ReactNode; size?: "sm" }
export type ApprovalKey = "A" | "B" | "C" | "D";
export interface ApprovalDecision { key: ApprovalKey; by?: string; at?: string; text?: string }
export interface ApprovalCardProps { title: ReactNode; text?: ReactNode; children?: ReactNode; agent?: string; project?: string; family?: RiskFamily; familyLabel?: string; age?: string; escalation?: ReactNode; trace?: ReactNode; note?: ReactNode; heading?: string; options?: { key: ApprovalKey; label: string; input?: boolean; placeholder?: string }[]; approveLabel?: string; onDecide?: (key: ApprovalKey, text?: string) => void; decision?: ApprovalDecision | null; compact?: boolean; /** @deprecated */ onApprove?: () => void; /** @deprecated */ onDeny?: () => void; /** @deprecated */ onEdit?: () => void; /** @deprecated */ state?: "approved" | "denied" }
export interface ApprovalInboxItem { id: string | number; title: string; agent?: string; project?: string; family?: RiskFamily; familyLabel?: string; age?: string; ageMin?: number; urgent?: boolean }
export interface ApprovalInboxProps { items: ApprovalInboxItem[]; selected?: ApprovalInboxItem["id"]; onSelect?: (id: ApprovalInboxItem["id"]) => void; emptyTitle?: string; emptyText?: string; label?: string }
export interface KbdProps { keys: string[] }
export type KeyValueItem = [ReactNode, ReactNode, boolean?] | { k: ReactNode; v: ReactNode; mono?: boolean };
export interface KeyValueProps { items: KeyValueItem[]; dense?: boolean }
export interface SpinnerProps { size?: "lg"; label?: string }
export interface CollapsibleProps { title: ReactNode; meta?: ReactNode; defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }
export interface ContextMenuProps { items: any[]; children: ReactNode }
export interface SplitPaneProps { left: ReactNode; right: ReactNode; defaultSize?: number; min?: number; max?: number; storageKey?: string }
export interface TreeItem { id: string; label: ReactNode; icon?: IconName; meta?: ReactNode; children?: TreeItem[] }
export interface TreeViewProps { items: TreeItem[]; defaultOpen?: string[]; selected?: string; onSelect?: (id: string) => void; label?: string }
export interface InlineEditProps { value: string; onSave?: (v: string) => void; options?: string[]; mono?: boolean; type?: string; display?: (v: string) => ReactNode; align?: "left" | "right" }
export type LogLine = string | { time?: string; text: string; level?: "ok" | "warn" | "err" | "hl"; fresh?: boolean };
export interface LogViewProps { lines: LogLine[]; title?: ReactNode; right?: ReactNode; numbers?: boolean; follow?: boolean; maxHeight?: number }
export interface CodeViewerProps { value: string | object; lang?: string }
export interface SecretFieldProps { prefix?: string; last4?: string; value?: string; meta?: ReactNode; onReveal?: () => boolean | Promise<boolean>; onCopy?: () => void; onRotate?: () => void }
export interface MoneyInputProps { label?: string; value?: number | null; onChange?: (v: number | null) => void; currency?: string; vat?: string; onVat?: (v: string) => void; vatOptions?: { value: string; label: string; rate?: number }[]; showGross?: boolean; hint?: ReactNode; error?: ReactNode }
export interface SettingsLayoutProps { sections: { id?: string; title: ReactNode; text?: ReactNode; badge?: ReactNode; children?: ReactNode }[]; footer?: ReactNode }
export interface ShortcutsOverlayProps { open: boolean; onClose: () => void; title?: string; groups: { title: string; items: [string, string[]][] }[] }
export interface StatCellProps { label: ReactNode; value: ReactNode; delta?: number; deltaText?: string; compare?: string; invert?: boolean; spark?: number[]; icon?: IconName; iconTint?: Tint; tint?: Tint }
export type UptimeDay = "ok" | "warn" | "danger" | "none" | { status: "ok" | "warn" | "danger" | "none"; label?: string; note?: string };
export interface UptimeBarProps { days: UptimeDay[]; uptime?: number; caption?: ReactNode }
export interface MeterProps { label?: ReactNode; value: number | null; max?: number; text?: ReactNode; warn?: number; danger?: number; tone?: Tint }

/* ── Kit 4: agents and chat ── */
export interface AgentCardProps { name: string; role?: string; tint?: Tint; status?: Status; statusLabel?: string; model?: string; cost?: string; last?: ReactNode; onClick?: () => void; onChat?: () => void }
export interface AgentDetailsProps { name: string; role?: string; tint?: Tint; status?: Status; statusLabel?: string; sections?: { title: string; meta?: ReactNode; items?: KeyValueItem[]; children?: ReactNode; open?: boolean }[]; actions?: ReactNode[] }
export interface ChatListItem { id: string; name: string; sub?: ReactNode; time?: string; tint?: Tint; avatar?: boolean; status?: Status; unread?: number; pinned?: boolean }
export interface ChatListProps { groups: { title: string; mark?: Tint; items: ChatListItem[] }[]; selected?: string; onSelect?: (id: string) => void; onSearch?: (q: string) => void; filters?: ReactNode; searchPlaceholder?: string }
export interface ChatWorkspaceProps { list: ReactNode; thread: ReactNode; details?: ReactNode; className?: string }
export interface SearchHitsProps { items: { id: string | number; chat: string; time?: string; who?: string; text: string }[]; query?: string; onOpen?: (item: any) => void }
export interface ThinkingLineProps { text?: string }
export interface FeedbackRatingProps { value?: "up" | "down" | null; onRate?: (v: "up" | "down") => void; onSubmit?: (v: "up" | "down", comment?: string) => void; label?: string; placeholder?: string; thanks?: string; askOnUp?: boolean }
export interface ActivityItem { time?: string; status?: Status; actor?: ReactNode; text: ReactNode; link?: ReactNode }
export interface ActivityFeedProps { groups?: { title: string; items: ActivityItem[] }[]; items?: ActivityItem[] }
export interface DailyBriefingProps { title: string; time?: string; tint?: Tint; summary: ReactNode; attention?: { text: ReactNode; status?: Status; onClick?: () => void }[]; suggestions?: ReactNode[]; attentionTitle?: string; suggestionsTitle?: string }
export interface BudgetStopProps { spent: number; budget: number; title?: string; text?: ReactNode; paused?: ReactNode; running?: ReactNode; onRaise?: () => void; actionLabel?: string }
export interface MemoryViewerProps { items: { id: string | number; scope: string; source?: string; date?: string; text: string }[]; onEdit?: (item: any) => void; onDelete?: (item: any) => void }
export interface OverrideDiffProps { title?: string; versions?: ReactNode; by?: ReactNode; before: string; after: string; onDiscard?: () => void; onPromote?: () => void; discardLabel?: string; promoteLabel?: string }
export interface TriggerListProps { items: { id: string | number; type: "schedule" | "event" | "webhook" | "mail"; rule: ReactNode; agent?: string; by?: string; next?: string; enabled?: boolean }[]; onToggle?: (item: any) => void; onRun?: (item: any) => void }
export interface ScheduleCalendarProps { events: { day: number; start: number; end: number; label: string; sub?: string; tint?: Tint; self?: boolean }[]; from?: number; to?: number; days?: string[]; onOpen?: (e: any) => void }
export interface OrgNode { name: string; role?: string; tint?: Tint; status?: Status; avatar?: boolean; children?: OrgNode[] }
export interface OrgChartProps { root: OrgNode }
export interface VoiceModeProps { name: string; tint?: Tint; state: "listening" | "thinking" | "speaking" | "idle"; stateLabel?: string; transcript?: ReactNode; muted?: boolean; onMute?: () => void; onEnd?: () => void }

/* ── Kit 4: operations ── */
export interface ConnectionCardProps { name: string; icon?: IconName; logo?: ReactNode; text?: ReactNode; status: "connected" | "expiring" | "error" | "missing"; statusLabel?: string; action?: ReactNode }
export interface ConnectionBannerProps { state: "reconnecting" | "offline" | "online"; seconds?: number; text?: ReactNode; onRetry?: () => void }
export interface ServerCardProps { name: string; provider?: string; address?: string; logo?: ReactNode; status?: Status; statusLabel?: string; meters?: { label: string; value: number | null; max?: number; text?: ReactNode; unknown?: string }[]; uptime?: UptimeBarProps; foot?: ReactNode }
export interface DeployPipelineProps { stages: { name: string; status?: "done" | "running" | "signal" | "danger" | "idle"; duration?: string; action?: ReactNode }[] }
export interface DnsRecord { id: string | number; type: string; name: string; content: string; ttl?: string; proxy?: boolean | null }
export interface DnsRecordTableProps { records: DnsRecord[]; rowMenu?: (r: DnsRecord) => any[]; selectable?: boolean; bulkActions?: any[]; toolbar?: ReactNode }
export interface DomainListProps { items: { name: string; registrar?: string; dns?: string; days?: number; ssl?: Status; sslLabel?: string }[]; onOpen?: (d: any) => void }
export interface MailAuthStatusProps { rows: { domain: string; mx?: { status: Status; label?: string }; spf?: { status: Status; label?: string }; dkim?: { status: Status; label?: string }; dmarc?: { status: Status; label?: string } }[]; columns?: string[]; onOpen?: (row: any, column: string) => void }
export interface LedgerRow { id: string | number; date: string; ref?: string; text: string; category?: string; project?: string; projectTint?: Tint; net: number; vat?: number; gross: number; suggested?: string; status?: Status; statusLabel?: string }
export interface LedgerTableProps { rows: LedgerRow[]; categories?: string[]; onEdit?: (row: LedgerRow, change: Partial<LedgerRow>) => void; currency?: string; selectable?: boolean; bulkActions?: any[]; toolbar?: ReactNode; maxHeight?: number }
export interface PnLStatementProps { columns: string[]; rows: { kind?: "section" | "subtotal" | "total"; label: string; values?: number[] }[]; currency?: string; total?: boolean }
export interface ReceiptSuggestionProps { file: string; source?: ReactNode; fields: { label: string; value: ReactNode; mono?: boolean; confidence?: number }[]; suggestion?: ReactNode; onConfirm?: () => void; onDiscard?: () => void; confirmLabel?: string; discardLabel?: string; children?: ReactNode }

/* ── Kit 4: mail, mobile, platform ── */
export interface AccountSwitcherProps { accounts: { address: string; domain?: string; unread?: number }[]; value?: string | null; onChange?: (address: string | null) => void; unread?: number; allLabel?: string }
export interface InboxListProps { items: { id: string | number; from: string; time?: string; subject: string; snippet?: string; unread?: boolean; to?: string; agent?: { label: string; tone?: Tone }; tags?: string[] }[]; selected?: string | number; onOpen?: (m: any) => void }
export interface MailThreadProps { subject: string; messages: { id: string | number; from: string; to?: string; time?: string; snippet?: string; body: ReactNode; agent?: boolean; tint?: Tint; agentNote?: string; attachments?: { name: string; size?: string }[] }[]; reply?: ReactNode }
export interface SignatureEditorProps { value: Record<string, string>; onChange?: (v: Record<string, string>) => void; fields?: { key: string; label: string }[]; note?: ReactNode; extra?: ReactNode }
export interface AttachmentPreviewProps { name: string; meta?: ReactNode; children?: ReactNode; facts?: KeyValueItem[]; found?: ReactNode; actions?: ReactNode; onClose?: () => void }
export interface MobileTabBarProps { items: { id: string; label: string; icon: IconName; count?: number }[]; active?: string; onPick?: (id: string) => void; label?: string }
export interface PushNotificationProps { app?: string; time?: string; title: string; text?: ReactNode; actions?: { label: string; onClick?: () => void }[] }
export interface ConfigPRSummaryProps { title: string; meta?: ReactNode; status?: Status; statusLabel?: string; summary?: ReactNode; items: { kind: "project" | "team" | "agent" | "tool" | "trigger" | "file"; name: string; detail?: ReactNode; op?: "add" | "change" | "remove" }[]; actions?: ReactNode[] }
export interface ModuleRegistryProps { items: { id: string; name: string; version?: string; text?: ReactNode; icon?: IconName; core?: boolean; enabled?: boolean; adds?: string[] }[]; onToggle?: (m: any) => void; coreLabel?: string }

/* ── Kit 5: shared form and data pieces ── */
export interface RangeSliderProps { label?: ReactNode; min?: number; max?: number; step?: number; value?: [number, number]; defaultValue?: [number, number]; onChange?: (v: [number, number]) => void; unit?: string; inputs?: boolean; openEnd?: boolean; format?: (v: number) => string; hint?: ReactNode }
export interface BarListProps { items: { id?: string; label: ReactNode; mark?: ReactNode; value: number; share?: number; tint?: Tint }[]; format?: (v: number) => string; onPick?: (item: any) => void; label?: string }
export interface StatusSelectProps { options: { value: string; label: string; status?: Status }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; size?: "sm"; label?: string; width?: number }
export interface TilePickerProps { options: { value: string; label: ReactNode; meta?: ReactNode; image?: string; icon?: IconName; art?: ReactNode; tint?: Tint; color?: string; disabled?: boolean }[]; value?: string | string[]; defaultValue?: string | string[]; onChange?: (v: any) => void; multiple?: boolean; min?: number; label?: string }
export interface ColorFieldProps { label?: ReactNode; value?: string; defaultValue?: string; onChange?: (v: string) => void; against?: string | false; hint?: ReactNode }
export interface MapPoint { id: string | number; label: string; sub?: ReactNode; lat: number; lng: number; value?: number; text?: ReactNode; tint?: Tint; pulse?: boolean }
export interface MapViewProps { points?: MapPoint[]; bounds?: { n: number; s: number; w: number; e: number }; background?: ReactNode; bubbles?: boolean; selected?: MapPoint["id"] | null; onSelect?: (id: MapPoint["id"] | null) => void; renderPopup?: (p: MapPoint) => ReactNode; legend?: ReactNode; controls?: ReactNode; height?: number; label?: string; className?: string }

/* ── Kit 5: admin ── */
export interface LiveFeedItem { id: string | number; type?: string; icon?: IconName; tint?: Tint; title: ReactNode; text?: ReactNode; amount?: number; currency?: string; time?: string; fresh?: boolean }
export interface LiveFeedProps { items: LiveFeedItem[]; types?: { value: string; label: string }[]; paused?: boolean; onPause?: (paused: boolean) => void; maxHeight?: number; emptyText?: string }
export interface RichTextEditorProps { label?: ReactNode; defaultValue?: string; value?: string; onChange?: (html: string) => void; placeholder?: string; variables?: { key: string; label: string }[]; maxLength?: number; minHeight?: number; footer?: ReactNode; hint?: ReactNode; error?: ReactNode; disabled?: boolean }
export interface EmailPreviewProps { from?: string; fromName?: string; subject?: string; preheader?: string; html?: string; children?: ReactNode; device?: "desktop" | "mobile"; onDevice?: (d: string) => void; checks?: { status: Status; label: ReactNode }[] }
export interface SearchAdPreviewProps { name?: string; domain: string; paths?: string[]; headlines?: string[]; descriptions?: string[]; sitelinks?: string[]; device?: "mobile" | "desktop"; onDevice?: (d: string) => void; sponsoredLabel?: string }
export interface BalanceCardProps { name: string; sub?: ReactNode; logo?: ReactNode; icon?: IconName; tint?: Tint; balance: number; currency?: string; perDay?: number; low?: number; spark?: number[]; status?: Status; statusLabel?: string; onTopUp?: () => void; topUpLabel?: string; action?: ReactNode }
export interface ServiceMonitorProps { items: { id?: string; name: string; status: Status; statusLabel?: string; latency?: number | null; errorRate?: number | null; checked?: string; history?: (Status | "none")[] }[]; label?: string }
export interface RunHistoryProps { items: { id: string | number; name: string; status: Status; started?: string; duration?: string; by?: string; counts?: { value: number; label: string; tone?: Tone }[]; detail?: ReactNode }[]; label?: string }
export interface WebhookEndpointProps { url: string; events?: string[]; status?: Status; statusLabel?: string; successRate?: number; enabled?: boolean; onToggle?: () => void; secret?: ReactNode; deliveries?: { id: string | number; code?: number; event: string; time?: string; ms?: number }[]; onRetry?: (d: any) => void; menu?: MenuProps["items"]; defaultOpen?: boolean }
export interface BackupListProps { items: { id: string | number; name?: string; time?: string; kind?: string; where?: string; retention?: string; size?: string; status?: Status }[]; onDownload?: (b: any) => void; onRestore?: (b: any) => void; footer?: ReactNode; label?: string }
export interface BlockListProps { items: { id: string | number; value: string; kind?: string; reason?: string; by?: string; until?: string }[]; onAdd?: () => void; onRemove?: (b: any) => void; addLabel?: string; removeLabel?: string; searchPlaceholder?: string; emptyText?: string }
export interface ReviewCardProps { author: string; verified?: boolean; product?: string; date?: string; rating: number; title?: string; text: string; state?: "pending" | "published" | "hidden" | "flagged"; stateLabel?: string; highlight?: string[]; reply?: string; replyLabel?: string; onPublish?: () => void; onHide?: () => void; onReply?: (text: string) => void }
export interface CouponCardProps { code: string; kind?: "percent" | "fixed"; value: number; currency?: string; used?: number; limit?: number; until?: string; min?: number; revenue?: number; text?: ReactNode; status?: Status; statusLabel?: string; onCopy?: () => void; menu?: MenuProps["items"] }
export interface LocaleFieldProps { label?: ReactNode; locales: { code: string; label?: string; flag?: string }[]; value?: Record<string, string>; defaultValue?: Record<string, string>; onChange?: (v: Record<string, string>) => void; source?: string; active?: string; multiline?: boolean; rows?: number; placeholder?: string; onTranslate?: (text: string, to: string) => string | Promise<string>; hint?: ReactNode; error?: ReactNode }
export interface LocaleSwitcherProps { languages?: { code: string; label: string; short?: string; flag?: string }[]; language?: string; onLanguage?: (code: string) => void; currencies?: string[]; currency?: string; onCurrency?: (c: string) => void; variant?: "frame" }
export interface WorkspaceSwitcherProps { items: { id: string; name: string; sub?: string; tint?: Tint; logo?: ReactNode }[]; value?: string; onChange?: (id: string) => void; label?: string; footer?: ReactNode; variant?: "frame"; width?: number }
export interface ExportDialogProps { open?: boolean; inline?: boolean; onClose?: () => void; title?: string; text?: ReactNode; count?: number; formats?: string[]; format?: string; columns?: { key: string; label: string; default?: boolean }[]; ranges?: boolean; range?: { from: Date | null; to: Date | null } | null; note?: ReactNode; onExport?: (o: { format: string; columns: string[]; range: any }, progress: (pct: number) => void) => void | Promise<void>; onDownload?: () => void; download?: ReactNode; doneText?: string }
export interface TwoFactorSetupProps { qr?: ReactNode; secret: string; onVerify?: (code: string) => boolean | Promise<boolean>; codes?: string[]; onDownload?: () => void; onDone?: () => void; step?: 0 | 1 | 2; scanText?: string; codesText?: string }

/* ── Kit 5: media ── */
export interface ImageVariantsProps { variants: { id: string | number; label: string; src?: string; size?: string; format?: string; weight?: string; ratio?: string; status?: Status }[]; selected?: string | number; onSelect?: (id: any) => void; alt?: string; tint?: Tint; actions?: ReactNode }
export interface GalleryProps { items: { src?: string; alt?: string; caption?: string; art?: ReactNode; tint?: Tint }[]; start?: number; ratio?: string; thumbs?: boolean; fullscreen?: boolean; badge?: ReactNode }
export interface BeforeAfterProps { before: { src?: string; alt?: string; art?: ReactNode; tint?: Tint }; after: { src?: string; alt?: string; art?: ReactNode; tint?: Tint }; start?: number; ratio?: string; beforeLabel?: string; afterLabel?: string }

/* ── Kit 5: real estate ── */
export interface Listing { id: string | number; title: string; price: number | null; rent?: boolean; currency?: string; pricePerSqm?: number; area?: number; rooms?: number; place?: string; image?: string; tint?: Tint; photos?: number; source?: string; seller?: "private" | "agent"; sellerLabel?: string; phone?: boolean; isNew?: boolean; age?: string; status?: string; wished?: boolean }
export interface ListingCardProps { listing: Listing; layout?: "card" | "row"; selected?: boolean; onSelect?: (l: Listing) => void; onWish?: (l: Listing) => void; statusOptions?: StatusSelectProps["options"]; onStatus?: (l: Listing, status: string) => void; onOpen?: (l: Listing) => void }
export interface ResultsToolbarProps { title?: string; total: number; meta?: string; selected?: number; onSelectAll?: (all: boolean) => void; bulkActions?: { label: string; icon?: IconName; variant?: string; busy?: boolean; busyLabel?: string; onClick?: () => void }[]; sortOptions?: { value: string; label: string }[]; sort?: string; onSort?: (v: string) => void; views?: ("grid" | "list" | "map")[]; view?: string; onView?: (v: string) => void }
export interface SavedSearchProps { name: string; criteria?: ReactNode[]; lastRun?: string; frequency?: string; newCount?: number; enabled?: boolean; onToggle?: () => void; onEdit?: () => void; onOpen?: () => void; openLabel?: string; icon?: IconName; tint?: Tint }
export interface ValuationCardProps { value: number; low: number; high: number; asking?: number; perSqm?: number; compare?: string; currency?: string; confidence?: number; confidenceLabel?: string; facts?: KeyValueItem[]; note?: ReactNode; title?: string; action?: ReactNode }
export interface EnergyClassProps { value: string; kwh?: number; kind?: string; scale?: string[] }

/* ── Kit 5: site chrome ── */
export interface ChatLauncherProps { title?: string; context?: ReactNode; tint?: Tint; open?: boolean; onOpenChange?: (open: boolean) => void; unread?: number; headerAction?: ReactNode; children?: ReactNode; composer?: ReactNode; inline?: boolean }
export interface CookieConsentProps { title?: string; text?: ReactNode; policy?: ReactNode; categories?: { id: string; label: string; text?: string; required?: boolean; default?: boolean }[]; onSave?: (choices: Record<string, boolean>) => void; open?: boolean; inline?: boolean }
export interface AnnouncementBarProps { children: ReactNode; tint?: Tint; icon?: IconName | false; action?: ReactNode; onDismiss?: (() => void) | false }
