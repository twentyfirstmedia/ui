/**
 * Builds the icon library (packages/core/src/icon-library.ts) from two open sets, in the kit's
 * style:
 *
 * - line icons from Lucide (ISC): 24px grid, 2px round-capped strokes, `currentColor`, the same
 *   drawing rules as the kit's own set. Circles, rectangles, lines and polygons become one path.
 * - brand logos from Simple Icons (CC0): filled, scaled to the optical size of the line icons.
 * - a few brand logos Simple Icons may not carry (LinkedIn, Microsoft, Slack …) from Font Awesome
 *   Free (CC BY 4.0), fitted the same way.
 *
 * Every drawing is centred on the 24px grid (as the kit's own icons are). Names are camelCase;
 * brands start with `brand`. The kit's own 93 icons (packages/core/src/icons.ts) stay as they are
 * and are only listed here for the categories.
 *
 *   node scripts/icons.ts          write
 *   node scripts/icons.ts --check  exit 1 when out of date (also covered by scripts/icons.test.ts)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { svgPathBbox } from "svg-path-bbox";
import svgpath from "svgpath";
import { ICON_PATHS } from "../packages/core/src/icons.ts";
import { ROOT } from "./tokens.ts";

const require = createRequire(import.meta.url);
const OUT = join(ROOT, "packages", "core", "src", "icon-library.ts");

/**
 * Categories in gallery order. An entry is a kit icon name, a Lucide name (camelCased for the
 * kit), or `kitName=lucide-name` to rename. Brands come from Simple Icons, below.
 */
const CATEGORIES: Record<string, string[]> = {
  Actions: [
    "plus",
    "minus",
    "check",
    "x",
    "more",
    "edit",
    "trash",
    "copy",
    "download",
    "upload",
    "share",
    "reply",
    "refresh",
    "undo",
    "redo",
    "swap",
    "filter",
    "search",
    "expand",
    "eye",
    "logout",
    "link",
    "paperclip",
    "pencil",
    "save",
    "eye-off",
    "log-in",
    "maximize-2",
    "minimize-2",
    "zoom-in",
    "zoom-out",
    "share-2",
    "link-2",
    "unlink",
    "external-link",
    "rotate-ccw",
    "rotate-cw",
    "repeat",
    "shuffle",
    "list-filter",
    "arrow-up-down",
    "arrow-down-wide-narrow",
    "arrow-up-narrow-wide",
    "check-check",
    "circle-plus",
    "circle-minus",
    "circle-check",
    "circle-x",
    "archive-restore=archive-arrow-up",
    "clipboard-copy",
    "clipboard-paste",
    "scissors",
    "pushpin=pin",
    "pin-off",
    "bookmark",
    "bookmark-check",
    "bookmark-plus",
    "ellipsis-vertical",
    "grip-vertical",
    "grip-horizontal",
    "mouse-pointer-click",
    "pointer",
    "hand",
    "move",
    "power",
    "scan-search",
  ],
  "Navigation and layout": [
    "arrowUp",
    "arrowUpRight",
    "chevronDown",
    "chevronLeft",
    "chevronRight",
    "menu",
    "home",
    "grid",
    "list",
    "layers",
    "settings",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "arrow-down-left",
    "arrow-down-right",
    "arrow-up-left",
    "arrow-left-right",
    "arrow-down-to-line",
    "arrow-up-from-line",
    "chevron-up",
    "chevrons-up-down",
    "chevrons-left",
    "chevrons-right",
    "chevrons-up",
    "chevrons-down",
    "corner-down-left",
    "corner-up-right",
    "move-horizontal",
    "move-vertical",
    "panel-left",
    "panel-right",
    "panel-bottom",
    "panel-top",
    "layout-dashboard",
    "layout-grid",
    "layout-list",
    "layout-template",
    "columns-2",
    "rows-2",
    "square-kanban",
    "app-window",
    "sidebar=panel-left-open",
    "compass",
    "navigation",
    "settings-2",
    "sliders-horizontal",
    "sliders-vertical",
    "toggle-left",
    "toggle-right",
    "panel-left-close",
    "arrow-down-up",
    "arrow-right-left",
    "chevrons-down-up",
    "grid-3x3",
    "square-split-horizontal",
  ],
  "Status and alerts": [
    "help",
    "flag",
    "ban",
    "star",
    "info",
    "alert-circle=circle-exclamation-point",
    "alert-triangle=triangle-exclamation-point",
    "alert-octagon=octagon-exclamation-point",
    "badge-check",
    "badge-alert=badge-exclamation-point",
    "badge-info",
    "circle-dot",
    "circle",
    "square",
    "square-check",
    "square-x",
    "loader",
    "loader-circle",
    "hourglass",
    "bell-off",
    "bell-ring",
    "bell-dot",
    "list-checks",
    "list-todo",
    "star-half",
    "flag-triangle-right",
    "siren",
    "circle-check-big",
    "octagon-x",
    "circle-slash",
    "star-off",
    "dot",
    "life-buoy",
  ],
  "Security and identity": [
    "user",
    "users",
    "lock",
    "key",
    "shield",
    "cookie",
    "fingerprint=fingerprint-pattern",
    "scan-face",
    "key-round",
    "lock-open",
    "lock-keyhole",
    "shield-check",
    "shield-alert=shield-exclamation-point",
    "shield-off",
    "shield-user",
    "shield-keyhole",
    "user-check",
    "user-x",
    "user-plus",
    "user-minus",
    "user-round",
    "user-cog",
    "user-lock",
    "user-key",
    "users-round",
    "id-card",
    "contact",
    "scan-eye",
    "scan",
    "scan-line",
    "qr-code",
    "scan-qr-code",
    "smartphone-nfc",
    "vault",
    "file-lock",
    "venetian-mask",
    "circle-user",
    "shield-question-mark",
  ],
  Communication: [
    "mail",
    "inbox",
    "send",
    "bell",
    "phone",
    "heart",
    "thumbUp",
    "thumbDown",
    "message-circle",
    "message-square",
    "messages-square",
    "message-circle-more",
    "message-square-text",
    "mail-open",
    "mail-check",
    "mail-plus",
    "send-horizontal",
    "at-sign",
    "phone-call",
    "phone-incoming",
    "phone-outgoing",
    "phone-missed",
    "voicemail",
    "video",
    "video-off",
    "mic",
    "mic-off",
    "headphones",
    "headset",
    "megaphone",
    "speech",
    "rss",
    "hash",
    "book-user",
    "smile=face-slightly-smiling",
    "frown=face-slightly-frowning",
    "meh=face-neutral",
    "laugh=face-grinning",
    "smile-plus=face-slightly-smiling-plus",
    "angry=face-angry",
    "languages",
    "heart-handshake",
    "message-square-plus",
    "message-square-off",
    "message-square-dashed",
    "mail-minus",
    "forward",
    "reply-all",
    "phone-off",
  ],
  "Files and documents": [
    "file",
    "folder",
    "archive",
    "book",
    "file-text",
    "file-plus",
    "file-minus",
    "file-check",
    "file-x",
    "file-search",
    "file-code",
    "file-image",
    "file-video-camera",
    "file-music",
    "file-spreadsheet",
    "file-archive",
    "file-down",
    "file-up",
    "file-pen-line",
    "files",
    "folder-open",
    "folder-plus",
    "folder-tree",
    "folder-lock",
    "clipboard",
    "clipboard-check",
    "clipboard-list",
    "notebook",
    "notebook-pen",
    "book-open",
    "library",
    "scroll-text",
    "newspaper",
    "sticky-note",
    "printer",
    "hard-drive",
    "cloud",
    "cloud-upload",
    "cloud-download",
    "cloud-off",
    "signature",
    "file-badge",
    "folder-input",
    "folder-kanban",
    "folder-cog",
    "file-question-mark",
    "book-check",
  ],
  "Editing and text": [
    "bold",
    "italic",
    "underline",
    "olist",
    "heading",
    "quote",
    "pen-tool",
    "pen-line",
    "eraser",
    "highlighter",
    "type",
    "text-cursor-input",
    "a-large-small",
    "strikethrough",
    "text-align-start",
    "text-align-center",
    "text-align-end",
    "text-align-justify",
    "list-indent-increase",
    "list-indent-decrease",
    "heading-1",
    "heading-2",
    "heading-3",
    "pilcrow",
    "code-xml",
    "braces",
    "brackets",
    "wand-sparkles",
    "crop",
    "palette",
    "pipette",
    "paintbrush",
    "brush",
    "spell-check",
    "case-sensitive",
    "table",
    "table-2",
    "sigma",
    "text-quote",
    "baseline",
    "image-plus",
    "letter-b",
    "diamond",
    "shapes",
  ],
  Media: [
    "image",
    "play",
    "pause",
    "images",
    "camera",
    "camera-off",
    "film",
    "clapperboard",
    "music=eighth-notes",
    "music-note=eighth-note",
    "disc-3",
    "volume",
    "volume-1",
    "volume-2",
    "volume-x",
    "circle-play",
    "circle-pause",
    "circle-stop",
    "skip-back",
    "skip-forward",
    "rewind",
    "fast-forward",
    "mic-vocal",
    "radio",
    "tv",
    "cast",
    "airplay",
    "aperture",
    "focus",
    "gallery-horizontal",
    "captions",
    "audio-lines",
    "list-music",
    "image-off",
    "image-up",
    "image-down",
  ],
  "Devices and connectivity": [
    "monitor",
    "laptop",
    "smartphone",
    "tablet",
    "watch",
    "keyboard",
    "mouse",
    "wifi",
    "wifi-off",
    "bluetooth",
    "battery",
    "battery-charging",
    "battery-low",
    "battery-full",
    "plug",
    "usb",
    "cable",
    "router",
    "memory-stick",
    "gamepad-2",
    "monitor-smartphone",
    "satellite-dish",
    "signal",
    "antenna",
    "nfc",
    "power-off",
    "printer-check",
    "speaker",
    "webcam",
    "monitor-speaker",
    "plug-2",
    "radar",
    "vibrate",
    "refresh-cw-off",
  ],
  "Development and AI": [
    "code",
    "branch",
    "terminal",
    "server",
    "cpu",
    "webhook",
    "bot",
    "sparkle",
    "zap",
    "database",
    "bug",
    "git-pull-request",
    "git-commit-horizontal",
    "git-merge",
    "git-fork",
    "git-compare",
    "puzzle",
    "activity",
    "gauge",
    "network",
    "workflow",
    "blocks",
    "box",
    "boxes",
    "container",
    "cloud-cog",
    "variable",
    "square-function",
    "regex",
    "test-tube",
    "flask-conical",
    "atom",
    "brain",
    "brain-circuit",
    "sparkles",
    "bot-message-square",
    "binary",
    "file-braces",
    "square-terminal",
    "plug-zap",
    "rocket",
    "database-zap",
    "brain-cog",
    "circuit-board",
    "scan-text",
    "text-search",
    "message-square-code",
    "infinity",
    "orbit",
    "telescope",
    "git-graph",
    "bot-off",
    "square-dashed-mouse-pointer",
    "mouse-pointer-2",
  ],
  "Charts and data": [
    "chart",
    "trend",
    "trend-down=trending-down",
    "chart-pie",
    "chart-line",
    "chart-column",
    "chart-bar",
    "chart-area",
    "chart-candlestick",
    "chart-scatter",
    "chart-no-axes-column",
    "chart-spline",
    "presentation",
    "target",
    "percent",
    "kanban",
    "table-properties",
    "sheet",
    "chart-no-axes-column-increasing",
  ],
  "Time and calendar": [
    "calendar",
    "clock",
    "calendar-days",
    "calendar-check",
    "calendar-plus",
    "calendar-x",
    "calendar-clock",
    "calendar-range",
    "calendar-heart",
    "alarm-clock",
    "timer",
    "timer-reset",
    "history=rotate-ccw-clock",
    "sunrise",
    "sunset",
    "clock-alert=clock-exclamation-point",
    "clock-check",
  ],
  "Commerce and finance": [
    "cart",
    "tag",
    "package",
    "truck",
    "card",
    "wallet",
    "shopping-bag",
    "shopping-basket",
    "store",
    "receipt",
    "receipt-text",
    "badge-percent",
    "ticket",
    "gift",
    "coins",
    "banknote",
    "piggy-bank",
    "landmark",
    "hand-coins",
    "euro",
    "dollar-sign",
    "pound-sterling",
    "swiss-franc",
    "bitcoin",
    "calculator",
    "scale",
    "handshake",
    "briefcase",
    "building",
    "buildings=building-complex",
    "factory",
    "warehouse",
    "barcode",
    "scan-barcode",
    "package-check",
    "package-open",
    "award",
    "trophy",
    "medal",
    "crown",
    "gem",
    "circle-dollar-sign",
    "tags",
    "package-search",
    "gavel",
  ],
  "Places and travel": [
    "map",
    "pin",
    "globe",
    "map-pin",
    "map-pinned",
    "locate",
    "locate-fixed",
    "route",
    "signpost",
    "plane",
    "plane-takeoff",
    "train-front",
    "bus",
    "car",
    "bike",
    "ship",
    "fuel",
    "hotel",
    "tent",
    "mountain",
    "trees",
    "tree-pine",
    "earth",
    "luggage",
    "utensils",
    "coffee",
    "wine",
    "beer",
    "map-plus",
    "milestone",
    "car-taxi-front",
    "ev-charger",
    "car-front",
    "plane-landing",
    "circle-gauge",
    "pizza",
  ],
  "Home and real estate": [
    "bed",
    "ruler",
    "house-plus",
    "door-open",
    "door-closed",
    "sofa",
    "bath",
    "shower-head",
    "lamp",
    "lightbulb",
    "armchair",
    "bed-double",
    "bed-single",
    "fence",
    "hammer",
    "wrench",
    "drill",
    "paint-roller",
    "construction",
    "thermometer",
    "heater",
    "air-vent",
    "solar-panel",
    "flame",
    "droplet",
    "snowflake",
    "wind",
    "leaf",
    "sprout",
    "recycle",
    "blinds",
    "lamp-desk",
    "washing-machine",
    "refrigerator",
    "microwave",
    "key-square",
    "ruler-dimension-line",
    "thermometer-snowflake",
    "fan",
    "lamp-ceiling",
    "house-wifi",
    "house-plug",
    "cctv",
    "alarm-smoke",
  ],
  "Weather and nature": [
    "sun",
    "moon",
    "cloud-sun",
    "cloud-rain",
    "cloud-snow",
    "cloud-lightning",
    "cloud-fog",
    "umbrella",
    "rainbow",
    "moon-star",
    "flower",
    "flower-2",
    "paw-print",
    "dog",
    "cat",
    "bird",
    "fish",
    "feather",
    "sun-moon",
    "tornado",
    "waves=waves-horizontal",
    "earth-lock",
    "rabbit",
    "sun-snow",
    "droplets",
  ],
  "Health and people": [
    "heart-pulse",
    "stethoscope",
    "pill",
    "syringe",
    "hospital",
    "cross",
    "accessibility",
    "baby",
    "person-standing",
    "footprints",
    "dumbbell",
    "apple",
    "hand-heart",
    "hand-helping",
    "graduation-cap",
    "school",
    "glasses",
    "shirt",
    "cake",
    "party-popper",
    "bandage",
    "thermometer-sun",
    "weight",
    "salad",
  ],
  "Maps and 3D": [
    "drafting-compass",
    "crosshair",
    "satellite",
    "rotate-3d",
    "axis-3d",
    "move-3d",
    "scale-3d",
    "frame",
    "spline",
    "square-dashed",
    "lasso",
    "layers-2",
    "magnet",
  ],
  Games: [
    "swords",
    "sword",
    "castle",
    "pickaxe",
    "axe",
    "dices",
    "dice-5",
    "skull",
    "ghost",
    "joystick",
    "bomb",
    "heart-crack",
    "shield-half",
    "chess-king",
    "chess-queen",
    "chess-rook",
    "chess-bishop",
    "chess-knight",
    "chess-pawn",
  ],
};

/** Extra search words where Lucide's tags miss what people type. */
const EXTRA_KEYWORDS: Record<string, string> = {
  fingerprint: "passkey touch id webauthn sign in",
  scanFace: "passkey face id webauthn sign in",
  keyRound: "passkey",
  smartphoneNfc: "passkey security key",
  shieldCheck: "verified secure",
  share2: "social",
  brandX: "twitter",
  brandFacebook: "meta",
  brandInstagram: "meta",
  atSign: "email mention",
  brandGmail: "email google mail",
  brandGooglecalendar: "calendar events",
  brandGooglehome: "nest smart home",
  brandSmartthings: "samsung smart home",
  brandBooking: "booking.com hotel travel",
  brandDeutschebahn: "db train rail",
  brandHue: "philips lights smart home",
  brandImessage: "apple messages sms",
  brandGooglemessages: "sms rcs",
  brandTado: "heating thermostat",
  brandChess: "chess.com",
  brandN26: "bank",
  brandCommerzbank: "bank",
  brandSparkasse: "bank",
  brandDeutschebank: "bank",
  brandIrobot: "roomba vacuum",
  brandEightsleep: "sleep mattress",
};

/** Brand logos from Simple Icons: kit name → Simple Icons slug. */
const BRANDS: Record<string, string> = {
  brandX: "x",
  brandFacebook: "facebook",
  brandInstagram: "instagram",
  brandThreads: "threads",
  brandYoutube: "youtube",
  brandTiktok: "tiktok",
  brandWhatsapp: "whatsapp",
  brandTelegram: "telegram",
  brandSignal: "signal",
  brandMessenger: "messenger",
  brandDiscord: "discord",
  brandBluesky: "bluesky",
  brandMastodon: "mastodon",
  brandReddit: "reddit",
  brandPinterest: "pinterest",
  brandSnapchat: "snapchat",
  brandTumblr: "tumblr",
  brandTwitch: "twitch",
  brandVimeo: "vimeo",
  brandSpotify: "spotify",
  brandSoundcloud: "soundcloud",
  brandMedium: "medium",
  brandSubstack: "substack",
  brandPatreon: "patreon",
  brandXing: "xing",
  brandWechat: "wechat",
  brandLine: "line",
  brandViber: "viber",
  brandGithub: "github",
  brandGitlab: "gitlab",
  brandDribbble: "dribbble",
  brandBehance: "behance",
  brandFigma: "figma",
  brandNotion: "notion",
  brandNpm: "npm",
  brandDocker: "docker",
  brandVercel: "vercel",
  brandStackoverflow: "stackoverflow",
  brandProducthunt: "producthunt",
  brandHuggingface: "huggingface",
  brandAnthropic: "anthropic",
  brandClaude: "claude",
  brandApple: "apple",
  brandGoogle: "google",
  brandAndroid: "android",
  brandDropbox: "dropbox",
  brandGoogledrive: "googledrive",
  brandZoom: "zoom",
  brandTrello: "trello",
  brandPaypal: "paypal",
  brandStripe: "stripe",
  brandKlarna: "klarna",
  brandVisa: "visa",
  brandMastercard: "mastercard",
  brandApplepay: "applepay",
  brandGooglepay: "googlepay",
  brandAirbnb: "airbnb",
  brandTripadvisor: "tripadvisor",
  brandYelp: "yelp",
  brandMeta: "meta",
  brandGoogleads: "googleads",
  brandGoogleanalytics: "googleanalytics",
  brandGooglesearchconsole: "googlesearchconsole",
  brandTrustpilot: "trustpilot",
  brandGooglegemini: "googlegemini",
  brandMistralai: "mistralai",
  brandPerplexity: "perplexity",
  brandOllama: "ollama",
  brandDeepseek: "deepseek",
  brandCursor: "cursor",
  brandGithubcopilot: "githubcopilot",
  brandOpenrouter: "openrouter",
  brandReplicate: "replicate",
  brandElevenlabs: "elevenlabs",
  brandLangchain: "langchain",
  brandModelcontextprotocol: "modelcontextprotocol",
  brandWoocommerce: "woocommerce",
  brandShopify: "shopify",
  brandWordpress: "wordpress",
  brandCloudflare: "cloudflare",
  brandHetzner: "hetzner",
  brandSupabase: "supabase",
  brandPostgresql: "postgresql",
  brandN8n: "n8n",
  brandMake: "make",
  brandZapier: "zapier",
  brandBitcoin: "bitcoin",
  brandEthereum: "ethereum",
  brandTether: "tether",
  brandCoinbase: "coinbase",
  brandBinance: "binance",
  brandRevolut: "revolut",
  brandKick: "kick",
  brandKaspersky: "kaspersky",
  brandVirustotal: "virustotal",
  brandGooglecalendar: "googlecalendar",
  brandGoogledocs: "googledocs",
  brandGooglesheets: "googlesheets",
  brandGmail: "gmail",
  brandGooglephotos: "googlephotos",
  brandGooglemaps: "googlemaps",
  brandTesla: "tesla",
  brandCommerzbank: "commerzbank",
  brandN26: "n26",
  brandDuolingo: "duolingo",
  brandGooglehome: "googlehome",
  brandTado: "tado",
  brandSmartthings: "smartthings",
  brandBooking: "bookingdotcom",
  brandNetflix: "netflix",
  brandIcloud: "icloud",
  brandImessage: "imessage",
  brandGooglemessages: "googlemessages",
  brandProtonmail: "protonmail",
  brandGooglekeep: "googlekeep",
  brandGoogletasks: "googletasks",
  brandGooglemeet: "googlemeet",
  brandTodoist: "todoist",
  brandObsidian: "obsidian",
  brandNextcloud: "nextcloud",
  brandImmich: "immich",
  brandBitwarden: "bitwarden",
  brand1password: "1password",
  brandStrava: "strava",
  brandGarmin: "garmin",
  brandFitbit: "fitbit",
  brandKomoot: "komoot",
  brandPeloton: "peloton",
  brandHeadspace: "headspace",
  brandEightsleep: "eightsleep",
  brandHue: "philipshue",
  brandRing: "ring",
  brandHomeassistant: "homeassistant",
  brandSonos: "sonos",
  brandIkea: "ikea",
  brandXiaomi: "xiaomi",
  brandIrobot: "irobot",
  brandIfttt: "ifttt",
  brandUber: "uber",
  brandUbereats: "ubereats",
  brandDeutschebahn: "deutschebahn",
  brandLufthansa: "lufthansa",
  brandExpedia: "expedia",
  brandWise: "wise",
  brandSparkasse: "sparkasse",
  brandDeutschebank: "deutschebank",
  brandTradingview: "tradingview",
  brandEbay: "ebay",
  brandZalando: "zalando",
  brandVinted: "vinted",
  brandKleinanzeigen: "kleinanzeigen",
  brandDhl: "dhl",
  brandUps: "ups",
  brandDpd: "dpd",
  brandHermes: "hermes",
  brandApplemusic: "applemusic",
  brandApplepodcasts: "applepodcasts",
  brandAudible: "audible",
  brandAppletv: "appletv",
  brandSteam: "steam",
  brandPlaystation: "playstation",
  brandGoodreads: "goodreads",
  brandLetterboxd: "letterboxd",
  brandChess: "chessdotcom",
  brandAnki: "anki",
};

/**
 * Brand logos Simple Icons may not carry (their owners asked it to remove them), from Font Awesome
 * Free (CC BY 4.0): kit name → Font Awesome export.
 */
const FA_BRANDS: Record<string, string> = {
  brandLinkedin: "faLinkedin",
  brandMicrosoft: "faMicrosoft",
  brandWindows: "faWindows",
  brandSlack: "faSlack",
  brandSkype: "faSkype",
  brandAmazon: "faAmazon",
  brandOpenai: "faOpenai",
  brandXbox: "faXbox",
  brandWaze: "faWaze",
};

type Node = [string, Record<string, string | number>];

const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const n = (v: string | number | undefined) => Number(v ?? 0);

/** One path for a Lucide icon's elements. */
function toPath(nodes: Node[]): string {
  const parts: string[] = [];
  for (const [tag, a] of nodes) {
    // each element starts from the origin: a leading relative `m` must not continue the previous one
    if (tag === "path") parts.push(svgpath(String(a.d)).abs().toString());
    else if (tag === "circle" || tag === "ellipse") {
      const cx = n(a.cx),
        cy = n(a.cy),
        rx = n(tag === "circle" ? a.r : a.rx),
        ry = n(tag === "circle" ? a.r : a.ry);
      parts.push(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`);
    } else if (tag === "rect") {
      const x = n(a.x),
        y = n(a.y),
        w = n(a.width),
        h = n(a.height);
      const r = Math.min(n(a.rx ?? a.ry), w / 2, h / 2);
      parts.push(
        r
          ? `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${2 * r - w}a${r} ${r} 0 0 1 ${-r} ${-r}v${2 * r - h}a${r} ${r} 0 0 1 ${r} ${-r}z`
          : `M${x} ${y}h${w}v${h}h${-w}z`,
      );
    } else if (tag === "line") parts.push(`M${a.x1} ${a.y1}L${a.x2} ${a.y2}`);
    else if (tag === "polyline" || tag === "polygon") {
      const pts = String(a.points)
        .trim()
        .split(/[\s,]+/);
      let d = "";
      for (let i = 0; i < pts.length; i += 2) d += `${i ? "L" : "M"}${pts[i]} ${pts[i + 1]}`;
      parts.push(tag === "polygon" ? d + "z" : d);
    } else throw new Error(`unknown element ${tag}`);
  }
  return parts.join("");
}

/** Moves a drawing so its box is centred on the 24px grid (and optionally scales it). */
function centre(d: string, scale = 1): string {
  let p = svgpath(d).abs();
  if (scale !== 1) p = p.translate(-12, -12).scale(scale).translate(12, 12);
  const [x0, y0, x1, y1] = svgPathBbox(p.toString());
  const dx = 12 - (x0 + x1) / 2,
    dy = 12 - (y0 + y1) / 2;
  return svgpath(p.toString()).translate(dx, dy).rel().round(2).toString();
}

export function build(): string {
  const lucide = JSON.parse(
    readFileSync(require.resolve("lucide-static/icon-nodes.json"), "utf8"),
  ) as Record<string, Node[]>;
  const si = require("simple-icons") as Record<string, { slug: string; path: string }>;
  const bySlug = new Map(Object.values(si).map((i) => [i.slug, i]));
  const core = new Set(Object.keys(ICON_PATHS));

  const tags = JSON.parse(
    readFileSync(require.resolve("lucide-static/tags.json"), "utf8"),
  ) as Record<string, string[]>;
  const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const keywords: Record<string, string> = {};
  const addWords = (name: string, words: string[]) => {
    const list = [...new Set([...(keywords[name] ?? "").split(" "), ...words])]
      .map((w) => w.toLowerCase())
      .filter((w) => w && !name.toLowerCase().includes(w));
    if (list.length) keywords[name] = list.slice(0, 14).join(" ");
  };
  // the words people type first, then Lucide's tags
  for (const [name, words] of Object.entries(EXTRA_KEYWORDS)) addWords(name, words.split(" "));
  const lines: string[] = [];
  const names: string[] = [];
  const categories: Record<string, string[]> = {};
  const missing: string[] = [];
  const seen = new Set<string>();
  for (const [cat, entries] of Object.entries(CATEGORIES)) {
    const list: string[] = [];
    for (const e of entries) {
      const [left, source] = e.includes("=") ? (e.split("=") as [string, string]) : [e, e];
      const kitName = camel(left);
      if (seen.has(kitName)) throw new Error(`${kitName} listed twice`);
      seen.add(kitName);
      list.push(kitName);
      addWords(kitName, tags[source] ?? tags[kebab(kitName)] ?? []);
      // a kit icon (or a Lucide icon the kit already has under that name) keeps the kit drawing
      if (core.has(kitName)) continue;
      const nodes = lucide[source];
      if (!nodes) {
        missing.push(source);
        continue;
      }
      names.push(kitName);
      lines.push(`export const ${kitName}: string = "${centre(toPath(nodes))}";`);
    }
    categories[cat] = list;
  }
  const brands: string[] = [];
  for (const [kitName, slug] of Object.entries(BRANDS)) {
    const icon = bySlug.get(slug);
    if (!icon) {
      missing.push(`simple-icons:${slug}`);
      continue;
    }
    brands.push(kitName);
    names.push(kitName);
    addWords(kitName, [
      ...(icon as unknown as { title: string }).title.toLowerCase().split(/\s+/),
      "brand",
      "logo",
      "social",
    ]);
    // logos fill their box; scaled to 20/24 they sit like the line icons (which reach 2–22)
    lines.push(
      `export const ${kitName}: FilledIcon = { d: "${centre(icon.path, 20 / 24)}", filled: true };`,
    );
  }
  const fa = require("@fortawesome/free-brands-svg-icons") as Record<
    string,
    { iconName: string; icon: [number, number, string[], string, string | string[]] }
  >;
  for (const [kitName, exportName] of Object.entries(FA_BRANDS)) {
    const icon = fa[exportName];
    if (!icon) {
      missing.push(`font-awesome:${exportName}`);
      continue;
    }
    const [w, h, , , data] = icon.icon;
    const d = Array.isArray(data) ? data.join(" ") : data;
    brands.push(kitName);
    names.push(kitName);
    addWords(kitName, [...icon.iconName.split("-"), "brand", "logo", "social"]);
    // Font Awesome draws on its own grid (e.g. 448×512): fit the longer side to 20 of the 24
    const fitted = svgpath(d)
      .scale(20 / Math.max(w, h))
      .toString();
    lines.push(`export const ${kitName}: FilledIcon = { d: "${centre(fitted)}", filled: true };`);
  }
  categories["Brands"] = brands;
  if (missing.length) throw new Error(`not found: ${missing.join(", ")}`);
  for (const c of core) if (!seen.has(c)) throw new Error(`kit icon ${c} has no category`);

  const lucideVersion = (require("lucide-static/package.json") as { version: string }).version;
  const siDir = require.resolve("simple-icons").replace(/simple-icons[\\/].*$/, "simple-icons");
  const siVersion = (
    JSON.parse(readFileSync(join(siDir, "package.json"), "utf8")) as { version: string }
  ).version;
  const faDir = require
    .resolve("@fortawesome/free-brands-svg-icons")
    .replace(/free-brands-svg-icons[\\/].*$/, "free-brands-svg-icons");
  const faVersion = (
    JSON.parse(readFileSync(join(faDir, "package.json"), "utf8")) as { version: string }
  ).version;
  return `/* Generated by scripts/icons.ts from lucide-static ${lucideVersion} (ISC), simple-icons ${siVersion} (CC0) and @fortawesome/free-brands-svg-icons ${faVersion} (CC BY 4.0); do not edit. */
/**
 * The icon library: ${names.length} icons on top of the kit's own set, in the kit's style (24px grid,
 * 2px round-capped strokes, \`currentColor\`); brand logos (\`brand…\`) are filled.
 *
 * Nothing here is bundled until you import it. Register what you use, once, before rendering:
 *
 *   import { registerIcons } from "@twentyfirstmedia/halo";
 *   import { fingerprint, brandGithub } from "@twentyfirstmedia/halo/icons";
 *   registerIcons({ fingerprint, brandGithub });
 *
 * or everything with \`registerIcons(ICON_LIBRARY)\`. Then use the names like the kit's own icons:
 * \`<Icon name="fingerprint" />\`, \`<Button icon="brandGithub">\`.
 *
 * Line icons: Lucide, ISC License, Copyright (c) Lucide Icons and Contributors (see ICONS-LICENSE).
 * Brand logos: Simple Icons, CC0 1.0; LinkedIn, Microsoft, Windows, Slack, Skype, Amazon and OpenAI
 * from Font Awesome Free, CC BY 4.0 (https://fontawesome.com/license/free). Logos are trademarks of
 * their owners; follow each brand's guidelines (e.g. link to the brand's own page).
 */
import type { FilledIcon } from "./icons.js";

${lines.join("\n")}

/** Every icon of the library by name: \`registerIcons(ICON_LIBRARY)\` makes them all available. */
export const ICON_LIBRARY = {
${names.map((x) => `  ${x},`).join("\n")}
};

/** A name from the library. */
export type LibraryIconName = keyof typeof ICON_LIBRARY;

/** Kit and library icons by category, in gallery order (the kit's own icons first in each). */
export const ICON_CATEGORIES: Record<string, readonly string[]> = ${JSON.stringify(categories, null, 2)};

/** Search words per icon (from Lucide's tags and brand names), for icon pickers. */
export const ICON_KEYWORDS: Record<string, string> = ${JSON.stringify(keywords, null, 2)};
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = build();
  if (process.argv.includes("--check")) {
    if (readFileSync(OUT, "utf8") !== out) {
      console.error("icon-library.ts is out of date: run node scripts/icons.ts");
      process.exit(1);
    }
  } else {
    writeFileSync(OUT, out);
    console.log(`wrote ${OUT}`);
  }
}
