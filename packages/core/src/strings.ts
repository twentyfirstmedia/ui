import { Fragment, createElement, type ReactNode } from "react";

/**
 * Every built-in string of the kits: accessible names, button texts, placeholders and status
 * words that a component shows when no prop sets them. English by default. Apps replace any of
 * them with `<UIProvider messages={{ … }}>` (partial); components read them with `useUIStrings()`.
 * Texts with a value in them are functions, so word order stays free (`selectedCount(3)`).
 */
export interface UIStrings {
  /* Shared */
  close: string;
  cancel: string;
  confirm: string;
  send: string;
  stop: string;
  copy: string;
  copied: string;
  dismiss: string;
  remove: string;
  /** "Remove {name}", on remove buttons next to a named item. */
  removeItem: (name: string) => string;
  clear: string;
  search: string;
  edit: string;
  save: string;
  apply: string;
  undo: string;
  redo: string;
  loading: string;
  thinking: string;
  paused: string;
  actions: string;
  settings: string;
  status: string;
  preview: string;
  expand: string;
  results: string;
  selectPlaceholder: string;
  noMatches: string;
  /* Chat: CodeBlock, ChatMessage, ToolCall, Reasoning, ModelPicker, Composer */
  copyCode: string;
  /** TypingDots. */
  working: string;
  /** Name on the user's own chat messages. */
  you: string;
  copyReply: string;
  regenerate: string;
  regenerateReply: string;
  goodReply: string;
  badReply: string;
  toolInput: string;
  toolResult: string;
  toolError: string;
  thoughtFor: (duration?: string) => string;
  model: string;
  commands: string;
  messagePlaceholder: string;
  message: string;
  attachFiles: string;
  composerHint: string;
  /* Agents: AgentStatus, RunTrace, UsageMeter */
  /** Display text per agent status (the status values stay English). */
  agentStatus: Record<string, string>;
  step: string;
  timeline: (total: string) => string;
  stepRunning: string;
  context: string;
  /* Data: FilterBar, DataTable */
  removeFilter: (filter: string) => string;
  /** FilterBar's add-filter chip. */
  addFilter: string;
  clearAll: string;
  back: string;
  columns: string;
  chooseColumns: string;
  selectAllRows: string;
  selectRow: string;
  expandRow: string;
  collapseRow: string;
  nothingMatchesFilters: string;
  bulkActions: string;
  /** "{n} selected"; `formatted` is `n` in the provider locale. */
  selectedCount: (n: number, formatted?: string) => string;
  /* Media: ImageVariants, Gallery, BeforeAfter */
  variants: string;
  images: string;
  imageN: (n: number) => string;
  previousImage: string;
  nextImage: string;
  fullScreen: string;
  before: string;
  after: string;
  compareBeforeAfter: string;
  /* Feedback: ConfirmDialog */
  /** "Type {text} to confirm"; `text` is the highlighted word to type. */
  typeToConfirm: (text: ReactNode) => ReactNode;
  /* Navigation: Breadcrumb, Pagination, NavigationMenu, Sidebar, AppShell */
  breadcrumb: string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  /** Accessible name of main navigation landmarks. */
  mainNavigation: string;
  sidebar: string;
  /** Name of a `Sidebar as="aside"` and its button on phones, unless the app passes `label` */
  filters: string;
  expandSidebar: string;
  collapseSidebar: string;
  /** The menu button that opens the sidebar on phones. */
  openNavigation: string;
  closeNavigation: string;
  /** The "…" button of a sidebar item. */
  moreActionsFor: (label: string) => string;
  /** Said after a link that opens in a new tab. */
  opensInNewTab: string;
  /** Said for the dot marker on a sidebar item. */
  newActivity: string;
  switchWorkspace: string;
  /** The account menu (UserMenu). */
  account: string;
  /* Carousel */
  /** aria-roledescription of a carousel slide. */
  slide: string;
  slideOf: (n: number, total: number) => string;
  previousSlide: string;
  nextSlide: string;
  goToSlide: (n: number) => string;
  /* Forms: Combobox, TagInput, Calendar, DatePicker, NumberInput, OtpInput, FileDrop */
  createOption: (text: string) => string;
  tagPlaceholder: string;
  previousMonth: string;
  nextMonth: string;
  lastDays: (n: number) => string;
  thisYear: string;
  pickDate: string;
  pickRange: string;
  decrease: string;
  increase: string;
  /** TextField type="password": the reveal button */
  showPassword: string;
  hidePassword: string;
  verificationCode: string;
  digitN: (n: number) => string;
  dropFiles: string;
  dropToUpload: string;
  dropHint: string;
  uploaded: (size: string) => string;
  cancelUpload: string;
  /* Form validation */
  fieldRequired: string;
  invalidEmail: string;
  minLength: (n: number) => string;
  maxLength: (n: number) => string;
  minValue: (n: number) => string;
  maxValue: (n: number) => string;
  invalidFormat: string;
  /* Data display: EventCard, ListRow, FileRow, KanbanColumn, Progress */
  open: string;
  unread: string;
  downloadItem: (name: string) => string;
  columnOptions: string;
  addCard: string;
  progress: string;
  /* Real estate: ListingCard, ResultsToolbar, SavedSearch, ValuationCard, EnergyClass */
  /** Listing facts; `rooms` is the formatted count. */
  rooms: (rooms: string, n: number) => string;
  priceOnRequest: string;
  perMonth: string;
  /** Badge on new listings. */
  isNew: string;
  select: string;
  removeFromSaved: string;
  privateSeller: string;
  agent: string;
  phoneAvailable: string;
  selectAll: string;
  deselectAll: string;
  foundCount: (n: number, formatted: string) => string;
  workingEllipsis: string;
  sort: string;
  view: string;
  viewGrid: string;
  viewMap: string;
  viewList: string;
  checkedAt: (when: string) => string;
  enabled: string;
  showResults: string;
  estimatedValue: string;
  highConfidence: string;
  mediumConfidence: string;
  lowConfidence: string;
  range: (low: string, high: string) => string;
  askingPrice: string;
  energyClass: (value: string) => string;
  /* Shell: SideRail, Dock */
  tools: string;
  quickActions: string;
  /** SideRail toggle: show the names next to the icons */
  expandRail: string;
  /** SideRail toggle: back to icons only */
  collapseRail: string;
  /** FloatingLayout bottom sheet handle */
  expandPanel: string;
  collapsePanel: string;
  /* Site: ChatLauncher, CookieConsent */
  assistant: string;
  openAssistant: string;
  closeAssistant: string;
  privacySettings: string;
  cookieText: string;
  alwaysOn: string;
  saveChoice: string;
  onlyNecessary: string;
  acceptAll: string;
  /* App chrome: ModuleRegistry */
  coreModule: string;
  /* Charts */
  barChart: string;
  lineChart: string;
  trend: string;
  breakdown: string;
  stackedBarChart: string;
  areaChart: string;
  heatmap: string;
  less: string;
  more: string;
  gauge: string;
  gaugeValue: (label: string, value: number, max: number) => string;
  /* SelectMenu */
  options: string;
  /* ResizablePanels */
  resizePanel: (label: string | undefined, n: number) => string;
  /* RichTextEditor */
  bold: string;
  italic: string;
  underline: string;
  heading: string;
  quote: string;
  bulletedList: string;
  numberedList: string;
  link: string;
  formatting: string;
  linkAddress: string;
  removeLink: string;
  insertField: string;
  /** Accessible name of the editor area without a label. */
  text: string;
  /* Agents: AgentCard, ChatList, FeedbackRating, DailyBriefing, BudgetStop, MemoryViewer, OverrideDiff, TriggerList, VoiceMode */
  chatWith: (name: string) => string;
  costToday: string;
  lastAction: string;
  searchChats: string;
  noChatsMatch: string;
  nothingFound: string;
  thanksNoted: string;
  good: string;
  notGood: string;
  whatShouldBeDifferent: string;
  needsYou: string;
  suggestions: string;
  budgetUsedUp: string;
  raiseBudget: string;
  budgetText: string;
  spentThisMonth: string;
  stillRunning: string;
  nothing: string;
  searchMemory: string;
  nothingRemembered: string;
  forget: string;
  discardOverride: string;
  moveToCode: string;
  runNow: string;
  listening: string;
  speaking: string;
  mute: string;
  unmute: string;
  endConversation: string;
  /* Approvals: ApprovalCard, ApprovalInbox */
  /** Option A. */
  approveAsShown: string;
  /** Option B. */
  approveWithChange: string;
  whatShouldChange: string;
  /** Option C. */
  discard: string;
  /** Option D. */
  differentInstruction: string;
  whatInstead: string;
  approvalNeeded: string;
  approvals: string;
  nothingWaiting: string;
  /** Badge text per risk family. */
  riskFamily: Record<"money" | "infra" | "comms" | "marketing" | "apps" | "legal", string>;
  /* Developer: SecretField, MoneyInput, ShortcutsOverlay, UptimeBar */
  hide: string;
  reveal: string;
  rotate: string;
  vatRate: string;
  gross: (amount: string) => string;
  keyboardShortcuts: string;
  daysAgo: (n: number) => string;
  /* Operations: ConnectionBanner, ServerCard, DeployPipeline, DnsRecordTable, DomainList, MailAuthStatus, LedgerTable, PnLStatement, ReceiptSuggestion */
  offline: string;
  connectionLost: (seconds?: number) => string;
  retryNow: string;
  unknown: string;
  deployPipeline: string;
  colType: string;
  colName: string;
  colContent: string;
  colProxy: string;
  proxied: string;
  dnsOnly: string;
  expires: string;
  daysCount: (n: number) => string;
  domain: string;
  colDate: string;
  colRef: string;
  colDescription: string;
  colCategory: string;
  colProject: string;
  net: string;
  vat: string;
  grossLabel: string;
  suggestedBy: (who: string) => string;
  total: string;
  notAReceipt: string;
  bookIt: string;
  /* Mail: AccountSwitcher, SignatureEditor */
  allInboxes: string;
  addressCount: (n: number) => string;
  findAddress: string;
  role: string;
  company: string;
  phone: string;
  website: string;
  /* Previews: EmailPreview, SearchAdPreview */
  noSubject: string;
  device: string;
  desktop: string;
  mobile: string;
  emailPreview: string;
  sponsored: string;
  yourHeadline: string;
  yourDescription: string;
  /** Warning when a search ad text is too long. */
  adTooLong: (
    field: "headlines" | "descriptions" | "paths",
    n: number,
    length: number,
    limit: number,
  ) => string;
  /* Commerce: Rating, StockBadge, ProductCard, VariantPicker, CartLine, OrderSummary, CheckoutSteps, OrderTimeline, PlanCard */
  ratingLabel: (value: string, count?: number) => string;
  outOfStock: string;
  lowStock: (left: number) => string;
  inStock: string;
  inStockCount: (n: number) => string;
  soldOut: string;
  addToCart: (name: string) => string;
  variantSoldOut: (variant: string) => string;
  oneLess: string;
  oneMore: string;
  orderSummary: string;
  freeShippingIn: (amount: ReactNode) => ReactNode;
  invalidCode: string;
  discountCode: string;
  subtotal: string;
  discount: string;
  shipping: string;
  free: string;
  inclVat: (rate: string) => string;
  /** Default CheckoutSteps. */
  checkoutSteps: string[];
  checkoutProgress: string;
  /** Display text per order status (the status values stay English). */
  orderStatus: Record<string, string>;
  mostPopular: string;
  letsTalk: string;
  perSeatMonth: string;
  currentPlan: string;
  choosePlan: (name: string) => string;
  /* Workspace: SubNav, CommandPalette, NotificationList, Flow, FileCard, Wizard, PermissionMatrix, InvoicePreview, TransactionRow */
  sectionPages: (section?: string) => string;
  commandPalette: string;
  paletteSearchPlaceholder: string;
  escKey: string;
  searching: string;
  nothingMatches: (query: string) => string;
  paletteMove: string;
  paletteOpen: string;
  paletteAnywhere: string;
  notifications: string;
  markAllRead: string;
  all: string;
  allCaughtUp: string;
  /** Flow step kinds. */
  flowStep: Record<"trigger" | "condition" | "agent" | "approval" | "action", string>;
  flowRunning: string;
  waitingForYou: string;
  approve: string;
  reject: string;
  shared: string;
  setup: string;
  stepOf: (n: number, total: number) => string;
  /** PermissionMatrix levels 0–3. */
  permissionLevels: [string, string, string, string];
  memberCount: (n: number) => string;
  invoice: string;
  billTo: string;
  issued: string;
  due: string;
  untitledLine: string;
  vatAt: (rate: string) => string;
  totalDue: string;
  matchedTo: (ref: string) => string;
  matched: string;
  match: string;
  noSuggestion: string;
  accept: string;
  /* Admin: RangeSlider, LiveFeed, MapView, BalanceCard, WebhookEndpoint, BackupList, BlockList, ReviewCard, CouponCard, LocaleField, LocaleSwitcher, ExportDialog, TwoFactorSetup, ColorField */
  minimum: string;
  maximum: string;
  min: string;
  max: string;
  live: string;
  newCount: (n: number) => string;
  resume: string;
  pause: string;
  waitingForEvents: string;
  balanceEmpty: string;
  balanceLow: string;
  balanceOk: string;
  perDay: (amount: string) => string;
  lastsAbout: (days: number) => string;
  warnsBelow: (amount: string) => string;
  topUp: string;
  recentDeliveries: string;
  retry: string;
  download: string;
  restore: string;
  searchBlocked: string;
  block: string;
  nothingBlocked: string;
  until: (when: string) => string;
  permanent: string;
  unblock: string;
  /** ReviewCard states. */
  reviewState: Record<"pending" | "published" | "hidden" | "flagged", string>;
  verifiedPurchase: string;
  yourReply: string;
  writeReply: string;
  reply: string;
  postReply: string;
  publish: string;
  editReply: string;
  usedOf: (used: string, limit: string) => string;
  used: (used: string) => string;
  validUntil: (when: string) => string;
  fromAmount: (amount: string) => string;
  revenue: (amount: string) => string;
  languages: string;
  missing: string;
  doneOf: (done: number, total: number) => string;
  copyFrom: (language: string) => string;
  translate: string;
  languageAndCurrency: string;
  language: string;
  currency: string;
  export: string;
  rowsMatch: (formatted: string, n: number) => string;
  format: string;
  period: string;
  allTime: string;
  exportProgress: string;
  preparingFile: string;
  fileReady: string;
  newExport: string;
  twoFactorSteps: [string, string, string];
  /** TwoFactorSetup: the checkbox under the code field */
  trustDevice: string;
  qrCode: string;
  scanText: string;
  next: string;
  enterCode: string;
  codeFailed: string;
  codesText: string;
  savedCodes: string;
  turnOnTwoFactor: string;
  pickColour: string;
  contrastAgainst: (colour: string) => string;
  contrastAA: string;
  contrastAALarge: string;
  contrastFails: string;
  /* Life: HabitTracker, MoodPicker, VitalTile, ActivityRings, SleepChart, MedicationList, GoalCard, InsightCard, ConsentList */
  habits: string;
  /** "12-day streak" */
  habitStreak: (days: number) => string;
  /** "Mark {habit} done today" */
  markHabitDone: (habit: string) => string;
  habitDone: string;
  habitMissed: string;
  habitNoData: string;
  howAreYou: string;
  /** The five mood words, lowest first. */
  moodLevels: [string, string, string, string, string];
  inRange: string;
  belowRange: string;
  aboveRange: string;
  /** "Normal 60–100" */
  normalRange: (low: string, high: string) => string;
  activity: string;
  /** "6,240 of 8,000 steps" */
  ofGoal: (value: string, goal: string) => string;
  sleepStages: string;
  /** Names of the sleep stages. */
  sleepStageNames: Record<"awake" | "rem" | "light" | "deep", string>;
  /** "7 h 32 min" */
  durationHm: (hours: number, minutes: number) => string;
  /** "Asleep 7 h 32 min" */
  totalSleep: (duration: string) => string;
  medication: string;
  medTaken: string;
  medDue: string;
  medMissed: string;
  medUpcoming: string;
  /** "Mark {name} as taken" */
  markTaken: (name: string) => string;
  /** "By {date}" */
  dueBy: (date: string) => string;
  whyInsight: string;
  insightAccept: string;
  insightSnooze: string;
  dataAccess: string;
  revokeAccess: string;
  /** "Last used {date}" */
  lastUsed: (date: string) => string;
  notUsedYet: string;
  requiredScope: string;
  // @@KEYS
}

/** Strings several components share. */
export const SHARED_STRINGS: Pick<
  UIStrings,
  | "close"
  | "cancel"
  | "send"
  | "copy"
  | "copied"
  | "dismiss"
  | "remove"
  | "removeItem"
  | "search"
  | "edit"
  | "apply"
  | "undo"
  | "thinking"
  | "paused"
  | "status"
  | "preview"
  | "results"
  | "selectPlaceholder"
  | "model"
  | "back"
  | "columns"
  | "selectedCount"
  | "mainNavigation"
  | "lastDays"
  | "unread"
  | "agent"
  | "viewMap"
  | "enabled"
  | "more"
  | "text"
  | "hide"
  | "colName"
  | "net"
  | "total"
  | "role"
  | "all"
  | "next"
> = {
  close: "Close",
  cancel: "Cancel",
  send: "Send",
  copy: "Copy",
  copied: "Copied",
  dismiss: "Dismiss",
  remove: "Remove",
  removeItem: (name) => `Remove ${name}`,
  search: "Search",
  edit: "Edit",
  apply: "Apply",
  undo: "Undo",
  thinking: "Thinking…",
  paused: "Paused",
  status: "Status",
  preview: "Preview",
  results: "Results",
  selectPlaceholder: "Select…",
  model: "Model",
  back: "Back",
  columns: "Columns",
  selectedCount: (n, formatted) => `${formatted ?? n} selected`,
  mainNavigation: "Main",
  lastDays: (n) => `Last ${n} days`,
  unread: "Unread",
  agent: "Agent",
  viewMap: "Map",
  enabled: "Enabled",
  more: "More",
  text: "Text",
  hide: "Hide",
  colName: "Name",
  net: "Net",
  total: "Total",
  role: "Role",
  all: "All",
  next: "Next",
};

/** Strings of the components in `admin.tsx`. */
export const ADMIN_STRINGS: Pick<
  UIStrings,
  | "minimum"
  | "maximum"
  | "min"
  | "max"
  | "live"
  | "newCount"
  | "resume"
  | "pause"
  | "waitingForEvents"
  | "balanceEmpty"
  | "balanceLow"
  | "balanceOk"
  | "perDay"
  | "lastsAbout"
  | "warnsBelow"
  | "topUp"
  | "recentDeliveries"
  | "retry"
  | "download"
  | "restore"
  | "searchBlocked"
  | "block"
  | "nothingBlocked"
  | "until"
  | "permanent"
  | "unblock"
  | "reviewState"
  | "verifiedPurchase"
  | "yourReply"
  | "writeReply"
  | "reply"
  | "postReply"
  | "publish"
  | "editReply"
  | "usedOf"
  | "used"
  | "validUntil"
  | "fromAmount"
  | "revenue"
  | "languages"
  | "missing"
  | "doneOf"
  | "copyFrom"
  | "translate"
  | "languageAndCurrency"
  | "language"
  | "currency"
  | "export"
  | "rowsMatch"
  | "format"
  | "period"
  | "allTime"
  | "exportProgress"
  | "preparingFile"
  | "fileReady"
  | "newExport"
  | "twoFactorSteps"
  | "qrCode"
  | "trustDevice"
  | "scanText"
  | "enterCode"
  | "codeFailed"
  | "codesText"
  | "savedCodes"
  | "turnOnTwoFactor"
  | "pickColour"
  | "contrastAgainst"
  | "contrastAA"
  | "contrastAALarge"
  | "contrastFails"
  | "switchWorkspace"
> = {
  switchWorkspace: "Switch workspace",
  minimum: "Minimum",
  maximum: "Maximum",
  min: "Min",
  max: "Max",
  live: "Live",
  newCount: (n) => `${n} new`,
  resume: "Resume",
  pause: "Pause",
  waitingForEvents: "Waiting for events…",
  balanceEmpty: "Empty",
  balanceLow: "Low",
  balanceOk: "OK",
  perDay: (amount) => `${amount} per day`,
  lastsAbout: (days) => `lasts about ${days} days`,
  warnsBelow: (amount) => `Warns below ${amount}`,
  topUp: "Top up",
  recentDeliveries: "Recent deliveries",
  retry: "Retry",
  download: "Download",
  restore: "Restore",
  searchBlocked: "Search blocked entries",
  block: "Block",
  nothingBlocked: "Nothing blocked.",
  until: (when) => `until ${when}`,
  permanent: "permanent",
  unblock: "Unblock",
  reviewState: {
    pending: "Waiting",
    published: "Published",
    hidden: "Hidden",
    flagged: "Flagged",
  },
  verifiedPurchase: "Verified purchase",
  yourReply: "Your reply",
  writeReply: "Write a public reply",
  reply: "Reply",
  postReply: "Post reply",
  publish: "Publish",
  editReply: "Edit reply",
  usedOf: (used, limit) => `${used} of ${limit} used`,
  used: (used) => `${used} used`,
  validUntil: (when) => `Valid until ${when}`,
  fromAmount: (amount) => `from ${amount}`,
  revenue: (amount) => `${amount} revenue`,
  languages: "Languages",
  missing: "Missing",
  doneOf: (done, total) => `${done} of ${total}`,
  copyFrom: (language) => `Copy from ${language}`,
  translate: "Translate",
  languageAndCurrency: "Language and currency",
  language: "Language",
  currency: "Currency",
  export: "Export",
  rowsMatch: (formatted) => `${formatted} rows match your filters.`,
  format: "Format",
  period: "Period",
  allTime: "All time",
  exportProgress: "Export progress",
  preparingFile: "Preparing the file…",
  fileReady: "Your file is ready.",
  newExport: "New export",
  twoFactorSteps: ["Scan", "Confirm", "Save codes"],
  qrCode: "QR code",
  trustDevice: "Trust this device",
  scanText:
    "Scan the code with your authenticator app. If you can't scan it, enter the key by hand.",
  enterCode: "Enter the 6-digit code from the app.",
  codeFailed: "That code didn't work. Try the current one.",
  codesText: "Each code works once if you lose your phone. Keep them somewhere safe.",
  savedCodes: "I saved the recovery codes",
  turnOnTwoFactor: "Turn on two-factor",
  pickColour: "Pick a colour",
  contrastAgainst: (colour) => `Contrast against ${colour}`,
  contrastAA: "AA",
  contrastAALarge: "AA large",
  contrastFails: "Fails",
};

/** Strings of the components in `agents.tsx`. */
export const AGENTS_STRINGS: Pick<
  UIStrings,
  | "chatWith"
  | "costToday"
  | "lastAction"
  | "searchChats"
  | "noChatsMatch"
  | "nothingFound"
  | "thanksNoted"
  | "good"
  | "notGood"
  | "whatShouldBeDifferent"
  | "needsYou"
  | "suggestions"
  | "budgetUsedUp"
  | "raiseBudget"
  | "budgetText"
  | "spentThisMonth"
  | "stillRunning"
  | "nothing"
  | "searchMemory"
  | "nothingRemembered"
  | "forget"
  | "discardOverride"
  | "moveToCode"
  | "runNow"
  | "listening"
  | "speaking"
  | "unmute"
  | "mute"
  | "endConversation"
> = {
  chatWith: (name) => `Chat with ${name}`,
  costToday: "Cost today",
  lastAction: "Last action",
  searchChats: "Search chats",
  noChatsMatch: "No chats match",
  nothingFound: "Nothing found",
  thanksNoted: "Thanks, noted",
  good: "Good",
  notGood: "Not good",
  whatShouldBeDifferent: "What should be different?",
  needsYou: "Needs you",
  suggestions: "Suggestions",
  budgetUsedUp: "Budget used up · agents paused",
  raiseBudget: "Raise budget",
  budgetText: "Everything is kept. Agents continue where they stopped once the budget allows it.",
  spentThisMonth: "Spent this month",
  stillRunning: "Still running",
  nothing: "Nothing",
  searchMemory: "Search memory",
  nothingRemembered: "Nothing remembered here yet.",
  forget: "Forget",
  discardOverride: "Discard override",
  moveToCode: "Move to code",
  runNow: "Run now",
  listening: "Listening…",
  speaking: "Speaking…",
  unmute: "Unmute",
  mute: "Mute",
  endConversation: "End conversation",
};

/** Strings of the components in `app-chrome.tsx`. */
export const APP_CHROME_STRINGS: Pick<UIStrings, "coreModule"> = {
  coreModule: "Core module, always on",
};

/** Strings of the components in `approvals.tsx`. */
export const APPROVALS_STRINGS: Pick<
  UIStrings,
  | "approveAsShown"
  | "approveWithChange"
  | "whatShouldChange"
  | "discard"
  | "differentInstruction"
  | "whatInstead"
  | "approvalNeeded"
  | "riskFamily"
  | "approvals"
  | "nothingWaiting"
> = {
  approveAsShown: "Yes, run it as shown",
  approveWithChange: "Yes, with a change",
  whatShouldChange: "What should change?",
  discard: "No, discard",
  differentInstruction: "Different instruction",
  whatInstead: "What should happen instead?",
  approvalNeeded: "Approval needed",
  riskFamily: {
    money: "Money",
    infra: "Infrastructure",
    comms: "Communication",
    marketing: "Marketing",
    apps: "Own apps",
    legal: "Legal",
  },
  approvals: "Approvals",
  nothingWaiting: "Nothing waiting for you",
};

/** Strings of the components in `building-blocks.tsx`. */
export const BUILDING_BLOCKS_STRINGS: Pick<UIStrings, "loading" | "resizePanel"> = {
  loading: "Loading",
  resizePanel: (label, n) => `Resize ${label ?? `panel ${n}`}`,
};

/** Strings of the components in `charts.tsx`. */
export const CHARTS_STRINGS: Pick<
  UIStrings,
  | "barChart"
  | "lineChart"
  | "trend"
  | "breakdown"
  | "stackedBarChart"
  | "areaChart"
  | "heatmap"
  | "less"
  | "gaugeValue"
  | "gauge"
> = {
  barChart: "Bar chart",
  lineChart: "Line chart",
  trend: "Trend",
  breakdown: "Breakdown",
  stackedBarChart: "Stacked bar chart",
  areaChart: "Area chart",
  heatmap: "Heatmap",
  less: "Less",
  gaugeValue: (label, value, max) => `${label}: ${value} of ${max}`,
  gauge: "Gauge",
};

/** Strings of the components in `chat.tsx`. */
export const CHAT_STRINGS: Pick<
  UIStrings,
  | "copyCode"
  | "working"
  | "you"
  | "copyReply"
  | "regenerate"
  | "regenerateReply"
  | "goodReply"
  | "badReply"
  | "toolInput"
  | "toolError"
  | "toolResult"
  | "thoughtFor"
  | "commands"
  | "messagePlaceholder"
  | "message"
  | "attachFiles"
  | "composerHint"
  | "stop"
  | "agentStatus"
  | "step"
  | "timeline"
  | "stepRunning"
  | "context"
> = {
  copyCode: "Copy code",
  working: "Working",
  you: "You",
  copyReply: "Copy reply",
  regenerate: "Regenerate",
  regenerateReply: "Regenerate reply",
  goodReply: "Good reply",
  badReply: "Bad reply",
  toolInput: "Input",
  toolError: "Error",
  toolResult: "Result",
  thoughtFor: (d) => `Thought for ${d || "a few seconds"}`,
  commands: "Commands",
  messagePlaceholder: "Message…",
  message: "Message",
  attachFiles: "Attach files",
  composerHint: "Enter to send · Shift+Enter for a new line",
  stop: "Stop",
  agentStatus: {
    Running: "Running",
    Thinking: "Thinking",
    "Waiting for approval": "Waiting for approval",
    Idle: "Idle",
    Paused: "Paused",
    Error: "Error",
  },
  step: "Step",
  timeline: (total) => `Timeline · ${total}`,
  stepRunning: "running…",
  context: "Context",
};

/** Strings of the components in `commerce.tsx`. */
export const COMMERCE_STRINGS: Pick<
  UIStrings,
  | "ratingLabel"
  | "outOfStock"
  | "lowStock"
  | "inStock"
  | "inStockCount"
  | "soldOut"
  | "addToCart"
  | "variantSoldOut"
  | "oneLess"
  | "oneMore"
  | "orderSummary"
  | "freeShippingIn"
  | "invalidCode"
  | "discountCode"
  | "subtotal"
  | "discount"
  | "shipping"
  | "free"
  | "inclVat"
  | "checkoutSteps"
  | "checkoutProgress"
  | "orderStatus"
  | "mostPopular"
  | "letsTalk"
  | "perSeatMonth"
  | "currentPlan"
  | "choosePlan"
> = {
  ratingLabel: (value, count) => `${value} out of 5` + (count != null ? `, ${count} reviews` : ""),
  outOfStock: "Out of stock",
  lowStock: (left) => `Low stock · ${left} left`,
  inStock: "In stock",
  inStockCount: (n) => `In stock · ${n}`,
  soldOut: "Sold out",
  addToCart: (name) => `Add ${name} to cart`,
  variantSoldOut: (variant) => `${variant} (sold out)`,
  oneLess: "One less",
  oneMore: "One more",
  orderSummary: "Order summary",
  freeShippingIn: (amount) => createElement(Fragment, null, "Add ", amount, " for free shipping"),
  invalidCode: "That code isn’t valid",
  discountCode: "Discount code",
  subtotal: "Subtotal",
  discount: "Discount",
  shipping: "Shipping",
  free: "Free",
  inclVat: (rate) => `incl. ${rate} VAT`,
  checkoutSteps: ["Cart", "Details", "Shipping", "Payment"],
  checkoutProgress: "Checkout progress",
  orderStatus: {
    Placed: "Placed",
    Paid: "Paid",
    Packed: "Packed",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Refunded: "Refunded",
    Cancelled: "Cancelled",
  },
  mostPopular: "Most popular",
  letsTalk: "Let’s talk",
  perSeatMonth: "per seat / month",
  currentPlan: "Current plan",
  choosePlan: (name) => `Choose ${name}`,
};

/** Strings of the components in `data-display.tsx`. */
export const DATA_DISPLAY_STRINGS: Pick<
  UIStrings,
  "open" | "downloadItem" | "columnOptions" | "addCard" | "progress"
> = {
  open: "Open",
  downloadItem: (name) => `Download ${name}`,
  columnOptions: "Column options",
  addCard: "Add card",
  progress: "Progress",
};

/** Strings of the components in `data-table.tsx`. */
export const DATA_TABLE_STRINGS: Pick<
  UIStrings,
  | "removeFilter"
  | "addFilter"
  | "clearAll"
  | "chooseColumns"
  | "selectAllRows"
  | "expand"
  | "nothingMatchesFilters"
  | "selectRow"
  | "collapseRow"
  | "expandRow"
  | "bulkActions"
  | "clear"
> = {
  removeFilter: (filter) => `Remove filter ${filter}`,
  addFilter: "Filter",
  clearAll: "Clear all",
  chooseColumns: "Choose columns",
  selectAllRows: "Select all rows",
  expand: "Expand",
  nothingMatchesFilters: "Nothing matches these filters.",
  selectRow: "Select row",
  collapseRow: "Collapse row",
  expandRow: "Expand row",
  bulkActions: "Bulk actions",
  clear: "Clear",
};

/** Strings of the components in `developer.tsx`. */
export const DEVELOPER_STRINGS: Pick<
  UIStrings,
  "reveal" | "rotate" | "vatRate" | "gross" | "keyboardShortcuts" | "daysAgo"
> = {
  reveal: "Reveal",
  rotate: "Rotate",
  vatRate: "VAT rate",
  gross: (amount) => `Gross ${amount}`,
  keyboardShortcuts: "Keyboard shortcuts",
  daysAgo: (n) => `${n} days ago`,
};

/** Strings of the components in `feedback.tsx`. */
export const FEEDBACK_STRINGS: Pick<UIStrings, "typeToConfirm" | "confirm"> = {
  typeToConfirm: (text) => createElement(Fragment, null, "Type ", text, " to confirm"),
  confirm: "Confirm",
};

/** Strings of the components in `form.tsx`. */
export const FORM_STRINGS: Pick<
  UIStrings,
  | "fieldRequired"
  | "invalidEmail"
  | "minLength"
  | "maxLength"
  | "minValue"
  | "maxValue"
  | "invalidFormat"
> = {
  fieldRequired: "This field is required",
  invalidEmail: "Enter a valid email address",
  minLength: (n) => `Use at least ${n} characters`,
  maxLength: (n) => `Use at most ${n} characters`,
  minValue: (n) => `Use ${n} or more`,
  maxValue: (n) => `Use ${n} or less`,
  invalidFormat: "Use the expected format",
};

/** Strings of the components in `forms.tsx`. */
export const FORMS_STRINGS: Pick<
  UIStrings,
  | "noMatches"
  | "createOption"
  | "tagPlaceholder"
  | "previousMonth"
  | "nextMonth"
  | "thisYear"
  | "pickRange"
  | "pickDate"
  | "decrease"
  | "increase"
  | "verificationCode"
  | "digitN"
  | "dropToUpload"
  | "dropFiles"
  | "dropHint"
  | "uploaded"
  | "cancelUpload"
  | "showPassword"
  | "hidePassword"
> = {
  noMatches: "No matches",
  showPassword: "Show password",
  hidePassword: "Hide password",
  createOption: (text) => `Create “${text}”`,
  tagPlaceholder: "Type and press Enter",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  thisYear: "This year",
  pickRange: "Pick a range",
  pickDate: "Pick a date",
  decrease: "Decrease",
  increase: "Increase",
  verificationCode: "Verification code",
  digitN: (n) => `Digit ${n}`,
  dropToUpload: "Drop to upload",
  dropFiles: "Drop files here or browse",
  dropHint: "PDF, PNG or JPG up to 10 MB",
  uploaded: (size) => `${size} · uploaded`,
  cancelUpload: "Cancel upload",
};

/** Strings of the components in `mail.tsx`. */
export const MAIL_STRINGS: Pick<
  UIStrings,
  "allInboxes" | "addressCount" | "findAddress" | "company" | "phone" | "website"
> = {
  allInboxes: "All inboxes",
  addressCount: (n) => `${n} addresses`,
  findAddress: "Find an address",
  company: "Company",
  phone: "Phone",
  website: "Website",
};

/** Strings of the components in `media.tsx`. */
export const MEDIA_STRINGS: Pick<
  UIStrings,
  | "variants"
  | "previousImage"
  | "nextImage"
  | "fullScreen"
  | "images"
  | "imageN"
  | "before"
  | "after"
  | "compareBeforeAfter"
> = {
  variants: "Variants",
  previousImage: "Previous image",
  nextImage: "Next image",
  fullScreen: "Full screen",
  images: "Images",
  imageN: (n) => `Image ${n}`,
  before: "Before",
  after: "After",
  compareBeforeAfter: "Compare before and after",
};

/** Strings of the components in `navigation.tsx`. */
export const NAVIGATION_STRINGS: Pick<
  UIStrings,
  | "breadcrumb"
  | "pagination"
  | "previousPage"
  | "nextPage"
  | "sidebar"
  | "filters"
  | "expandSidebar"
  | "collapseSidebar"
  | "openNavigation"
  | "closeNavigation"
  | "moreActionsFor"
  | "opensInNewTab"
  | "newActivity"
  | "account"
> = {
  breadcrumb: "Breadcrumb",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  sidebar: "Sidebar",
  filters: "Filters",
  expandSidebar: "Expand sidebar",
  collapseSidebar: "Collapse sidebar",
  openNavigation: "Open navigation",
  closeNavigation: "Close navigation",
  moreActionsFor: (label) => `More actions for ${label}`,
  opensInNewTab: "(opens in a new tab)",
  newActivity: "New activity",
  account: "Account",
};

/** Strings of the components in `operations.tsx`. */
export const OPERATIONS_STRINGS: Pick<
  UIStrings,
  | "offline"
  | "connectionLost"
  | "retryNow"
  | "unknown"
  | "deployPipeline"
  | "colType"
  | "colContent"
  | "colProxy"
  | "proxied"
  | "dnsOnly"
  | "actions"
  | "expires"
  | "daysCount"
  | "domain"
  | "colDate"
  | "colRef"
  | "colDescription"
  | "suggestedBy"
  | "colCategory"
  | "colProject"
  | "vat"
  | "grossLabel"
  | "notAReceipt"
  | "bookIt"
> = {
  offline: "Offline. Changes are kept and sent when you’re back.",
  connectionLost: (s) => `Connection lost. Retrying in ${s != null ? s : "…"} s`,
  retryNow: "Retry now",
  unknown: "Unknown",
  deployPipeline: "Deploy pipeline",
  colType: "Type",
  colContent: "Content",
  colProxy: "Proxy",
  proxied: "Proxied",
  dnsOnly: "DNS only",
  actions: "Actions",
  expires: "Expires",
  daysCount: (n) => `${n} days`,
  domain: "Domain",
  colDate: "Date",
  colRef: "Ref.",
  colDescription: "Description",
  suggestedBy: (who) => `Suggested by ${who}`,
  colCategory: "Category",
  colProject: "Project",
  vat: "VAT",
  grossLabel: "Gross",
  notAReceipt: "Not a receipt",
  bookIt: "Book it",
};

/** Strings of the components in `previews.tsx`. */
export const PREVIEWS_STRINGS: Pick<
  UIStrings,
  | "noSubject"
  | "device"
  | "desktop"
  | "mobile"
  | "emailPreview"
  | "adTooLong"
  | "sponsored"
  | "yourHeadline"
  | "yourDescription"
> = {
  noSubject: "(No subject)",
  device: "Device",
  desktop: "Desktop",
  mobile: "Mobile",
  emailPreview: "Email preview",
  adTooLong: (field, n, length, limit) =>
    `${field === "headlines" ? "Headline" : field === "descriptions" ? "Description" : "Path"} ${n} is ${length} characters, the limit is ${limit}`,
  sponsored: "Sponsored",
  yourHeadline: "Your headline",
  yourDescription: "Your description",
};

/** Strings of the components in `primitives.tsx`. */
export const PRIMITIVES_STRINGS: Pick<
  UIStrings,
  "slide" | "slideOf" | "previousSlide" | "goToSlide" | "nextSlide"
> = {
  slide: "slide",
  slideOf: (n, total) => `${n} of ${total}`,
  previousSlide: "Previous slide",
  goToSlide: (n) => `Go to slide ${n}`,
  nextSlide: "Next slide",
};

/** Strings of the components in `real-estate.tsx`. */
export const REAL_ESTATE_STRINGS: Pick<
  UIStrings,
  | "rooms"
  | "priceOnRequest"
  | "perMonth"
  | "isNew"
  | "select"
  | "removeFromSaved"
  | "save"
  | "privateSeller"
  | "phoneAvailable"
  | "deselectAll"
  | "selectAll"
  | "foundCount"
  | "workingEllipsis"
  | "sort"
  | "view"
  | "viewGrid"
  | "viewList"
  | "checkedAt"
  | "showResults"
  | "highConfidence"
  | "mediumConfidence"
  | "lowConfidence"
  | "estimatedValue"
  | "range"
  | "askingPrice"
  | "energyClass"
> = {
  rooms: (rooms) => `${rooms} rooms`,
  priceOnRequest: "Price on request",
  perMonth: "/ month",
  isNew: "New",
  select: "Select",
  removeFromSaved: "Remove from saved",
  save: "Save",
  privateSeller: "Private seller",
  phoneAvailable: "Phone number available",
  deselectAll: "Deselect all",
  selectAll: "Select all",
  foundCount: (_, formatted) => `${formatted} found`,
  workingEllipsis: "Working…",
  sort: "Sort",
  view: "View",
  viewGrid: "Grid",
  viewList: "List",
  checkedAt: (when) => `Checked ${when}`,
  showResults: "Show results",
  highConfidence: "High confidence",
  mediumConfidence: "Medium confidence",
  lowConfidence: "Low confidence",
  estimatedValue: "Estimated value",
  range: (low, high) => `Range ${low} to ${high}`,
  askingPrice: "Asking price",
  energyClass: (value) => `Energy class ${value}`,
};

/** Strings of the components in `rich-text-editor.tsx`. */
export const RICH_TEXT_EDITOR_STRINGS: Pick<
  UIStrings,
  | "bold"
  | "italic"
  | "underline"
  | "heading"
  | "quote"
  | "bulletedList"
  | "numberedList"
  | "link"
  | "redo"
  | "formatting"
  | "linkAddress"
  | "removeLink"
  | "insertField"
> = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  heading: "Heading",
  quote: "Quote",
  bulletedList: "Bulleted list",
  numberedList: "Numbered list",
  link: "Link",
  redo: "Redo",
  formatting: "Formatting",
  linkAddress: "Link address",
  removeLink: "Remove link",
  insertField: "Insert field",
};

/** Strings of the components in `select-menu.tsx`. */
export const SELECT_MENU_STRINGS: Pick<UIStrings, "options"> = {
  options: "Options",
};

/** Strings of the components in `shell.tsx`. */
export const SHELL_STRINGS: Pick<
  UIStrings,
  "tools" | "quickActions" | "expandRail" | "collapseRail" | "expandPanel" | "collapsePanel"
> = {
  tools: "Tools",
  quickActions: "Quick actions",
  expandRail: "Show names",
  collapseRail: "Icons only",
  expandPanel: "Expand panel",
  collapsePanel: "Collapse panel",
};

/** Strings of the components in `site.tsx`. */
export const SITE_STRINGS: Pick<
  UIStrings,
  | "assistant"
  | "closeAssistant"
  | "openAssistant"
  | "privacySettings"
  | "cookieText"
  | "alwaysOn"
  | "saveChoice"
  | "settings"
  | "onlyNecessary"
  | "acceptAll"
> = {
  assistant: "Assistant",
  closeAssistant: "Close assistant",
  openAssistant: "Open assistant",
  privacySettings: "Privacy settings",
  cookieText: "We use cookies to run this site and, with your consent, to measure and improve it.",
  alwaysOn: "Always on",
  saveChoice: "Save choice",
  settings: "Settings",
  onlyNecessary: "Only necessary",
  acceptAll: "Accept all",
};

/** Strings of the components in `workspace.tsx`. */
export const WORKSPACE_STRINGS: Pick<
  UIStrings,
  | "sectionPages"
  | "commandPalette"
  | "paletteSearchPlaceholder"
  | "escKey"
  | "searching"
  | "nothingMatches"
  | "paletteMove"
  | "paletteOpen"
  | "paletteAnywhere"
  | "notifications"
  | "markAllRead"
  | "allCaughtUp"
  | "flowStep"
  | "flowRunning"
  | "waitingForYou"
  | "approve"
  | "reject"
  | "shared"
  | "setup"
  | "stepOf"
  | "permissionLevels"
  | "memberCount"
  | "invoice"
  | "billTo"
  | "issued"
  | "due"
  | "untitledLine"
  | "vatAt"
  | "totalDue"
  | "matchedTo"
  | "matched"
  | "match"
  | "noSuggestion"
  | "accept"
> = {
  sectionPages: (section) => `${section || "Section"} pages`,
  commandPalette: "Command palette",
  paletteSearchPlaceholder: "Search pages, actions and records…",
  escKey: "Esc",
  searching: "Searching…",
  nothingMatches: (query) => `Nothing matches “${query}”.`,
  paletteMove: "move",
  paletteOpen: "open",
  paletteAnywhere: "anywhere",
  notifications: "Notifications",
  markAllRead: "Mark all read",
  allCaughtUp: "You are all caught up",
  flowStep: {
    trigger: "When",
    condition: "If",
    agent: "Agent",
    approval: "Approval",
    action: "Then",
  },
  flowRunning: "running",
  waitingForYou: "waiting for you",
  approve: "Approve",
  reject: "Reject",
  shared: "Shared",
  setup: "Setup",
  stepOf: (n, total) => `Step ${n} of ${total}`,
  permissionLevels: ["None", "View", "Edit", "Full"],
  memberCount: (n) => (n === 1 ? "1 member" : `${n} members`),
  invoice: "Invoice",
  billTo: "Bill to",
  issued: "Issued",
  due: "Due",
  untitledLine: "Untitled line",
  vatAt: (rate) => `VAT ${rate}`,
  totalDue: "Total due",
  matchedTo: (ref) => `matched to ${ref}`,
  matched: "Matched",
  match: "Match",
  noSuggestion: "No suggestion yet.",
  accept: "Accept",
};

/** Strings of the components in `life.tsx`. */
export const LIFE_STRINGS: Pick<
  UIStrings,
  | "habits"
  | "habitStreak"
  | "markHabitDone"
  | "habitDone"
  | "habitMissed"
  | "habitNoData"
  | "howAreYou"
  | "moodLevels"
  | "inRange"
  | "belowRange"
  | "aboveRange"
  | "normalRange"
  | "activity"
  | "ofGoal"
  | "sleepStages"
  | "sleepStageNames"
  | "durationHm"
  | "totalSleep"
  | "medication"
  | "medTaken"
  | "medDue"
  | "medMissed"
  | "medUpcoming"
  | "markTaken"
  | "dueBy"
  | "whyInsight"
  | "insightAccept"
  | "insightSnooze"
  | "dataAccess"
  | "revokeAccess"
  | "lastUsed"
  | "notUsedYet"
  | "requiredScope"
> = {
  habits: "Habits",
  habitStreak: (days) => `${days}-day streak`,
  markHabitDone: (habit) => `Mark ${habit} done today`,
  habitDone: "Done",
  habitMissed: "Missed",
  habitNoData: "No entry",
  howAreYou: "How are you feeling?",
  moodLevels: ["Awful", "Low", "Okay", "Good", "Great"],
  inRange: "In range",
  belowRange: "Below range",
  aboveRange: "Above range",
  normalRange: (low, high) => `Normal ${low}–${high}`,
  activity: "Activity",
  ofGoal: (value, goal) => `${value} of ${goal}`,
  sleepStages: "Sleep stages",
  sleepStageNames: { awake: "Awake", rem: "REM", light: "Light", deep: "Deep" },
  durationHm: (hours, minutes) =>
    hours ? (minutes ? `${hours} h ${minutes} min` : `${hours} h`) : `${minutes} min`,
  totalSleep: (duration) => `Asleep ${duration}`,
  medication: "Medication",
  medTaken: "Taken",
  medDue: "Due",
  medMissed: "Missed",
  medUpcoming: "Later",
  markTaken: (name) => `Mark ${name} as taken`,
  dueBy: (date) => `By ${date}`,
  whyInsight: "Why am I seeing this?",
  insightAccept: "Do it",
  insightSnooze: "Later",
  dataAccess: "Data access",
  revokeAccess: "Revoke access",
  lastUsed: (date) => `Last used ${date}`,
  notUsedYet: "Not used yet",
  requiredScope: "Required",
};

/** The English defaults: every group together. */
export const DEFAULT_STRINGS: UIStrings = /* @__PURE__ */ Object.assign(
  {},
  SHARED_STRINGS,
  ADMIN_STRINGS,
  AGENTS_STRINGS,
  APP_CHROME_STRINGS,
  APPROVALS_STRINGS,
  BUILDING_BLOCKS_STRINGS,
  CHARTS_STRINGS,
  CHAT_STRINGS,
  COMMERCE_STRINGS,
  DATA_DISPLAY_STRINGS,
  DATA_TABLE_STRINGS,
  DEVELOPER_STRINGS,
  FEEDBACK_STRINGS,
  FORM_STRINGS,
  FORMS_STRINGS,
  LIFE_STRINGS,
  MAIL_STRINGS,
  MEDIA_STRINGS,
  NAVIGATION_STRINGS,
  OPERATIONS_STRINGS,
  PREVIEWS_STRINGS,
  PRIMITIVES_STRINGS,
  REAL_ESTATE_STRINGS,
  RICH_TEXT_EDITOR_STRINGS,
  SELECT_MENU_STRINGS,
  SHELL_STRINGS,
  SITE_STRINGS,
  WORKSPACE_STRINGS,
);

/**
 * A partial set of strings for `UIProvider messages`. Groups (such as `agentStatus`) can be
 * partial too: what is left out keeps its value.
 */
export type UIMessages = {
  [K in keyof UIStrings]?: UIStrings[K] extends (...args: never[]) => unknown
    ? UIStrings[K]
    : UIStrings[K] extends object
      ? Partial<UIStrings[K]>
      : UIStrings[K];
};

const isGroup = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** `base` with `messages` applied; groups (such as `agentStatus`) are merged one level deep. */
export function mergeStrings(base: UIStrings, messages: UIMessages): UIStrings {
  return mergeMessages(base, messages) as UIStrings;
}

/** Two partial sets merged, the second on top (what nested `UIProvider`s do). */
export function mergeMessages(base: UIMessages, messages: UIMessages): UIMessages {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(messages)) {
    if (v === undefined || v === null) continue;
    const prev = out[k];
    out[k] = isGroup(prev) && isGroup(v) ? { ...prev, ...v } : v;
  }
  return out as UIMessages;
}
