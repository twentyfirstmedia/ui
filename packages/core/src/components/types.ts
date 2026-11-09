import type { ChangeEvent, CSSProperties, MouseEvent, ReactNode } from "react";
import type { IconName } from "../icons.js";
import type { ToastOptions } from "../toast-store.js";
import type { Surface } from "../provider.js";

export type { IconName, ToastOptions, Surface };

/* Props of every component, ported from the reference (design-system/components/index.d.ts). */

/** Every component accepts an extra class and inline style on its root element. */
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
}

export type Tint = "sky" | "mint" | "lilac" | "butter" | "blush";

export interface IconProps extends BaseProps {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
}
export interface ButtonProps extends BaseProps {
  variant?: "primary" | "secondary" | "soft" | "ghost" | "danger" | "danger-solid";
  size?: "md" | "sm";
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  /** Render the single child element (a link, a router Link) with the button's look instead of a <button>. */
  asChild?: boolean;
}
export interface IconButtonProps extends BaseProps {
  icon: IconName;
  label: string;
  variant?: "soft" | "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** Render the single child element (a link) with the button's look; the icon is placed inside it. */
  asChild?: boolean;
  children?: ReactNode;
}
export interface ChipProps extends BaseProps {
  selected?: boolean;
  icon?: IconName;
  count?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}
export interface BadgeProps extends BaseProps {
  tone?: Tone;
  dot?: boolean;
  live?: boolean;
  children?: ReactNode;
}
export interface TintIconProps extends BaseProps {
  icon: IconName;
  tint?: Tint | "plain";
  label?: string;
  size?: number;
}
export interface AvatarProps extends BaseProps {
  name: string;
  src?: string;
  size?: number;
  tint?: Tint | "surface-sunken";
}
export interface AvatarStackProps extends BaseProps {
  names: string[];
  max?: number;
  size?: number;
}
export interface FieldProps extends BaseProps {
  label?: string;
  hint?: string;
  error?: string;
  /** Form field name: the value's key in `Form`, and where its validation message shows. */
  name?: string;
  id?: string;
  required?: boolean;
}
export interface InputProps extends FieldProps, BaseProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export interface SelectProps extends FieldProps, BaseProps {
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}
export interface TextareaProps extends FieldProps, BaseProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
export interface SearchFieldProps extends BaseProps {
  placeholder?: string;
  shortcut?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export interface CheckboxProps extends BaseProps {
  name?: string;
  value?: string;
  required?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  disabled?: boolean;
  label?: string;
}
export interface SwitchProps extends BaseProps {
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  spread?: boolean;
  disabled?: boolean;
  label?: string;
}
export interface TabsProps extends BaseProps {
  items: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  block?: boolean;
  /** Content per tab; renders the tab panels under the bar, wired with tab/tabpanel roles. */
  panels?: Record<string, ReactNode>;
  /** Accessible name of the tab list. */
  label?: string;
}
export interface StatTileProps extends BaseProps {
  value: ReactNode;
  label: string;
  tint?: Tint | "surface" | "placeholder";
  delta?: string;
  delay?: number;
}
export interface CardProps extends BaseProps {
  title?: string;
  description?: string;
  meta?: string[];
  corner?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode[];
  tint?: Tint | "surface";
  onClick?: () => void;
  children?: ReactNode;
  eyebrow?: ReactNode;
  /** `"glass"`: translucent glass over what is behind (maps, 3D, video, photos); `"solid"` opts out inside a glass `UIProvider`. */
  surface?: Surface;
}
export interface EventCardProps extends BaseProps {
  kind?: "meeting" | "deadline" | "review" | "launch" | "incident";
  label: string;
  date: string;
  time: string;
  tint?: Tint;
  icon?: IconName;
  actions?: boolean;
  children?: ReactNode;
}
export interface PanelProps extends BaseProps {
  side?: boolean;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children?: ReactNode;
  /** `"glass"`: translucent glass over what is behind (maps, 3D, video, photos); `"solid"` opts out inside a glass `UIProvider`. */
  surface?: Surface;
}
export interface PageHeaderProps extends BaseProps {
  crumbs?: string[];
  title: string;
  subtitle?: string;
  actions?: ReactNode[];
}
export interface NavItem {
  label: string;
  icon: IconName;
  count?: number;
}
export interface TopBarProps extends BaseProps {
  brand?: string;
  tag?: string;
  items: NavItem[];
  active?: string;
  user?: { name: string; email?: string };
  onNavigate?: (label: string) => void;
  extra?: ReactNode;
  userOpen?: boolean;
  onUser?: () => void;
}
export interface RailItem {
  label: string;
  icon: IconName;
  active?: boolean;
  count?: number;
  onClick?: () => void;
}
export interface SideRailProps extends BaseProps {
  top?: RailItem[];
  bottom?: RailItem[];
}
export interface FloatingLayoutProps extends BaseProps {
  /** What the UI floats over, filling the layout: a map, a 3D canvas, a video, a photo. */
  background?: ReactNode;
  /** Bar along the top edge (search, filters, title). */
  top?: ReactNode;
  /** Column on the start side (layers, lists, settings). */
  start?: ReactNode;
  /** Column on the end side (details of the selected thing). */
  end?: ReactNode;
  /** Bar along the bottom edge (dock, playback, a summary). */
  bottom?: ReactNode;
  /** Height of the layout (default 640). Below 720px of width the slots stack: top, start, end, bottom. */
  height?: number | string;
  /** Glass for every surface in the slots (default) or solid surfaces. */
  surface?: Surface;
  /** Accessible name of the region. */
  label?: string;
  children?: ReactNode;
}
export interface AmbientProps extends BaseProps {
  /** Colours of the soft fields (any CSS colour); default the kit's `--ambient-1…4`. */
  colors?: string[];
  /** A photo (or, with `video`, a video) instead of the fields, under a scrim that keeps it calm. */
  src?: string;
  /** Treat `src` as a video (muted, looping, still with motion off). */
  video?: boolean;
  /** Let the fields drift slowly (default true). Still with motion off; paused off screen. */
  animate?: boolean;
  /** Cover the window behind the page instead of the nearest container. */
  fixed?: boolean;
  /** Your own layer (a canvas, WebGL, a map) instead of fields or media. */
  children?: ReactNode;
}
export interface DockItem {
  label: string;
  icon: IconName;
  tint?: Tint | "plain";
  onClick?: () => void;
}
export interface DockProps extends BaseProps {
  items: DockItem[];
  label?: string;
  /** `"glass"`: translucent glass over what is behind (maps, 3D, video, photos); `"solid"` opts out inside a glass `UIProvider`. */
  surface?: Surface;
}
export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "right";
  width?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- rows are app data
  render?: (row: any) => ReactNode;
}
export interface TableProps extends BaseProps {
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- rows are app data
  rows: Record<string, any>[];
  animate?: boolean;
}
export interface ProgressProps extends BaseProps {
  value: number;
  tint?: "sky" | "mint" | "butter";
  label?: string;
}
export interface ToastProps extends BaseProps {
  icon?: IconName;
  tint?: Tint;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
}
export interface EmptyStateProps extends BaseProps {
  title: string;
  text?: string;
  icon?: IconName;
  tint?: Tint;
  action?: ReactNode;
}
export interface BreadcrumbProps extends BaseProps {
  items: string[];
}
export interface PaginationProps extends BaseProps {
  total: number;
  page?: number;
}
export interface AppShellProps extends BaseProps {
  active?: string;
  brand?: string;
  tag?: string;
  nav?: NavItem[];
  user?: { name: string; email?: string };
  onNavigate?: (label: string) => void;
  topExtra?: ReactNode;
  sheetStyle?: CSSProperties;
  contentKey?: string | number;
  side?: ReactNode;
  dock?: boolean;
  dockItems?: DockProps["items"];
  railTop?: RailItem[];
  railBottom?: RailItem[];
  children?: ReactNode;
}
export interface StaggerProps extends BaseProps {
  as?: string;
  className?: string;
  style?: CSSProperties;
  /** Extra delay before the first child, in ms. */
  delay?: number;
  /** Below the fold, wait until the group scrolls into view (default true). */
  reveal?: boolean;
  children?: ReactNode;
}
export interface CountUpProps extends BaseProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
}
export interface ListRowProps extends BaseProps {
  avatar?: string;
  icon?: IconName;
  tint?: Tint | "plain";
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  unread?: boolean;
  active?: boolean;
  onClick?: () => void;
}
export interface TimelineProps extends BaseProps {
  items: {
    avatar?: string;
    icon?: IconName;
    tint?: Tint | "plain";
    text: ReactNode;
    time: string;
  }[];
  delay?: number;
}
export interface FileRowProps extends BaseProps {
  name: string;
  meta: string;
  kind?: "pdf" | "fig" | "sheet" | "doc" | "zip";
}
export interface KanbanColumnProps extends BaseProps {
  title: string;
  dot?: Tint;
  delay?: number;
  children?: ReactNode;
  onAdd?: () => void;
}
export interface ProgressRingProps extends BaseProps {
  value: number;
  tint?: Tint | "ink";
  size?: number;
  stroke?: number;
  caption?: string;
  label?: string;
}
export interface BarChartProps extends BaseProps {
  data: { label: string; value: number; tint?: Tint | "ink" }[];
  tint?: Tint | "ink";
  height?: number;
  width?: number;
  barWidth?: number;
  format?: (v: number) => string;
  label?: string;
}
export interface LineChartProps extends BaseProps {
  labels: string[];
  series: { values: number[]; tint?: Tint | "ink"; area?: boolean }[];
  height?: number;
  width?: number;
  format?: (v: number) => string;
  label?: string;
}
export interface SparklineProps extends BaseProps {
  values: number[];
  tint?: Tint | "ink";
  width?: number;
  height?: number;
  label?: string;
}
export interface DonutProps extends BaseProps {
  data: { label: string; value: number; tint?: Tint | "ink" }[];
  center?: string;
  caption?: string;
  size?: number;
  stroke?: number;
  legend?: boolean;
  label?: string;
}
export interface SkeletonProps extends BaseProps {
  variant?: "text" | "title" | "circle" | "block";
  width?: number | string;
  height?: number | string;
}
export interface MenuItem {
  label: string;
  icon?: IconName;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  /** A checkbox or radio item (shows a check or dot when `checked`). Radio items with the same `group` belong together. */
  type?: "checkbox" | "radio";
  checked?: boolean;
  group?: string;
  /** A submenu; opens on click, hover or →. */
  items?: (MenuItem | "-")[];
  onClick?: () => void;
}
export interface MenuProps extends BaseProps {
  items: (MenuItem | "-")[];
  /** Accessible name of the menu. */
  label?: string;
  /** Focus the first item on mount (menus opened from a button or the keyboard). */
  autoFocus?: boolean;
  /** Called after an item runs, and on Escape, so the owner can close the menu. */
  onClose?: () => void;
}
export interface ModalProps extends BaseProps {
  title: string;
  text?: string;
  icon?: IconName;
  tint?: Tint;
  actions?: ReactNode[];
  onClose?: () => void;
  style?: CSSProperties;
  children?: ReactNode;
  /** Optional: with `open` the component stays mounted while it animates out; without it, render it only while open. */
  open?: boolean;
}
/** Mounts a demo page with a "Replay motion" button that re-runs every entrance. */
export interface SubNavItem {
  id?: string;
  label: string;
  icon: IconName;
  count?: number;
}
export interface SubNavProps extends BaseProps {
  eyebrow?: string;
  action?: { label: string; icon?: IconName; onClick?: () => void };
  items: SubNavItem[];
  current?: string;
  onPick?: (id: string) => void;
  children?: ReactNode;
}
export interface DrawerProps extends BaseProps, DrawerSide {
  title: string;
  subtitle?: ReactNode;
  avatar?: string;
  onClose?: () => void;
  width?: number | string;
  inline?: boolean;
  children?: ReactNode;
  /** Optional: with `open` the component stays mounted while it animates out; without it, render it only while open. */
  open?: boolean;
}
export interface PaletteItem {
  id?: string | number;
  group?: string;
  label: string;
  hint?: string;
  icon?: IconName;
  tint?: Tint | "plain";
  run?: () => void;
  searchOnly?: boolean;
}
export interface CommandPaletteProps extends BaseProps {
  items: PaletteItem[];
  onClose?: () => void;
  placeholder?: string;
  inline?: boolean;
  /** Results are on their way (async search): shows a loading row. */
  loading?: boolean;
  /** Shown when nothing matches (default: "Nothing matches …"). */
  empty?: ReactNode;
  /** Called with the query as the user types, for searching on a server. */
  onQueryChange?: (query: string) => void;
  /** Optional: with `open` the component stays mounted while it animates out; without it, render it only while open. */
  open?: boolean;
}
export interface DrawerSide {
  /** Edge the sheet slides in from (default right). */
  side?: "right" | "left" | "top" | "bottom";
}
export interface NotificationItem {
  id: string | number;
  icon: IconName;
  tint?: Tint | "plain";
  title: string;
  text?: string;
  time?: string;
  unread?: boolean;
}
export interface NotificationListProps extends BaseProps {
  items: NotificationItem[];
  onOpen?: (n: NotificationItem) => void;
  onReadAll?: () => void;
}
export interface FlowStep {
  kind: "trigger" | "condition" | "agent" | "approval" | "action";
  text: string;
}
export interface FlowProps extends BaseProps {
  steps: FlowStep[];
  active?: number | null;
  waiting?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  tools?: (step: FlowStep, index: number) => ReactNode;
}
export type FileKind = "pdf" | "doc" | "sheet" | "fig" | "img" | "zip";
export interface FileCardProps extends BaseProps {
  name: string;
  kind: FileKind;
  size?: string;
  meta?: string;
  shared?: boolean;
  onClick?: () => void;
}
export interface FileThumbProps extends BaseProps {
  kind: FileKind;
  title?: string;
  big?: boolean;
  entries?: string[];
}
export interface WizardProps extends BaseProps {
  steps: { id?: string; label: string; icon?: IconName }[];
  current?: number;
  done?: Record<string, boolean>;
  onPick?: (i: number) => void;
  footer?: ReactNode;
  brand?: string;
  label?: string;
  children?: ReactNode;
}
export interface PermissionMatrixProps extends BaseProps {
  roles: { name: string; people?: number; locked?: boolean; levels: (0 | 1 | 2 | 3)[] }[];
  areas: string[];
  onChange?: (roleIndex: number, areaIndex: number, nextLevel: number) => void;
}
export interface InvoicePreviewProps extends BaseProps {
  number: string | number;
  from?: string;
  to: string;
  issued: string;
  due: string;
  lines: { d: string; q: number; u: number; v: number }[];
  note?: string;
  kind?: string;
  brand?: string;
  format?: (n: number) => string;
}
export interface TransactionRowProps extends BaseProps {
  text: string;
  date: string;
  amount: number;
  matched?: boolean;
  matchRef?: string;
  hint?: string;
  onMatch?: () => void;
}
/** Traps keyboard focus inside `ref` while mounted, closes on Escape, and restores focus afterwards. */

/* ── Kit 2: forms, overlays, data table, charts ── */
export type Tone =
  "success" | "info" | "warning" | "danger" | "highlight" | "neutral" | Status | "error";
export interface Option {
  value: string;
  label: string;
  hint?: string;
  icon?: IconName;
  avatar?: boolean;
  disabled?: boolean;
}
export interface FormFieldProps extends BaseProps {
  id?: string;
  /** Field name inside a `Form`: the field shows that name's validation message. */
  name?: string;
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  success?: ReactNode;
  children?: ReactNode;
}
export interface TextFieldProps extends Omit<FormFieldProps, "children"> {
  type?: string;
  icon?: IconName;
  suffix?: ReactNode;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export interface RadioGroupProps extends BaseProps {
  label?: string;
  options: (string | Option)[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  cards?: boolean;
  hint?: string;
}
export interface SegmentedProps extends BaseProps {
  options: (string | Option)[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  size?: "sm";
  block?: boolean;
  label?: string;
}
export interface ComboboxProps extends BaseProps {
  label?: string;
  options: (string | Option)[];
  value?: string | string[] | null;
  defaultValue?: string | string[];
  onChange?: (v: string | string[] | null) => void;
  multiple?: boolean;
  creatable?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}
export interface TagInputProps extends BaseProps {
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (v: string[]) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
}
export interface DateRange {
  from: Date | null;
  to: Date | null;
}
export interface DatePickerProps extends BaseProps {
  label?: string;
  range?: boolean;
  value?: Date | DateRange | null;
  defaultValue?: Date | DateRange;
  onChange?: (v: Date | DateRange | null) => void;
  presets?: boolean;
  min?: Date;
  max?: Date;
  today?: Date;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}
export interface CalendarProps extends BaseProps {
  range?: boolean;
  value?: Date | DateRange | null;
  onChange?: (v: Date | DateRange) => void;
  today?: Date;
  min?: Date;
  max?: Date;
  month?: Date;
}
export interface NumberInputProps extends BaseProps {
  label?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
  error?: string;
}
export interface SliderProps extends BaseProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (n: number) => void;
  format?: (n: number) => string;
  marks?: boolean;
  hint?: string;
}
export interface OtpInputProps extends BaseProps {
  length?: number;
  onComplete?: (code: string) => void;
  error?: boolean;
  label?: string;
}
export interface UploadFile {
  id: string;
  name: string;
  size: number;
  /** Upload progress 0–100: a bar while below 100, "uploaded" at 100. */
  progress: number;
  /** The picked or dropped file (set by FileDrop for files it adds). */
  file?: File;
}
export interface FileDropProps extends BaseProps {
  /** The listed files (controlled); set `progress` per file to show real upload progress. */
  files?: UploadFile[];
  /** The list changed: files added (with their `file`) or removed. */
  onChange?: (f: UploadFile[]) => void;
  /**
   * The person picked or dropped files: the real `File` objects, after `accept` and `multiple`.
   * Upload them yourself. To show progress, control `files` and set each `progress`; an
   * uncontrolled list shows them with their size only.
   */
  onFiles?: (files: File[]) => void;
  /** Dropped files that do not match `accept` (show an inline Alert). */
  onReject?: (files: File[]) => void;
  /** A listed file was removed or its upload cancelled. */
  onRemove?: (f: UploadFile) => void;
  /**
   * Animate made-up progress for added files, as a demo of the look. Default: on without
   * `onFiles` (as before), off with it.
   */
  simulateProgress?: boolean;
  title?: string;
  hint?: string;
  /** Accepted types, as for `<input type="file">` ("image/*,.pdf"); also checked on drop. */
  accept?: string;
  multiple?: boolean;
}
export interface TooltipProps extends BaseProps {
  label: ReactNode;
  shortcut?: string;
  side?: "top" | "bottom" | "left" | "right";
  /** Starts open (for demos and onboarding hints); it still closes on blur and Escape. */
  defaultOpen?: boolean;
  children: ReactNode;
}
export interface PopoverProps extends BaseProps {
  trigger: ReactNode | ((s: { open: boolean; toggle: () => void }) => ReactNode);
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  align?: "start" | "end";
  side?: "top" | "bottom";
  width?: number;
  flush?: boolean;
  block?: boolean;
  role?: string;
  children?: ReactNode | ((s: { close: () => void }) => ReactNode);
}
export interface AlertProps extends BaseProps {
  tone?: Exclude<Tone, "neutral">;
  title?: ReactNode;
  icon?: IconName;
  action?: ReactNode;
  onDismiss?: () => void;
  children?: ReactNode;
}
export interface ConfirmDialogProps extends BaseProps {
  open: boolean;
  title: string;
  text?: string;
  danger?: boolean;
  icon?: IconName;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export interface ToasterProps extends BaseProps {
  position?: "bottom" | "top";
}
export interface FilterDef {
  key: string;
  label: string;
  icon?: IconName;
  options: string[];
}
export interface FilterBarProps extends BaseProps {
  filters: FilterDef[];
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  search?: string;
  query?: string;
  onQuery?: (q: string) => void;
  right?: ReactNode;
}
export interface BulkAction<R> {
  label: string;
  icon?: IconName;
  danger?: boolean;
  onClick: (rows: R[], clear: () => void) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rows are app data
export interface DataColumn<R = any> {
  key: string;
  label: ReactNode;
  render?: (row: R) => ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  sortValue?: (row: R) => string | number | Date;
  hideable?: boolean;
  hidden?: boolean;
  width?: number | string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rows are app data
export interface DataTableProps<R = any> extends BaseProps {
  columns: DataColumn<R>[];
  rows: R[];
  rowKey?: string;
  selectable?: boolean;
  bulkActions?: {
    label: string;
    icon?: IconName;
    danger?: boolean;
    onClick: (rows: R[], clear: () => void) => void;
  }[];
  renderExpanded?: (row: R) => ReactNode;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  toolbar?: ReactNode;
  columnToggle?: boolean;
  empty?: ReactNode;
}
export interface Series {
  name: string;
  tint?: Tint | "ink";
  values: number[];
}
export interface StackedBarChartProps extends BaseProps {
  labels: string[];
  series: Series[];
  height?: number;
  width?: number;
  barWidth?: number;
  format?: (v: number) => string;
  legend?: boolean;
  label?: string;
}
export interface AreaChartProps extends BaseProps {
  labels: string[];
  series: Series[];
  stacked?: boolean;
  height?: number;
  width?: number;
  format?: (v: number) => string;
  legend?: boolean;
  label?: string;
}
export interface HeatmapProps extends BaseProps {
  rows: string[];
  cols: string[];
  values: number[][];
  colEvery?: number;
  caption?: string;
  format?: (v: number) => string;
  label?: string;
}
export interface FunnelProps extends BaseProps {
  steps: { label: string; value: number; tint?: Tint }[];
  tint?: Tint;
  format?: (v: number) => string;
}
export interface GaugeProps extends BaseProps {
  value: number;
  max?: number;
  caption?: string;
  format?: (v: number) => string;
  tint?: Tint | "ink";
  thresholds?: [number, number];
  size?: number;
  stroke?: number;
  showRange?: boolean;
  label?: string;
}
export interface LegendProps extends BaseProps {
  items: { name?: string; label?: string; tint?: Tint | "ink" }[];
}

/* ── Kit 3: AI chat & agents ── */
export interface Source {
  title: string;
  icon?: IconName;
  url?: string;
  onClick?: () => void;
}
export interface ChatMessageProps extends BaseProps {
  role: "user" | "assistant" | "system";
  name?: string;
  time?: string;
  model?: string;
  text?: string;
  streaming?: boolean;
  tint?: Tint;
  sources?: Source[];
  attachments?: { name: string; size?: string; kind?: string }[];
  usage?: string;
  onRetry?: () => void;
  onFeedback?: (v: "up" | "down") => void;
  actions?: boolean;
  before?: ReactNode;
  after?: ReactNode;
  children?: ReactNode;
  feedback?: "up" | "down" | null;
}
export interface RichTextProps extends BaseProps {
  text: string;
  streaming?: boolean;
  className?: string;
}
export interface CodeBlockProps extends BaseProps {
  code: string;
  lang?: string;
  open?: boolean;
}
export interface ToolCallProps extends BaseProps {
  name: string;
  icon?: IconName;
  status?: "running" | "done" | "error" | "waiting";
  summary?: ReactNode;
  duration?: string;
  input?: unknown;
  output?: unknown;
  defaultOpen?: boolean;
}
export interface ReasoningProps extends BaseProps {
  steps?: string[];
  text?: ReactNode;
  duration?: string;
  streaming?: boolean;
  defaultOpen?: boolean;
}
export interface PromptStartersProps extends BaseProps {
  items: { icon?: IconName; tint?: Tint; title: string; text?: string; prompt?: string }[];
  onPick?: (prompt: string) => void;
}
export interface ModelOption {
  id: string;
  label: string;
  hint?: string;
}
export interface ModelPickerProps extends BaseProps {
  models: ModelOption[];
  value?: string;
  onChange?: (id: string) => void;
  side?: "top" | "bottom";
}
export interface ComposerCommand {
  name: string;
  hint?: string;
  icon?: IconName;
  insert?: string;
}
export interface ComposerProps extends BaseProps {
  value?: string;
  onChange?: (v: string) => void;
  onSend?: (text: string, files: (File | { name: string })[]) => void;
  busy?: boolean;
  onStop?: () => void;
  placeholder?: string;
  label?: string;
  models?: ModelOption[];
  model?: string;
  onModel?: (id: string) => void;
  commands?: ComposerCommand[];
  onCommand?: (c: ComposerCommand) => void;
  attachments?: (File | { name: string })[];
  onAttach?: (files: FileList) => void;
  onRemoveAttachment?: (i: number) => void;
  hint?: string;
  left?: ReactNode;
  disabled?: boolean;
}
export interface AgentStatusProps extends BaseProps {
  status: "Running" | "Thinking" | "Waiting for approval" | "Idle" | "Paused" | "Error" | string;
  step?: string;
}
export interface AgentMarkProps extends BaseProps {
  tint?: Tint;
  icon?: IconName;
  size?: number;
  live?: boolean;
}
export interface TraceStep {
  kind?: "model" | "tool" | "search" | "memory" | "approval" | "message" | "error";
  label: string;
  meta?: string;
  start?: number;
  ms?: number;
  detail?: ReactNode;
  status?: "done" | "running" | "error";
}
export interface RunTraceProps extends BaseProps {
  steps: TraceStep[];
  defaultOpen?: number | null;
  footer?: ReactNode;
}
export interface UsageMeterProps extends BaseProps {
  used: number;
  limit: number;
  label?: string;
  caption?: string;
  format?: (v: number) => string;
}

/* ── Kit 3: commerce ── */
export type ArtKind = "tee" | "mug" | "bottle" | "cap" | "tote" | "sneaker" | "watch" | "lamp";
export interface ProductArtProps extends BaseProps {
  kind: ArtKind;
  tint?: Tint | "plain";
  size?: number;
  label?: string;
}
export interface PriceProps extends BaseProps {
  value: number;
  compareAt?: number;
  currency?: string;
  size?: "lg";
  showSave?: boolean;
}
export interface RatingProps extends BaseProps {
  value: number;
  count?: number;
  size?: number;
}
export interface StockBadgeProps extends BaseProps {
  stock: number;
  low?: number;
  compact?: boolean;
}
export interface ProductCardProps extends BaseProps {
  name: string;
  meta?: string;
  art: ArtKind;
  tint?: Tint;
  price: number;
  compareAt?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeTone?: Tone;
  stock?: number;
  wished?: boolean;
  onWish?: () => void;
  added?: boolean;
  onAdd?: () => void;
  onClick?: () => void;
}
export interface VariantPickerProps extends BaseProps {
  label: string;
  type?: "color";
  options: (string | { value: string; label?: string; color?: string; disabled?: boolean })[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
}
export interface CartLineProps extends BaseProps {
  name: string;
  variant?: string;
  note?: string;
  art: ArtKind;
  tint?: Tint;
  price: number;
  qty: number;
  onQty?: (n: number) => void;
  onRemove?: () => void;
}
export interface Discount {
  code: string;
  pct?: number;
  amount?: number;
  label?: string;
}
export interface OrderSummaryProps extends BaseProps {
  lines: {
    name: string;
    variant?: string;
    art: ArtKind;
    tint?: Tint;
    price: number;
    qty: number;
  }[];
  showLines?: boolean;
  discount?: Discount | null;
  onCoupon?: (code: string | null) => boolean | void;
  shipping?: number | null;
  freeShippingFrom?: number;
  vat?: number;
  title?: string | false;
  action?: ReactNode;
}
export interface CheckoutStepsProps extends BaseProps {
  steps?: string[];
  current?: number;
  onPick?: (i: number) => void;
}
export interface OrderTimelineProps extends BaseProps {
  status: "Placed" | "Paid" | "Packed" | "Shipped" | "Delivered" | "Refunded" | "Cancelled";
  times?: Record<string, string>;
}
export interface PlanCardProps extends BaseProps {
  name: string;
  text?: string;
  price: number | null;
  was?: number;
  per?: string;
  features?: string[];
  featured?: boolean;
  flag?: string;
  current?: boolean;
  cta?: string;
  onPick?: () => void;
}

/* ── Kit 3: system screens ── */
export interface StatusScreenProps extends BaseProps {
  code?: "404" | "500" | "403" | "maintenance" | "offline" | string;
  title?: string;
  text?: string;
  icon?: IconName;
  tint?: Tint;
  extra?: ReactNode;
  actions?: ReactNode[];
  onHome?: () => void;
  onContact?: () => void;
  reference?: string;
}
export interface AuthCardProps extends BaseProps {
  title: string;
  text?: string;
  icon?: IconName;
  tint?: Tint;
  brand?: string;
  foot?: ReactNode;
  children?: ReactNode;
}
/** Formats a number as a price: €32, €4.90. */

/* ── Labels and locale: the kit ships no fixed copy ── */
/** Looks up a visible string. The key is the built-in English text; {placeholders} are filled from vars. */
/** Like L, but placeholders may be React nodes. */
/** Maps built-in English texts to yours. replace: true swaps the whole set (language switch). */
/** BCP 47 tag (undefined = browser). Drives every number, money and date the kit renders. */

/* ── Kit 4: status, approvals, building blocks ── */
export type Status = "ok" | "running" | "signal" | "warn" | "danger" | "idle";
export type RiskFamily = "money" | "infra" | "comms" | "marketing" | "apps" | "legal";
export interface StatusShapeProps extends BaseProps {
  status: Status;
}
export interface StatusIndicatorProps extends BaseProps {
  status: Status;
  label?: ReactNode;
  size?: "sm";
}
export type ApprovalKey = "A" | "B" | "C" | "D";
export interface ApprovalOption {
  key: ApprovalKey;
  label: string;
  input?: string | boolean;
  placeholder?: string;
}
export interface ApprovalDecision {
  key: ApprovalKey;
  by?: string;
  at?: string;
  text?: string;
}
export interface ApprovalCardProps extends BaseProps {
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
  agent?: string;
  project?: string;
  family?: RiskFamily;
  familyLabel?: string;
  age?: string;
  escalation?: ReactNode;
  trace?: ReactNode;
  note?: ReactNode;
  heading?: string;
  options?: ApprovalOption[];
  approveLabel?: string;
  onDecide?: (key: ApprovalKey, text?: string) => void;
  decision?: ApprovalDecision | null;
  compact?: boolean;
  /** @deprecated */ onApprove?: () => void;
  /** @deprecated */ onDeny?: () => void;
  /** @deprecated */ onEdit?: (text: string) => void;
  /** @deprecated */ state?: "approved" | "denied";
}
export interface ApprovalInboxItem {
  id: string | number;
  title: string;
  agent?: string;
  project?: string;
  family?: RiskFamily;
  familyLabel?: string;
  age?: string;
  ageMin?: number;
  urgent?: boolean;
}
export interface ApprovalInboxProps extends BaseProps {
  items: ApprovalInboxItem[];
  selected?: ApprovalInboxItem["id"];
  onSelect?: (id: ApprovalInboxItem["id"]) => void;
  emptyTitle?: string;
  emptyText?: string;
  label?: string;
}
export interface KbdProps extends BaseProps {
  keys?: string[];
  children?: ReactNode;
}
export type KeyValueItem =
  [ReactNode, ReactNode, boolean?] | { k: ReactNode; v: ReactNode; mono?: boolean };
export interface KeyValueProps extends BaseProps {
  items: KeyValueItem[];
  dense?: boolean;
}
export interface SpinnerProps extends BaseProps {
  size?: "lg";
  label?: string;
}
export interface CollapsibleProps extends BaseProps {
  title: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}
export interface ContextMenuProps extends BaseProps {
  items: (MenuItem | "-")[];
  children: ReactNode;
}
export interface SplitPaneProps extends BaseProps {
  left: ReactNode;
  right: ReactNode;
  defaultSize?: number;
  min?: number;
  max?: number;
  storageKey?: string;
}
export interface TreeItem {
  id: string;
  label: ReactNode;
  icon?: IconName;
  meta?: ReactNode;
  children?: TreeItem[];
}
export interface TreeViewProps extends BaseProps {
  items: TreeItem[];
  defaultOpen?: string[];
  selected?: string;
  onSelect?: (id: string) => void;
  label?: string;
}
export interface InlineEditProps extends BaseProps {
  value: string;
  onSave?: (v: string) => void;
  options?: string[];
  mono?: boolean;
  type?: string;
  display?: (v: string) => ReactNode;
  align?: "left" | "right";
  label?: string;
}
export type LogLine =
  string | { time?: string; text: string; level?: "ok" | "warn" | "err" | "hl"; fresh?: boolean };
export interface LogViewProps extends BaseProps {
  lines: LogLine[];
  title?: ReactNode;
  right?: ReactNode;
  numbers?: boolean;
  follow?: boolean;
  maxHeight?: number;
}
export interface CodeViewerProps extends BaseProps {
  value: string | object;
  lang?: string;
}
export interface SecretFieldProps extends BaseProps {
  prefix?: string;
  last4?: string;
  value?: string;
  meta?: ReactNode;
  onReveal?: () => boolean | Promise<boolean>;
  onCopy?: () => void;
  onRotate?: () => void;
}
export interface MoneyInputProps extends BaseProps {
  label?: string;
  value?: number | null;
  onChange?: (v: number | null) => void;
  currency?: string;
  vat?: string;
  onVat?: (v: string) => void;
  vatOptions?: { value: string; label: string; rate?: number }[];
  showGross?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  defaultValue?: number | null;
  required?: boolean;
}
export interface SettingsLayoutProps extends BaseProps {
  sections: {
    id?: string;
    title: ReactNode;
    text?: ReactNode;
    badge?: ReactNode;
    children?: ReactNode;
  }[];
  footer?: ReactNode;
}
export interface ShortcutsOverlayProps extends BaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  groups: { title: string; items: [string, string[]][] }[];
}
export interface StatCellProps extends BaseProps {
  label: ReactNode;
  value: ReactNode;
  delta?: number;
  deltaText?: string;
  compare?: string;
  invert?: boolean;
  spark?: number[];
  icon?: IconName;
  iconTint?: Tint;
  tint?: Tint;
}
export type UptimeDay =
  | "ok"
  | "warn"
  | "danger"
  | "none"
  | { status: "ok" | "warn" | "danger" | "none"; label?: string; note?: string };
export interface UptimeBarProps extends BaseProps {
  days: UptimeDay[];
  uptime?: number;
  caption?: ReactNode;
}
export interface MeterProps extends BaseProps {
  label?: ReactNode;
  value: number | null;
  max?: number;
  text?: ReactNode;
  warn?: number;
  danger?: number;
  tone?: Tint;
}

/* ── Kit 4: agents and chat ── */
export interface AgentCardProps extends BaseProps {
  name: string;
  role?: string;
  tint?: Tint;
  status?: Status;
  statusLabel?: string;
  model?: string;
  cost?: string;
  last?: ReactNode;
  onClick?: () => void;
  onChat?: () => void;
}
export interface AgentDetailsProps extends BaseProps {
  name: string;
  role?: string;
  tint?: Tint;
  status?: Status;
  statusLabel?: string;
  sections?: {
    title: string;
    meta?: ReactNode;
    items?: KeyValueItem[];
    children?: ReactNode;
    open?: boolean;
  }[];
  actions?: ReactNode[];
}
export interface ChatListItem {
  id: string;
  name: string;
  sub?: ReactNode;
  time?: string;
  tint?: Tint;
  avatar?: boolean;
  status?: Status;
  unread?: number;
  pinned?: boolean;
}
export interface ChatListProps extends BaseProps {
  groups: { title: string; mark?: Tint; items: ChatListItem[] }[];
  selected?: string;
  onSelect?: (id: string) => void;
  onSearch?: (q: string) => void;
  filters?: ReactNode;
  searchPlaceholder?: string;
}
export interface ChatWorkspaceProps extends BaseProps {
  list: ReactNode;
  thread: ReactNode;
  details?: ReactNode;
  className?: string;
}
export interface SearchHitsProps extends BaseProps {
  items: { id: string | number; chat: string; time?: string; who?: string; text: string }[];
  query?: string;
  onOpen?: (item: NonNullable<SearchHitsProps["items"]>[number]) => void;
  emptyText?: string;
}
export interface ThinkingLineProps extends BaseProps {
  text?: string;
}
export interface FeedbackRatingProps extends BaseProps {
  value?: "up" | "down" | null;
  onRate?: (v: "up" | "down") => void;
  onSubmit?: (v: "up" | "down", comment?: string) => void;
  label?: string;
  placeholder?: string;
  thanks?: string;
  askOnUp?: boolean;
}
export interface ActivityItem {
  time?: string;
  status?: Status;
  actor?: ReactNode;
  text: ReactNode;
  link?: ReactNode;
}
export interface ActivityFeedProps extends BaseProps {
  groups?: { title?: string; items: ActivityItem[] }[];
  items?: ActivityItem[];
}
export interface DailyBriefingProps extends BaseProps {
  title: string;
  time?: string;
  tint?: Tint;
  summary: ReactNode;
  attention?: { text: ReactNode; status?: Status; onClick?: () => void }[];
  suggestions?: ReactNode[];
  attentionTitle?: string;
  suggestionsTitle?: string;
}
export interface BudgetStopProps extends BaseProps {
  spent: number;
  budget: number;
  title?: string;
  text?: ReactNode;
  paused?: ReactNode;
  running?: ReactNode;
  onRaise?: () => void;
  actionLabel?: string;
}
export interface MemoryViewerProps extends BaseProps {
  items: { id: string | number; scope: string; source?: string; date?: string; text: string }[];
  onEdit?: (item: NonNullable<MemoryViewerProps["items"]>[number]) => void;
  onDelete?: (item: NonNullable<MemoryViewerProps["items"]>[number]) => void;
}
export interface OverrideDiffProps extends BaseProps {
  title?: string;
  versions?: ReactNode;
  by?: ReactNode;
  before: string;
  after: string;
  onDiscard?: () => void;
  onPromote?: () => void;
  discardLabel?: string;
  promoteLabel?: string;
}
export interface TriggerListProps extends BaseProps {
  items: {
    id: string | number;
    type: "schedule" | "event" | "webhook" | "mail";
    rule: ReactNode;
    agent?: string;
    by?: string;
    next?: string;
    enabled?: boolean;
  }[];
  onToggle?: (item: NonNullable<TriggerListProps["items"]>[number]) => void;
  onRun?: (item: NonNullable<TriggerListProps["items"]>[number]) => void;
}
export interface ScheduleCalendarProps extends BaseProps {
  events: {
    day: number;
    start: number;
    end: number;
    label: string;
    sub?: string;
    tint?: Tint;
    self?: boolean;
  }[];
  from?: number;
  to?: number;
  days?: string[];
  onOpen?: (e: NonNullable<ScheduleCalendarProps["events"]>[number]) => void;
}
export interface OrgNode {
  id?: string | number;
  root?: boolean;
  name: string;
  role?: string;
  tint?: Tint;
  status?: Status;
  avatar?: boolean;
  children?: OrgNode[];
}
export interface OrgChartProps extends BaseProps {
  root: OrgNode;
}
export interface VoiceModeProps extends BaseProps {
  name: string;
  tint?: Tint;
  state: "listening" | "thinking" | "speaking" | "idle";
  stateLabel?: string;
  transcript?: ReactNode;
  muted?: boolean;
  onMute?: () => void;
  onEnd?: () => void;
}

/* ── Kit 4: operations ── */
export interface ConnectionCardProps extends BaseProps {
  name: string;
  icon?: IconName;
  logo?: ReactNode;
  text?: ReactNode;
  status: "connected" | "expiring" | "error" | "missing";
  statusLabel?: string;
  action?: ReactNode;
}
export interface ConnectionBannerProps extends BaseProps {
  state: "reconnecting" | "offline" | "online";
  seconds?: number;
  text?: ReactNode;
  onRetry?: () => void;
}
export interface ServerCardProps extends BaseProps {
  name: string;
  provider?: string;
  address?: string;
  logo?: ReactNode;
  status?: Status;
  statusLabel?: string;
  meters?: {
    label: string;
    value: number | null;
    max?: number;
    text?: ReactNode;
    unknown?: string;
  }[];
  uptime?: UptimeBarProps;
  foot?: ReactNode;
}
export interface DeployPipelineProps extends BaseProps {
  stages: {
    name: string;
    status?: "done" | "running" | "signal" | "danger" | "idle";
    duration?: string;
    action?: ReactNode;
  }[];
}
export interface DnsRecord {
  id: string | number;
  type: string;
  name: string;
  content: string;
  ttl?: string;
  proxy?: boolean | null;
}
export interface DnsRecordTableProps extends BaseProps {
  records: DnsRecord[];
  rowMenu?: (r: DnsRecord) => (MenuItem | "-")[];
  selectable?: boolean;
  bulkActions?: BulkAction<DnsRecord>[];
  toolbar?: ReactNode;
}
export interface DomainListProps extends BaseProps {
  items: {
    name: string;
    registrar?: string;
    dns?: string;
    days?: number;
    ssl?: Status;
    sslLabel?: string;
  }[];
  onOpen?: (d: NonNullable<DomainListProps["items"]>[number]) => void;
}
export interface MailAuthStatusProps extends BaseProps {
  rows: {
    domain: string;
    mx?: { status: Status; label?: string };
    spf?: { status: Status; label?: string };
    dkim?: { status: Status; label?: string };
    dmarc?: { status: Status; label?: string };
  }[];
  columns?: string[];
  onOpen?: (row: NonNullable<MailAuthStatusProps["rows"]>[number], column: string) => void;
}
export interface LedgerRow {
  id: string | number;
  date: string;
  ref?: string;
  text: string;
  category?: string;
  project?: string;
  projectTint?: Tint;
  net: number;
  vat?: number;
  gross: number;
  suggested?: string;
  status?: Status;
  statusLabel?: string;
}
export interface LedgerTableProps extends BaseProps {
  rows: LedgerRow[];
  categories?: string[];
  onEdit?: (row: LedgerRow, change: Partial<LedgerRow>) => void;
  currency?: string;
  selectable?: boolean;
  bulkActions?: BulkAction<LedgerRow>[];
  toolbar?: ReactNode;
  maxHeight?: number;
  columnToggle?: boolean;
}
export interface PnLStatementProps extends BaseProps {
  columns: string[];
  rows: { kind?: "section" | "subtotal" | "total"; label: string; values?: number[] }[];
  currency?: string;
  total?: boolean;
  label?: string;
}
export interface ReceiptSuggestionProps extends BaseProps {
  file: string;
  source?: ReactNode;
  fields: { label: string; value: ReactNode; mono?: boolean; confidence?: number }[];
  suggestion?: ReactNode;
  onConfirm?: () => void;
  onDiscard?: () => void;
  confirmLabel?: string;
  discardLabel?: string;
  children?: ReactNode;
}

/* ── Kit 4: mail, mobile, platform ── */
export interface AccountSwitcherProps extends BaseProps {
  accounts: { address: string; domain?: string; unread?: number }[];
  value?: string | null;
  onChange?: (address: string | null) => void;
  unread?: number;
  allLabel?: string;
}
export interface InboxListProps extends BaseProps {
  items: {
    id: string | number;
    from: string;
    time?: string;
    subject: string;
    snippet?: string;
    unread?: boolean;
    to?: string;
    agent?: { label: string; tone?: Tone };
    tags?: string[];
  }[];
  selected?: string | number;
  onOpen?: (m: NonNullable<InboxListProps["items"]>[number]) => void;
}
export interface MailThreadProps extends BaseProps {
  subject: string;
  messages: {
    id: string | number;
    from: string;
    to?: string;
    time?: string;
    snippet?: string;
    body: ReactNode;
    agent?: boolean;
    tint?: Tint;
    agentNote?: string;
    attachments?: { name: string; size?: string }[];
  }[];
  reply?: ReactNode;
}
export interface SignatureEditorProps extends BaseProps {
  value?: Record<string, string>;
  onChange?: (v: Record<string, string>) => void;
  fields?: { key: string; label: string }[];
  note?: ReactNode;
  extra?: ReactNode;
  defaultValue?: Record<string, string>;
  previewLabel?: string;
}
export interface AttachmentPreviewProps extends BaseProps {
  name: string;
  meta?: ReactNode;
  children?: ReactNode;
  facts?: KeyValueItem[];
  found?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  width?: number | string;
  inline?: boolean;
}
export interface MobileTabBarProps extends BaseProps {
  items: { id: string; label: string; icon: IconName; count?: number }[];
  active?: string;
  onPick?: (id: string) => void;
  label?: string;
}
export interface PushNotificationProps extends BaseProps {
  app?: string;
  time?: string;
  title: string;
  text?: ReactNode;
  actions?: { label: string; onClick?: () => void }[];
}
export interface ConfigPRSummaryProps extends BaseProps {
  title: string;
  meta?: ReactNode;
  status?: Status;
  statusLabel?: string;
  summary?: ReactNode;
  items: {
    kind: "project" | "team" | "agent" | "tool" | "trigger" | "file";
    name: string;
    detail?: ReactNode;
    op?: "add" | "change" | "remove";
  }[];
  actions?: ReactNode[];
}
export interface ModuleRegistryProps extends BaseProps {
  items: {
    id: string;
    name: string;
    version?: string;
    text?: ReactNode;
    icon?: IconName;
    core?: boolean;
    enabled?: boolean;
    adds?: string[];
  }[];
  onToggle?: (m: NonNullable<ModuleRegistryProps["items"]>[number]) => void;
  coreLabel?: string;
}

/* ── Kit 5: shared form and data pieces ── */
export interface RangeSliderProps extends BaseProps {
  label?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (v: [number, number]) => void;
  unit?: string;
  inputs?: boolean;
  openEnd?: boolean;
  format?: (v: number) => string;
  hint?: ReactNode;
}
export interface BarListProps extends BaseProps {
  items: {
    id?: string;
    label: ReactNode;
    mark?: ReactNode;
    value: number;
    share?: number;
    tint?: Tint;
  }[];
  format?: (v: number) => string;
  onPick?: (item: NonNullable<BarListProps["items"]>[number]) => void;
  label?: string;
}
export interface StatusSelectProps extends BaseProps {
  options: { value: string; label: string; status?: Status }[];
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  size?: "sm";
  label?: string;
  width?: number;
}
export interface TilePickerProps extends BaseProps {
  options: {
    value: string;
    label: ReactNode;
    meta?: ReactNode;
    image?: string;
    icon?: IconName;
    art?: ReactNode;
    tint?: Tint;
    color?: string;
    disabled?: boolean;
  }[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (v: string | string[] | null) => void;
  multiple?: boolean;
  min?: number;
  label?: string;
}
export interface ColorFieldProps extends BaseProps {
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  against?: string | false;
  hint?: ReactNode;
}
export interface MapPoint {
  id: string | number;
  label: string;
  sub?: ReactNode;
  lat: number;
  lng: number;
  value?: number;
  text?: ReactNode;
  tint?: Tint;
  pulse?: boolean;
}
export interface MapViewProps extends BaseProps {
  points?: MapPoint[];
  bounds?: { n: number; s: number; w: number; e: number };
  background?: ReactNode;
  bubbles?: boolean;
  selected?: MapPoint["id"] | null;
  onSelect?: (id: MapPoint["id"] | null) => void;
  renderPopup?: (p: MapPoint) => ReactNode;
  legend?: ReactNode;
  controls?: ReactNode;
  /** Height in px (default 320) or any CSS length, e.g. "100%" to fill a FloatingLayout. */
  height?: number | string;
  label?: string;
  /** `"glass"`: the legend, controls and popup float as glass over the map (for a live map in `background`). */
  surface?: Surface;
  className?: string;
}

/* ── Kit 5: admin ── */
export interface LiveFeedItem {
  id: string | number;
  type?: string;
  icon?: IconName;
  tint?: Tint;
  title: ReactNode;
  text?: ReactNode;
  amount?: number;
  currency?: string;
  time?: string;
  fresh?: boolean;
}
export interface LiveFeedProps extends BaseProps {
  items: LiveFeedItem[];
  types?: { value: string; label: string }[];
  paused?: boolean;
  onPause?: (paused: boolean) => void;
  maxHeight?: number;
  emptyText?: string;
}
export interface RichTextEditorProps extends BaseProps {
  label?: ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  variables?: { key: string; label: string }[];
  maxLength?: number;
  minHeight?: number;
  footer?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
}
export interface EmailPreviewProps extends BaseProps {
  from?: string;
  fromName?: string;
  subject?: string;
  preheader?: string;
  html?: string;
  children?: ReactNode;
  device?: "desktop" | "mobile";
  onDevice?: (d: string) => void;
  checks?: { status: Status; label: ReactNode }[];
}
export interface SearchAdPreviewProps extends BaseProps {
  name?: string;
  domain: string;
  paths?: string[];
  headlines?: string[];
  descriptions?: string[];
  sitelinks?: string[];
  device?: "mobile" | "desktop";
  onDevice?: (d: string) => void;
  sponsoredLabel?: string;
}
export interface BalanceCardProps extends BaseProps {
  name: string;
  sub?: ReactNode;
  logo?: ReactNode;
  icon?: IconName;
  tint?: Tint;
  balance: number;
  currency?: string;
  perDay?: number;
  low?: number;
  spark?: number[];
  status?: Status;
  statusLabel?: string;
  onTopUp?: () => void;
  topUpLabel?: string;
  action?: ReactNode;
}
export interface ServiceMonitorProps extends BaseProps {
  items: {
    id?: string;
    name: string;
    status: Status;
    statusLabel?: string;
    latency?: number | null;
    errorRate?: number | null;
    checked?: string;
    history?: (Status | "none")[];
  }[];
  label?: string;
}
export interface RunHistoryProps extends BaseProps {
  items: {
    id: string | number;
    name: string;
    status: Status;
    started?: string;
    duration?: string;
    by?: string;
    counts?: { value: number; label: string; tone?: Tone }[];
    detail?: ReactNode;
  }[];
  label?: string;
}
export interface WebhookEndpointProps extends BaseProps {
  url: string;
  events?: string[];
  status?: Status;
  statusLabel?: string;
  successRate?: number;
  enabled?: boolean;
  onToggle?: () => void;
  secret?: ReactNode;
  deliveries?: { id: string | number; code?: number; event: string; time?: string; ms?: number }[];
  onRetry?: (d: NonNullable<WebhookEndpointProps["deliveries"]>[number]) => void;
  menu?: MenuProps["items"];
  defaultOpen?: boolean;
}
export interface BackupListProps extends BaseProps {
  items: {
    id: string | number;
    name?: string;
    time?: string;
    kind?: string;
    where?: string;
    retention?: string;
    size?: string;
    status?: Status;
  }[];
  onDownload?: (b: NonNullable<BackupListProps["items"]>[number]) => void;
  onRestore?: (b: NonNullable<BackupListProps["items"]>[number]) => void;
  footer?: ReactNode;
  label?: string;
}
export interface BlockListProps extends BaseProps {
  items: {
    id: string | number;
    value: string;
    kind?: string;
    reason?: string;
    by?: string;
    until?: string;
  }[];
  onAdd?: () => void;
  onRemove?: (b: NonNullable<BlockListProps["items"]>[number]) => void;
  addLabel?: string;
  removeLabel?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}
export interface ReviewCardProps extends BaseProps {
  author: string;
  verified?: boolean;
  product?: string;
  date?: string;
  rating: number;
  title?: string;
  text: string;
  state?: "pending" | "published" | "hidden" | "flagged";
  stateLabel?: string;
  highlight?: string[];
  reply?: string;
  replyLabel?: string;
  onPublish?: () => void;
  onHide?: () => void;
  onReply?: (text: string) => void;
}
export interface CouponCardProps extends BaseProps {
  code: string;
  kind?: "percent" | "fixed";
  value: number;
  currency?: string;
  used?: number;
  limit?: number;
  until?: string;
  min?: number;
  revenue?: number;
  text?: ReactNode;
  status?: Status;
  statusLabel?: string;
  onCopy?: () => void;
  menu?: MenuProps["items"];
}
export interface LocaleFieldProps extends BaseProps {
  label?: ReactNode;
  locales: { code: string; label?: string; flag?: string }[];
  value?: Record<string, string>;
  defaultValue?: Record<string, string>;
  onChange?: (v: Record<string, string>) => void;
  source?: string;
  active?: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  onTranslate?: (text: string, to: string) => string | Promise<string>;
  hint?: ReactNode;
  error?: ReactNode;
}
export interface LocaleSwitcherProps extends BaseProps {
  languages?: { code: string; label: string; short?: string; flag?: string }[];
  language?: string;
  onLanguage?: (code: string) => void;
  currencies?: string[];
  currency?: string;
  onCurrency?: (c: string) => void;
  variant?: "frame";
}
export interface WorkspaceSwitcherProps extends BaseProps {
  items: { id: string; name: string; sub?: string; tint?: Tint; logo?: ReactNode }[];
  value?: string;
  onChange?: (id: string) => void;
  label?: string;
  footer?: ReactNode;
  variant?: "frame";
  width?: number;
}
export interface ExportDialogProps extends BaseProps {
  open?: boolean;
  inline?: boolean;
  onClose?: () => void;
  title?: string;
  text?: ReactNode;
  count?: number;
  formats?: string[];
  format?: string;
  columns?: { key: string; label: string; default?: boolean }[];
  ranges?: boolean;
  range?: { from: Date | null; to: Date | null } | null;
  note?: ReactNode;
  onExport?: (
    o: { format: string; columns: string[]; range: DateRange | null },
    progress: (pct: number) => void,
  ) => void | Promise<void>;
  onDownload?: () => void;
  download?: ReactNode;
  doneText?: string;
}
export interface TwoFactorSetupProps extends BaseProps {
  qr?: ReactNode;
  secret: string;
  onVerify?: (code: string) => boolean | Promise<boolean>;
  codes?: string[];
  onDownload?: () => void;
  onDone?: () => void;
  step?: 0 | 1 | 2;
  scanText?: string;
  codesText?: string;
}

/* ── Kit 5: media ── */
export interface ImageVariant {
  id: string | number;
  label: string;
  src?: string;
  size?: string;
  format?: string;
  weight?: string;
  ratio?: string;
  status?: Status;
}
export interface ImageVariantsProps extends BaseProps {
  variants: ImageVariant[];
  selected?: string | number;
  onSelect?: (id: string | number) => void;
  alt?: string;
  tint?: Tint;
  actions?: ReactNode;
}
export interface GalleryItem {
  src?: string;
  alt?: string;
  caption?: string;
  art?: ReactNode;
  tint?: Tint;
}
export interface GalleryProps extends BaseProps {
  items: GalleryItem[];
  start?: number;
  ratio?: string;
  thumbs?: boolean;
  fullscreen?: boolean;
  badge?: ReactNode;
}
export interface MediaPane {
  src?: string;
  alt?: string;
  art?: ReactNode;
  tint?: Tint;
}
export interface BeforeAfterProps extends BaseProps {
  before: MediaPane;
  after: MediaPane;
  start?: number;
  ratio?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/* ── Kit 5: real estate ── */
export interface Listing {
  id: string | number;
  title: string;
  price: number | null;
  rent?: boolean;
  currency?: string;
  pricePerSqm?: number;
  area?: number;
  rooms?: number;
  place?: string;
  image?: string;
  tint?: Tint;
  photos?: number;
  source?: string;
  seller?: "private" | "agent";
  sellerLabel?: string;
  phone?: boolean;
  isNew?: boolean;
  age?: string;
  status?: string;
  wished?: boolean;
}
export interface ListingCardProps extends BaseProps {
  listing: Listing;
  layout?: "card" | "row";
  selected?: boolean;
  onSelect?: (l: Listing) => void;
  onWish?: (l: Listing) => void;
  statusOptions?: StatusSelectProps["options"];
  onStatus?: (l: Listing, status: string) => void;
  onOpen?: (l: Listing) => void;
}
export interface ResultsToolbarProps extends BaseProps {
  title?: string;
  total: number;
  meta?: string;
  selected?: number;
  onSelectAll?: (all: boolean) => void;
  bulkActions?: {
    label: string;
    icon?: IconName;
    variant?: ButtonProps["variant"];
    busy?: boolean;
    busyLabel?: string;
    onClick?: () => void;
  }[];
  sortOptions?: { value: string; label: string }[];
  sort?: string;
  onSort?: (v: string) => void;
  views?: ("grid" | "list" | "map")[];
  view?: string;
  onView?: (v: string) => void;
}
export interface SavedSearchProps extends BaseProps {
  name: string;
  criteria?: ReactNode[];
  lastRun?: string;
  frequency?: string;
  newCount?: number;
  enabled?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onOpen?: () => void;
  openLabel?: string;
  icon?: IconName;
  tint?: Tint;
}
export interface ValuationCardProps extends BaseProps {
  value: number;
  low: number;
  high: number;
  asking?: number;
  perSqm?: number;
  compare?: string;
  currency?: string;
  confidence?: number;
  confidenceLabel?: string;
  facts?: KeyValueItem[];
  note?: ReactNode;
  title?: string;
  action?: ReactNode;
}
export interface EnergyClassProps extends BaseProps {
  value: string;
  kwh?: number;
  kind?: string;
  scale?: string[];
}

/* ── Kit 5: site chrome ── */
export interface ChatLauncherProps extends BaseProps {
  title?: string;
  context?: ReactNode;
  tint?: Tint;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  unread?: number;
  headerAction?: ReactNode;
  children?: ReactNode;
  composer?: ReactNode;
  inline?: boolean;
}
export interface CookieConsentProps extends BaseProps {
  title?: string;
  text?: ReactNode;
  policy?: ReactNode;
  categories?: {
    id: string;
    label: string;
    text?: string;
    required?: boolean;
    default?: boolean;
  }[];
  onSave?: (choices: Record<string, boolean>) => void;
  open?: boolean;
  inline?: boolean;
}
export interface AnnouncementBarProps extends BaseProps {
  children: ReactNode;
  tint?: Tint;
  icon?: IconName | false;
  action?: ReactNode;
  onDismiss?: (() => void) | false;
}

/* ── Primitives (shadcn parity) ── */
export interface AccordionItem {
  /** Stable id (defaults to the index). */
  id?: string;
  title: ReactNode;
  /** Secondary text on the right of the header. */
  meta?: ReactNode;
  icon?: IconName;
  disabled?: boolean;
  content: ReactNode;
}
export interface AccordionProps extends BaseProps {
  items: AccordionItem[];
  /** Several sections open at once (default: one at a time). */
  multiple?: boolean;
  /** Open section ids (controlled). */
  value?: string[];
  defaultValue?: string[];
  onChange?: (open: string[]) => void;
  /** `cards`: each section is a card; `flush`: hairlines only (inside a panel). */
  variant?: "cards" | "flush";
}
export interface SeparatorProps extends BaseProps {
  orientation?: "horizontal" | "vertical";
  /** Text in the middle of the line ("or"). */
  label?: string;
}
export interface AspectRatioProps extends BaseProps {
  /** Width divided by height (default 16 / 9). */
  ratio?: number;
  children?: ReactNode;
}
export interface LabelProps extends BaseProps {
  htmlFor?: string;
  required?: boolean;
  /** Muted text after the label ("optional"). */
  hint?: ReactNode;
  children?: ReactNode;
}
export interface ToggleProps extends BaseProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  icon?: IconName;
  /** Accessible name; required when the toggle shows only an icon. */
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  children?: ReactNode;
}
export interface ToggleGroupProps extends BaseProps {
  items: (string | Option)[];
  /** `single`: at most one pressed; `multiple`: any number. */
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Accessible name of the group. */
  label: string;
  size?: "sm" | "md";
}
export interface ButtonGroupProps extends BaseProps {
  /** Accessible name of the group. */
  label?: string;
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
}
export interface ScrollAreaProps extends BaseProps {
  /** Fixed height of the scrolling box. */
  height?: number | string;
  maxHeight?: number | string;
  orientation?: "vertical" | "horizontal" | "both";
  /** Accessible name; the box is a focusable region so it scrolls from the keyboard. */
  label: string;
  children?: ReactNode;
}
export interface HoverCardProps extends BaseProps {
  /** The element that opens the card on hover and keyboard focus. */
  trigger: ReactNode;
  children?: ReactNode;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  openDelay?: number;
  closeDelay?: number;
  width?: number;
}
export interface CarouselProps extends BaseProps {
  slides: ReactNode[];
  /** Accessible name of the carousel. */
  label: string;
  /** Slides visible at once on wide screens (1 on phones). */
  perView?: number;
  /** Next on the last slide goes back to the first. */
  loop?: boolean;
  /** Dots under the slides. */
  dots?: boolean;
  index?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

/* ── Form ── */
export type FormValues = Record<string, string | string[]>;
export interface FormRule {
  /** Must not be empty; a string replaces the default message. */
  required?: boolean | string;
  /** Must look like an email address. */
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  /** For numbers. */
  min?: number;
  max?: number;
  pattern?: RegExp;
  /** Message for `pattern`, `min`/`max`, `minLength`/`maxLength` and `email`. */
  message?: string;
  /** Custom check: return a message when the value is not valid. */
  validate?: (value: string, values: FormValues) => string | null | undefined | false;
}
export interface FormProps extends BaseProps {
  /** Rules by field `name`. Fields show their message under the input. */
  rules?: Record<string, FormRule>;
  /** Called with the values (by `name`) when every rule passes. */
  onSubmit?: (values: FormValues) => void;
  /** Called with the messages when the form is submitted with errors. */
  onInvalid?: (errors: Record<string, string>) => void;
  /** Messages from the server, by field name (for example after a failed save). */
  errors?: Record<string, string>;
  children?: ReactNode;
}

/* ── SelectMenu ── */
export interface SelectMenuOption extends Option {
  /** Options with the same group are listed under that heading. */
  group?: string;
}
export interface SelectMenuProps extends FieldProps, BaseProps {
  options: (string | SelectMenuOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/* ── Navigation ── */
export interface MenubarMenu {
  label: string;
  items: (MenuItem | "-")[];
}
export interface MenubarProps extends BaseProps {
  menus: MenubarMenu[];
  /** Accessible name of the bar. */
  label?: string;
}
export interface NavigationMenuLink {
  label: string;
  href?: string;
  description?: string;
  icon?: IconName;
  onClick?: () => void;
}
export interface NavigationMenuItem {
  label: string;
  /** A plain link (no panel). */
  href?: string;
  /** Links in the dropdown panel. */
  links?: NavigationMenuLink[];
  /** Extra content on the left of the panel (a highlighted card). */
  feature?: ReactNode;
}
export interface NavigationMenuProps extends BaseProps {
  items: NavigationMenuItem[];
  /** Accessible name of the navigation. */
  label?: string;
}
export interface SidebarItem {
  id?: string;
  label: string;
  icon: IconName;
  count?: number;
  /** One level of nested pages, shown when the item is open. */
  items?: Omit<SidebarItem, "items">[];
}
export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}
export interface SidebarProps extends BaseProps {
  groups: SidebarGroup[];
  /** Id (or label) of the current page. */
  current?: string;
  onPick?: (id: string) => void;
  /** Icons only. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Top of the sidebar (brand, workspace switcher). */
  header?: ReactNode;
  /** Bottom of the sidebar (account, settings). */
  footer?: ReactNode;
  /** Accessible name of the navigation. */
  label?: string;
}

/* ── ResizablePanels ── */
export interface ResizablePanelsProps extends BaseProps {
  panels: ReactNode[];
  /** Start sizes in percent (default: equal). */
  defaultSizes?: number[];
  /** Smallest size of a panel in percent (default 10). */
  min?: number;
  orientation?: "horizontal" | "vertical";
  /** Remembers the sizes in localStorage under this key. */
  storageKey?: string;
  /** Accessible names of the panels, used for the resize handles. */
  labels?: string[];
}
