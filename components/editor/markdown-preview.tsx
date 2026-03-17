/**
 * @file markdown-preview.tsx
 * @description Renders markdown content as styled HTML using ReactMarkdown. Supports
 * platform-specific extensions for GitHub, GitLab, and Bitbucket, including alerts,
 * task lists, frontmatter, TOC, inline diffs, and emoji shortcodes.
 */

import {
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  useMemo,
  type ElementType,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react"
import {
  AlertCircle,
  AlertTriangle,
  Box,
  Info,
  Lightbulb,
  Link,
  Map as MapIcon,
  Workflow,
  XOctagon,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import { defListHastHandlers, remarkDefinitionList } from "remark-definition-list"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import type { PluggableList, Plugin } from "unified"

import {
  BLOCKQUOTE_STYLE,
  CODE_STYLES,
  HEADING_STYLES,
  HR_STYLE,
  IMAGE_STYLE,
  LINK_STYLE,
  LIST_STYLES,
  TABLE_STYLES,
} from "@/lib/markdown-components/styles"
import { ScrollArea } from "@/components/ui/scroll-area"

import type { PlatformType } from "./platform-selector"

const COLOR_HEX_RE = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
const COLOR_RGB_RE = /^rgb\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/
const COLOR_HSL_RE = /^hsl\s*\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/

type TaskElementProps = {
  children?: ReactNode
  checked?: boolean
  type?: string
}

function isTaskElement(node: ReactNode): node is ReactElement<TaskElementProps> {
  return isValidElement(node)
}

interface MarkdownPreviewProps {
  content: string
  platform: PlatformType
}

interface HeadingProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  id?: string
  children: ReactNode
  platform: PlatformType
}

interface HastNode {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

/** Maps GitHub-style emoji shortcodes (e.g. :smile:) to their Unicode equivalents. */
const EMOJI_MAP: Record<string, string> = {
  smile: "😄",
  laughing: "😆",
  blush: "😊",
  smiley: "😃",
  relaxed: "☺️",
  smirk: "😏",
  heart_eyes: "😍",
  kissing_heart: "😘",
  kissing_closed_eyes: "😚",
  flushed: "😳",
  relieved: "😌",
  satisfied: "😆",
  grin: "😁",
  wink: "😉",
  stuck_out_tongue_winking_eye: "😜",
  stuck_out_tongue_closed_eyes: "😝",
  grinning: "😀",
  kissing: "😗",
  kissing_smiling_eyes: "😙",
  stuck_out_tongue: "😛",
  sleeping: "😴",
  worried: "😟",
  frowning: "😦",
  anguished: "😧",
  open_mouth: "😮",
  grimacing: "😬",
  confused: "😕",
  hushed: "😯",
  expressionless: "😑",
  unamused: "😒",
  sweat_smile: "😅",
  sweat: "😓",
  disappointed_relieved: "😥",
  weary: "😩",
  pensive: "😔",
  disappointed: "😞",
  confounded: "😖",
  fearful: "😨",
  cold_sweat: "😰",
  persevere: "😣",
  cry: "😢",
  sob: "😭",
  joy: "😂",
  astonished: "😲",
  scream: "😱",
  tired_face: "😫",
  angry: "😠",
  rage: "😡",
  triumph: "😤",
  sleepy: "😪",
  yum: "😋",
  mask: "😷",
  sunglasses: "😎",
  dizzy_face: "😵",
  imp: "👿",
  smiling_imp: "😈",
  neutral_face: "😐",
  no_mouth: "😶",
  innocent: "😇",
  alien: "👽",
  yellow_heart: "💛",
  blue_heart: "💙",
  purple_heart: "💜",
  heart: "❤️",
  green_heart: "💚",
  broken_heart: "💔",
  heartbeat: "💓",
  heartpulse: "💗",
  two_hearts: "💕",
  revolving_hearts: "💞",
  cupid: "💘",
  sparkling_heart: "💖",
  sparkles: "✨",
  star: "⭐",
  star2: "🌟",
  dizzy: "💫",
  boom: "💥",
  collision: "💥",
  anger: "💢",
  exclamation: "❗",
  question: "❓",
  grey_exclamation: "❕",
  grey_question: "❔",
  zzz: "💤",
  dash: "💨",
  sweat_drops: "💦",
  notes: "🎶",
  musical_note: "🎵",
  fire: "🔥",
  poop: "💩",
  thumbsup: "👍",
  thumbsdown: "👎",
  ok_hand: "👌",
  punch: "👊",
  facepunch: "👊",
  fist: "✊",
  v: "✌️",
  wave: "👋",
  hand: "✋",
  raised_hand: "✋",
  open_hands: "👐",
  point_up: "☝️",
  point_down: "👇",
  point_left: "👈",
  point_right: "👉",
  raised_hands: "🙌",
  pray: "🙏",
  point_up_2: "👆",
  clap: "👏",
  muscle: "💪",
  metal: "🤘",
  fu: "🖕",
  walking: "🚶",
  runner: "🏃",
  running: "🏃",
  couple: "👫",
  family: "👪",
  two_men_holding_hands: "👬",
  two_women_holding_hands: "👭",
  dancer: "💃",
  dancers: "👯",
  ok_woman: "🙆",
  no_good: "🙅",
  information_desk_person: "💁",
  raising_hand: "🙋",
  bride_with_veil: "👰",
  person_with_pouting_face: "🙎",
  person_frowning: "🙍",
  bow: "🙇",
  couplekiss: "💏",
  couple_with_heart: "💑",
  massage: "💆",
  haircut: "💇",
  nail_care: "💅",
  boy: "👦",
  girl: "👧",
  woman: "👩",
  man: "👨",
  baby: "👶",
  older_woman: "👵",
  older_man: "👴",
  person_with_blond_hair: "👱",
  man_with_gua_pi_mao: "👲",
  man_with_turban: "👳",
  construction_worker: "👷",
  cop: "👮",
  angel: "👼",
  princess: "👸",
  smiley_cat: "😺",
  smile_cat: "😸",
  heart_eyes_cat: "😻",
  kissing_cat: "😽",
  smirk_cat: "😼",
  scream_cat: "🙀",
  crying_cat_face: "😿",
  joy_cat: "😹",
  pouting_cat: "😾",
  japanese_ogre: "👹",
  japanese_goblin: "👺",
  see_no_evil: "🙈",
  hear_no_evil: "🙉",
  speak_no_evil: "🙊",
  guardsman: "💂",
  skull: "💀",
  feet: "🐾",
  lips: "👄",
  kiss: "💋",
  droplet: "💧",
  ear: "👂",
  eyes: "👀",
  nose: "👃",
  tongue: "👅",
  love_letter: "💌",
  bust_in_silhouette: "👤",
  busts_in_silhouette: "👥",
  speech_balloon: "💬",
  thought_balloon: "💭",
  rocket: "🚀",
  helicopter: "🚁",
  steam_locomotive: "🚂",
  railway_car: "🚃",
  bullettrain_side: "🚄",
  bullettrain_front: "🚅",
  train2: "🚆",
  metro: "🚇",
  light_rail: "🚈",
  station: "🚉",
  tram: "🚊",
  train: "🚋",
  bus: "🚌",
  oncoming_bus: "🚍",
  trolleybus: "🚎",
  busstop: "🚏",
  minibus: "🚐",
  ambulance: "🚑",
  fire_engine: "🚒",
  police_car: "🚓",
  oncoming_police_car: "🚔",
  taxi: "🚕",
  oncoming_taxi: "🚖",
  car: "🚗",
  red_car: "🚗",
  oncoming_automobile: "🚘",
  blue_car: "🚙",
  truck: "🚚",
  articulated_lorry: "🚛",
  tractor: "🚜",
  monorail: "🚝",
  mountain_railway: "🚞",
  suspension_railway: "🚟",
  cable_car: "🚠",
  aerial_tramway: "🚡",
  ship: "🚢",
  boat: "⛵",
  sailboat: "⛵",
  speedboat: "🚤",
  traffic_light: "🚥",
  vertical_traffic_light: "🚦",
  construction: "🚧",
  rotating_light: "🚨",
  triangular_flag_on_post: "🚩",
  door: "🚪",
  no_entry_sign: "🚫",
  smoking: "🚬",
  no_smoking: "🚭",
  put_litter_in_its_place: "🚮",
  do_not_litter: "🚯",
  potable_water: "🚰",
  non_potable_water: "🚱",
  bike: "🚲",
  no_bicycles: "🚳",
  bicyclist: "🚴",
  mountain_bicyclist: "🚵",
  walking_man: "🚶",
  no_pedestrians: "🚷",
  children_crossing: "🚸",
  mens: "🚹",
  womens: "🚺",
  restroom: "🚻",
  baby_symbol: "🚼",
  toilet: "🚽",
  wc: "🚾",
  shower: "🚿",
  bath: "🛀",
  bathtub: "🛁",
  passport_control: "🛂",
  customs: "🛃",
  baggage_claim: "🛄",
  left_luggage: "🛅",
  couch_and_lamp: "🛋️",
  sleeping_accommodation: "🛌",
  shopping_bags: "🛍️",
  bellhop_bell: "🛎️",
  bed: "🛏️",
  place_of_worship: "🛐",
  octagonal_sign: "🛑",
  shopping_cart: "🛒",
  checkered_flag: "🏁",
  crossed_flags: "🎌",
  rainbow_flag: "🏳️‍🌈",
  rosette: "🏵️",
  reminder_ribbon: "🎗️",
  admission_tickets: "🎟️",
  ticket: "🎫",
  medal_military: "🎖️",
  trophy: "🏆",
  sports_medal: "🏅",
  first_place_medal: "🥇",
  second_place_medal: "🥈",
  third_place_medal: "🥉",
  soccer: "⚽",
  baseball: "⚾",
  basketball: "🏀",
  volleyball: "🏐",
  football: "🏈",
  rugby_football: "🏉",
  tennis: "🎾",
  nazar_amulet: "🧿",
  jigsaw: "🧩",
  teddy_bear: "🧸",
  broom: "🧹",
  basket: "🧺",
  roll_of_paper: "🧻",
  soap: "🧼",
  sponge: "🧽",
  receipt: "🧾",
  safety_pin: "🧷",
}

interface UnistNode {
  type: string
  value?: string
  children?: UnistNode[]
  data?: {
    hName?: string
    hProperties?: { className?: string; [key: string]: unknown }
    [key: string]: unknown
  }
}

type GitlabAlertType = "note" | "tip" | "important" | "warning" | "caution"
const GITLAB_ALERT_TYPES = ["note", "tip", "important", "warning", "caution"] as const

/** Returns a valid GitlabAlertType from a raw string, defaulting to "note" if unrecognised. */
function toGitlabAlertType(raw: string): GitlabAlertType {
  const lower = raw.toLowerCase()
  return (GITLAB_ALERT_TYPES as readonly string[]).includes(lower)
    ? (lower as GitlabAlertType)
    : "note"
}

/** Matches the [!TYPE] header line in alert blockquotes, e.g. `[!WARNING] optional title`. */
const ALERT_HEADER_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][\t ]*(.*)/i

/** Remark plugin - replaces :shortcode: patterns with emoji characters. */
const remarkEmojis = () => (tree: UnistNode) => {
  const walk = (node: UnistNode) => {
    if (node.type === "text" && node.value)
      node.value = node.value.replace(
        /:([a-z0-9_+-]+):/g,
        (m: string, p1: string) => EMOJI_MAP[p1] || m
      )
    node.children?.forEach(walk)
  }
  walk(tree)
}

/** Remark plugin - converts GitHub-style `> [!TYPE]` blockquotes into styled alert nodes. */
const remarkGithubAlerts = () => (tree: UnistNode) => {
  const walk = (node: UnistNode) => {
    if (node.type === "blockquote" && node.children?.length) {
      const first = node.children[0]
      if (first.type === "paragraph" && first.children?.length) {
        const txt = first.children[0]
        if (txt.type === "text" && txt.value) {
          const m = txt.value.match(
            /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*\n|\s+|$)([\s\S]*)/i
          )
          if (m) {
            node.data = node.data || {}
            node.data.hProperties = {
              ...(node.data.hProperties || {}),
              className: `github-alert github-alert-${m[1].toLowerCase()}`,
            }
            if (m[2]) txt.value = m[2]
            else first.children.shift()
          }
        }
      }
    }
    node.children?.forEach(walk)
  }
  walk(tree)
}

/**
 * Remark plugin - handles GitLab's triple-chevron alert syntax (`>>> [!TYPE]`).
 * Three nested blockquotes are collapsed into a single styled alert node.
 */
const remarkGitlabTripleChevronAlerts = () => (tree: UnistNode) => {
  const walk = (node: UnistNode) => {
    if (node.type === "blockquote" && node.children?.length) {
      const r1 = node.children.filter((c) => !(c.type === "text" && !c.value?.trim()))
      if (r1.length === 1 && r1[0].type === "blockquote") {
        const r2 = (r1[0].children || []).filter((c) => !(c.type === "text" && !c.value?.trim()))
        if (r2.length === 1 && r2[0].type === "blockquote") {
          const inner = r2[0]
          const innerChildren = inner.children || []
          const firstChild = innerChildren[0]
          if (firstChild?.type === "paragraph" && firstChild.children?.length) {
            const txt = firstChild.children[0]
            if (txt.type === "text" && txt.value) {
              const m = txt.value.match(
                /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(.*?))?(?:\s*\n([\s\S]*))?$/i
              )
              if (m) {
                const alertType = toGitlabAlertType(m[1])
                const inlineTitle = (m[2] || "").trim()
                const remainder = (m[3] || "").trim()

                node.data = node.data || {}
                node.data.hProperties = {
                  ...(node.data.hProperties || {}),
                  className: `gitlab-alert gitlab-alert-${alertType}`,
                  "data-title": inlineTitle,
                }

                if (remainder) {
                  txt.value = remainder
                  node.children = innerChildren
                } else {
                  firstChild.children.shift()
                  const remaining = firstChild.children.length
                    ? [firstChild, ...innerChildren.slice(1)]
                    : innerChildren.slice(1)
                  node.children = remaining.length ? remaining : []
                }
                return
              }
            }
          }
        }
      }
    }
    node.children?.forEach(walk)
  }
  walk(tree)
}

/** Remark plugin - handles GitLab's single-chevron alert syntax (`> [!TYPE]`). */
const remarkGitlabSingleChevronAlerts = () => (tree: UnistNode) => {
  const walk = (node: UnistNode) => {
    if (node.type === "blockquote" && node.children && node.children.length > 0) {
      const firstChild = node.children[0]
      if (
        firstChild.type === "paragraph" &&
        firstChild.children &&
        firstChild.children.length > 0
      ) {
        const firstTextNode = firstChild.children[0]
        if (firstTextNode.type === "text" && firstTextNode.value) {
          const match = firstTextNode.value.match(
            /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*\n|\s+|$)([\s\S]*)/i
          )
          if (match) {
            const alertType = toGitlabAlertType(match[1])
            const remainingText = match[2]

            node.data = node.data || {}
            node.data.hProperties = node.data.hProperties || {}
            node.data.hProperties.className = `gitlab-alert gitlab-alert-${alertType}`

            if (remainingText) {
              firstTextNode.value = remainingText
            } else {
              firstChild.children.shift()
            }
          }
        }
      }
    }
    if (node.children) {
      node.children.forEach(walk)
    }
  }
  walk(tree)
}

/** Remark plugin - renders `[~] item` list items as strikethrough task list entries (GitLab). */
const remarkGitlabTaskTilde = () => (tree: UnistNode) => {
  const walk = (node: UnistNode) => {
    if (node.type === "list") {
      node.children?.forEach((item) => {
        if (item.type === "listItem") {
          item.children?.forEach((child) => {
            if (child.type === "paragraph" && child.children?.length) {
              const first = child.children[0]
              if (first.type === "text" && first.value && /^\[~\]\s/.test(first.value)) {
                const labelText = first.value.replace(/^\[~\]\s/, "")
                const rest = child.children.slice(1)
                item.data = item.data || {}
                item.data.hProperties = {
                  ...(item.data.hProperties || {}),
                  className: "task-list-item",
                }
                child.children = [
                  {
                    type: "html",
                    value: '<input type="checkbox" disabled class="task-list-item-checkbox"> ',
                  } as UnistNode,
                  {
                    type: "element" as unknown as string,
                    data: { hName: "del" },
                    children: [{ type: "text", value: labelText }, ...rest],
                  } as UnistNode,
                ]
              }
            }
          })
        }
      })
    }
    node.children?.forEach(walk)
  }
  walk(tree)
}

/** Remark plugin - converts `{+ text +}` / `{- text -}` patterns into GitLab inline diff nodes. */
const remarkGitlabInlineDiff = () => (tree: UnistNode) => {
  const walk = (node: UnistNode, parent?: UnistNode) => {
    if (node.type === "paragraph" && node.children) {
      const newChildren: UnistNode[] = []
      node.children.forEach((child) => {
        if (child.type === "text" && child.value) {
          child.value.split(/\r?\n/).forEach((line) => {
            const m = line.trim().match(/^([\[{])([+-])\s(.+?)\s\2([\]}])$/)
            if (m) {
              const [_, _o, sign, text] = m
              newChildren.push({
                type: "paragraph",
                data: {
                  hName: "div",
                  hProperties: {
                    className: `${sign === "+" ? "gitlab-inline-diff-add" : "gitlab-inline-diff-del"} my-1 px-2 py-1 rounded block`,
                  },
                },
                children: [{ type: "text", value: text }],
              })
            } else if (line.length > 0) {
              newChildren.push({ type: "text", value: line })
            }
          })
        } else {
          newChildren.push(child)
        }
      })
      if (parent?.children && newChildren.some((c) => c.data?.hName === "div")) {
        parent.children.splice(parent.children.indexOf(node), 1, ...newChildren)
      }
    }
    node.children?.slice().forEach((c) => walk(c, node))
  }
  walk(tree)
}

/** Remark plugin - renders YAML frontmatter as a styled key/value table (GitLab). */
const remarkGitlabFrontMatter = () => (tree: UnistNode) => {
  if (!tree.children?.length) return

  const first = tree.children[0]

  if (first.type !== "yaml" || !first.value) return

  const pairs: { key: string; value: string }[] = []

  first.value.split("\n").forEach((line) => {
    const m = line.match(/^([^:]+):\s*(.*)$/)
    if (m) pairs.push({ key: m[1].trim(), value: m[2].trim() })
  })

  if (!pairs.length) return

  tree.children[0] = {
    type: "paragraph",
    data: {
      hName: "div",
      hProperties: {
        className: "gitlab-frontmatter",
        "data-fm": JSON.stringify(pairs),
      },
    },
    children: [],
  }
}

/** Recursively extracts the plain text content from a UnistNode tree. */
function getNodeText(node: UnistNode): string {
  if (node.type === "text") return node.value ?? ""
  return (node.children ?? []).map(getNodeText).join("")
}

/**
 * Remark plugin - replaces `[[_TOC_]]`, `[TOC]`, or `[[TOC]]` with a placeholder
 * div that the React renderer later hydrates into a real table of contents.
 */
const remarkTOC = () => (tree: UnistNode) => {
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "")

  tree.children?.forEach((node, idx) => {
    if (node.type !== "paragraph") return

    const text = normalize(getNodeText(node))

    if (text === "[[_toc_]]" || text === "[toc]" || text === "[[toc]]") {
      tree.children![idx] = {
        type: "paragraph",
        data: {
          hName: "div",
          hProperties: { className: "toc-placeholder" },
        },
        children: [],
      }
    }
  })
}

/** Converts a heading string into a URL-safe slug for anchor links. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface TocEntry {
  depth: number
  text: string
  id: string
}

/**
 * Parses heading lines from raw markdown to build a TOC entry list.
 * Skips headings inside fenced code blocks and handles duplicate slugs.
 */
function extractHeadings(markdown: string): TocEntry[] {
  const entries: TocEntry[] = []
  const slugCount: Record<string, number> = {}
  let inFence = false

  for (const line of markdown.split("\n")) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = line.match(/^(#{1,6})\s+(.+)$/)
    if (!m) continue
    const depth = m[1].length
    const raw = m[2].replace(/\s+#+\s*$/, "").trim()
    const text = raw.replace(/\*{1,2}|_{1,2}|`/g, "")
    const baseSlug = slugify(text)
    const count = slugCount[baseSlug] ?? 0
    slugCount[baseSlug] = count + 1
    entries.push({ depth, text, id: count === 0 ? baseSlug : `${baseSlug}-${count}` })
  }
  return entries
}

type AlertStyle = { border: string; bg: string; text: string; Icon: typeof Info }

/** Tailwind colour tokens for each GitHub alert type. */
const GITHUB_ALERT_STYLES: Record<GitlabAlertType, AlertStyle> = {
  note: { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-500", Icon: Info },
  tip: {
    border: "border-green-500",
    bg: "bg-green-500/10",
    text: "text-green-500",
    Icon: Lightbulb,
  },
  important: {
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    Icon: AlertCircle,
  },
  warning: {
    border: "border-yellow-500",
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    Icon: AlertTriangle,
  },
  caution: { border: "border-red-500", bg: "bg-red-500/10", text: "text-red-500", Icon: XOctagon },
}

/** Tailwind colour tokens for each GitLab alert type. */
const GITLAB_ALERT_STYLES: Record<GitlabAlertType, AlertStyle> = {
  note: {
    border: "border-blue-700",
    bg: "bg-transparent",
    text: "text-blue-700   dark:text-blue-400",
    Icon: Info,
  },
  tip: {
    border: "border-green-700",
    bg: "bg-transparent",
    text: "text-green-700  dark:text-green-400",
    Icon: Lightbulb,
  },
  important: {
    border: "border-purple-700",
    bg: "bg-transparent",
    text: "text-purple-700 dark:text-purple-400",
    Icon: AlertCircle,
  },
  warning: {
    border: "border-yellow-700",
    bg: "bg-transparent",
    text: "text-yellow-700 dark:text-yellow-400",
    Icon: AlertTriangle,
  },
  caution: {
    border: "border-red-700",
    bg: "bg-transparent",
    text: "text-red-700    dark:text-red-400",
    Icon: XOctagon,
  },
}

/** Renders a styled alert blockquote for both GitHub and GitLab alert types. */
function renderAlert(
  alertType: GitlabAlertType,
  title: string,
  body: ReactNode,
  alertPlatform: "github" | "gitlab",
  extraProps?: Record<string, unknown>
) {
  const styles = alertPlatform === "gitlab" ? GITLAB_ALERT_STYLES : GITHUB_ALERT_STYLES
  const { border, bg, text, Icon } = styles[alertType]
  const displayTitle = title && title !== alertType ? title : alertType
  const padding = alertPlatform === "gitlab" ? "px-4 py-1" : "px-4 py-3"
  const titleGap = alertPlatform === "gitlab" ? "mb-0.5" : "mb-2"
  return (
    <blockquote
      {...(extraProps || {})}
      className={`md-hover-label my-4 border-l-4 ${padding} ${border} ${bg} rounded-r-lg`}
    >
      <div className={`${titleGap} flex items-center gap-2 font-semibold ${text}`}>
        {alertPlatform === "github" && <Icon className="h-4 w-4" />}
        <span className="capitalize">{displayTitle}</span>
      </div>
      <div className="text-foreground/80">{body}</div>
    </blockquote>
  )
}

/** Recursively extracts plain text from a HAST node tree. */
function getHastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? ""
  return (node.children ?? []).map(getHastText).join("")
}

/**
 * Attempts to parse a GitLab fenced alert (`>>> [!TYPE]`) from a HAST blockquote node.
 * Returns null if the node doesn't match the expected triple-blockquote structure.
 */
function parseFencedAlertFromHast(
  node: HastNode
): { alertType: GitlabAlertType; title: string; bodyText: string } | null {
  if (node.tagName !== "blockquote") return null
  const cls = String((node.properties?.className as string[] | string) ?? "")
  if (cls.includes("gitlab-alert") || cls.includes("github-alert")) return null

  const realChildren = (node.children ?? []).filter(
    (c) => !(c.type === "text" && c.value?.trim() === "")
  )
  if (realChildren.length !== 1 || realChildren[0].tagName !== "blockquote") return null

  const mid = realChildren[0]
  const midCls = String((mid.properties?.className as string[] | string) ?? "")
  if (midCls.includes("gitlab-alert") || midCls.includes("github-alert")) return null

  const midReal = (mid.children ?? []).filter((c) => !(c.type === "text" && c.value?.trim() === ""))
  if (midReal.length !== 1 || midReal[0].tagName !== "blockquote") return null

  const inner = midReal[0]
  const innerCls = String((inner.properties?.className as string[] | string) ?? "")
  if (innerCls.includes("gitlab-alert") || innerCls.includes("github-alert")) return null

  const fullText = getHastText(inner).trim()
  if (!fullText) return null

  const firstLine = fullText.split("\n")[0].trim()
  const m = firstLine.match(ALERT_HEADER_RE)
  if (!m) return null

  return {
    alertType: toGitlabAlertType(m[1]),
    title: m[2].trim(),
    bodyText: fullText.split("\n").slice(1).join("\n").trim(),
  }
}

/**
 * Returns true if a HAST node is a triple-nested empty blockquote (`>>>`).
 * Used to suppress rendering of bare triple-chevron structures that aren't alerts.
 */
function isEmptyTripleFenceHast(node: HastNode): boolean {
  if (node.tagName !== "blockquote") return false
  const r1 = (node.children ?? []).filter((c) => !(c.type === "text" && c.value?.trim() === ""))
  if (r1.length !== 1 || r1[0].tagName !== "blockquote") return false
  const r2 = (r1[0].children ?? []).filter((c) => !(c.type === "text" && c.value?.trim() === ""))
  if (r2.length !== 1 || r2[0].tagName !== "blockquote") return false
  const r3 = (r2[0].children ?? []).filter((c) => !(c.type === "text" && c.value?.trim() === ""))
  return r3.length === 0
}

/**
 * Custom heading component that conditionally renders anchor links based on platform and presence of an ID.
 * Anchor links are only shown for GitHub where heading IDs are standardized.
 */
function Heading({
  as: Tag = "h2",
  children,
  className = "",
  id,
  platform,
  ...props
}: HeadingProps) {
  const showAnchor = platform === "github" && id
  return (
    <Tag {...props} className={`group relative ${className}`} id={id}>
      {showAnchor && (
        <a
          aria-label="Anchor link"
          className="text-muted-foreground hover:text-foreground absolute top-1/2 -left-6 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          href={`#${id}`}
        >
          <Link className="h-4 w-4" />
        </a>
      )}
      {children}
    </Tag>
  )
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  function MarkdownPreview({ content, platform }, ref) {
    // Build the remark plugin list based on the active platform
    const remarkPlugins = useMemo(() => {
      const plugins: PluggableList = []
      plugins.push(remarkGfm)
      if (platform === "github") {
        plugins.push(remarkMath)
        plugins.push(remarkEmojis as Plugin)
        plugins.push(remarkGithubAlerts as Plugin)
      } else if (platform === "gitlab") {
        plugins.push(remarkFrontmatter)
        plugins.push(remarkGitlabFrontMatter as Plugin)
        plugins.push(remarkTOC as Plugin)
        plugins.push(remarkMath as Plugin)
        plugins.push(remarkEmojis as Plugin)
        plugins.push(remarkDefinitionList)
        plugins.push(remarkGitlabInlineDiff as Plugin)
        plugins.push(remarkGitlabTaskTilde as Plugin)
        plugins.push(remarkGitlabTripleChevronAlerts as Plugin)
        plugins.push(remarkGitlabSingleChevronAlerts as Plugin)
      } else if (platform === "bitbucket") {
        plugins.push(remarkTOC as Plugin)
      }
      return plugins
    }, [platform])

    // Build the rehype plugin list based on the active platform
    const rehypePlugins = useMemo(() => {
      const plugins: Array<
        typeof rehypeKatex | typeof rehypeHighlight | typeof rehypeRaw | typeof rehypeSlug
      > = []
      plugins.push(rehypeRaw)
      if (platform === "github" || platform === "gitlab" || platform === "bitbucket") {
        plugins.push(rehypeSlug)
        plugins.push(rehypeHighlight)
      }
      if (platform === "github" || platform === "gitlab") {
        plugins.push(rehypeKatex)
      }
      return plugins
    }, [platform])

    return (
      <ScrollArea className="h-full">
        <div
          ref={ref}
          className="prose prose-sm dark:prose-invert mx-auto max-w-none p-6 text-black md:p-8 dark:text-white"
        >
          <ReactMarkdown
            components={{
              h1: ({ children, ...props }) => (
                <Heading as="h1" platform={platform} {...props} className={HEADING_STYLES.h1}>
                  {children}
                </Heading>
              ),
              h2: ({ children, ...props }) => (
                <Heading as="h2" platform={platform} {...props} className={HEADING_STYLES.h2}>
                  {children}
                </Heading>
              ),
              h3: ({ children, ...props }) => (
                <Heading as="h3" platform={platform} {...props} className={HEADING_STYLES.h3}>
                  {children}
                </Heading>
              ),
              h4: ({ children, ...props }) => (
                <Heading as="h4" platform={platform} {...props} className={HEADING_STYLES.h4}>
                  {children}
                </Heading>
              ),
              h5: ({ children, ...props }) => (
                <Heading as="h5" platform={platform} {...props} className={HEADING_STYLES.h5}>
                  {children}
                </Heading>
              ),
              h6: ({ children, ...props }) => (
                <Heading as="h6" platform={platform} {...props} className={HEADING_STYLES.h6}>
                  {children}
                </Heading>
              ),
              strong: ({ children, ...props }) => (
                <strong {...props} className="text-foreground font-bold">
                  {children}
                </strong>
              ),
              em: ({ children, ...props }) => (
                <em {...props} className="italic">
                  {children}
                </em>
              ),
              del: ({ children, ...props }) => (
                <del {...props} className="text-muted-foreground">
                  {children}
                </del>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className
                const codeValue = Array.isArray(children) ? children.join("") : children

                // Show a colour swatch next to inline hex/rgb/hsl values
                let color = null
                if (typeof codeValue === "string") {
                  if (COLOR_HEX_RE.test(codeValue)) color = codeValue
                  else if (COLOR_RGB_RE.test(codeValue)) color = codeValue
                  else if (COLOR_HSL_RE.test(codeValue)) color = codeValue
                }
                if (isInline) {
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <code className={`md-hover-label-inline ${CODE_STYLES.inline}`} {...props}>
                        {children}
                        {color && (
                          <span
                            aria-label={`Color preview for ${color}`}
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: color,
                              marginLeft: "0.4em",
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      </code>
                    </span>
                  )
                }
                return (
                  <code className={`${className} font-mono text-sm`} {...props}>
                    {children}
                  </code>
                )
              },
              a: ({ ...props }) => (
                <a
                  {...props}
                  className={`md-hover-label-inline ${LINK_STYLE}`}
                  rel="noopener noreferrer"
                  target="_blank"
                />
              ),
              img: ({ ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  {...props}
                  alt={props.alt || ""}
                  className={`md-hover-label-inline ${IMAGE_STYLE}`}
                  loading="lazy"
                />
              ),
              ul: ({ className, children, ...props }) => {
                const isTaskList = className?.includes("contains-task-list")
                const isPlatformTaskList = ["github", "gitlab", "bitbucket"].includes(platform)
                const listClasses = `md-hover-label ${LIST_STYLES.ul} ${isTaskList && isPlatformTaskList ? LIST_STYLES.task : ""}`
                if (isTaskList && !isPlatformTaskList) {
                  if (platform === "standard")
                    return (
                      <ul {...props} className={listClasses}>
                        {children}
                      </ul>
                    )
                  // For platforms that don't support task lists, strip the checkbox
                  // inputs and render items as plain list entries
                  const extractTaskText = (child: ReactNode): ReactNode => {
                    if (typeof child === "string") return child
                    if (isValidElement(child)) {
                      const el = child as ReactElement<{ children?: ReactNode }>
                      const kids = el.props.children
                      if (Array.isArray(kids)) {
                        const filtered = kids.filter((k): k is ReactNode =>
                          isValidElement(k) ? k.type !== "input" : true
                        )
                        return <Fragment key={el.key}>{filtered}</Fragment>
                      }
                      return kids ?? ""
                    }
                    return ""
                  }
                  return (
                    <ul className={listClasses}>
                      {Array.isArray(children) ? (
                        children.map((child, idx) => {
                          const c = extractTaskText(child)
                          return c ? (
                            <li key={idx} className={LIST_STYLES.item}>
                              {c}
                            </li>
                          ) : null
                        })
                      ) : (
                        <li className={LIST_STYLES.item}>{children}</li>
                      )}
                    </ul>
                  )
                }
                return (
                  <ul {...props} className={listClasses}>
                    {children}
                  </ul>
                )
              },
              ol: ({ ...props }) => (
                <ol {...props} className={`md-hover-label ${LIST_STYLES.ol}`} />
              ),
              li: ({ children, ...props }) => {
                // On the standard platform, render task list markers as plain text
                // since checkboxes are not supported
                if (platform === "standard" && children) {
                  let marker = ""
                  const filter = (child: ReactNode): ReactNode => {
                    if (isTaskElement(child)) {
                      if (child.type === "input") {
                        marker = child.props.checked ? "[X] " : "[ ] "
                        return null
                      }
                      if (child.props.children) {
                        const kids = child.props.children
                        return cloneElement(
                          child,
                          { ...child.props },
                          Array.isArray(kids) ? kids.map(filter) : filter(kids)
                        )
                      }
                    }
                    return child
                  }
                  const filtered = Array.isArray(children) ? children.map(filter) : filter(children)
                  return (
                    <li {...props} className={LIST_STYLES.item}>
                      {marker}
                      {filtered}
                    </li>
                  )
                }
                return (
                  <li {...props} className={LIST_STYLES.item}>
                    {children}
                  </li>
                )
              },
              blockquote: ({ className, children, node, ...props }) => {
                const classStr = String(className || "")
                const hastNode = node as unknown as HastNode | undefined

                if (classStr.includes("gitlab-alert")) {
                  let alertType: GitlabAlertType = "note"
                  for (const t of GITLAB_ALERT_TYPES) {
                    if (classStr.includes(`gitlab-alert-${t}`)) {
                      alertType = t
                      break
                    }
                  }
                  const rawTitle = (props as Record<string, unknown>)["data-title"]
                  const title = typeof rawTitle === "string" ? rawTitle : ""
                  return renderAlert(alertType, title || alertType, children, "gitlab", props)
                }

                if (classStr.includes("github-alert")) {
                  let alertType: GitlabAlertType = "note"
                  if (classStr.includes("github-alert-tip")) alertType = "tip"
                  else if (classStr.includes("github-alert-important")) alertType = "important"
                  else if (classStr.includes("github-alert-warning")) alertType = "warning"
                  else if (classStr.includes("github-alert-caution")) alertType = "caution"
                  return renderAlert(alertType, alertType, children, "github", props)
                }

                if (platform === "gitlab" && hastNode) {
                  // Suppress empty triple-chevron blockquotes with no alert type
                  if (isEmptyTripleFenceHast(hastNode)) return null

                  const parsed = parseFencedAlertFromHast(hastNode)
                  if (parsed) {
                    const { alertType, title, bodyText } = parsed
                    const body = bodyText ? <p>{bodyText}</p> : null
                    return renderAlert(alertType, title, body, "gitlab", props)
                  }
                }

                return (
                  <blockquote {...props} className={`md-hover-label ${BLOCKQUOTE_STYLE}`}>
                    {children}
                  </blockquote>
                )
              },
              div: ({ className, children, ...props }) => {
                const classStr = String(className || "")

                if (classStr.includes("gitlab-frontmatter")) {
                  const raw = (props as Record<string, unknown>)["data-fm"]
                  let pairs: { key: string; value: string }[] = []
                  if (typeof raw === "string") {
                    try {
                      pairs = JSON.parse(raw)
                    } catch {
                      /* ignore */
                    }
                  }
                  if (!pairs.length) return null
                  return (
                    <div className="md-hover-label border-border bg-muted/30 my-4 overflow-hidden rounded-lg border text-sm">
                      <div className="bg-muted/60 border-border text-muted-foreground border-b px-4 py-2 font-mono text-xs font-semibold tracking-wide uppercase">
                        Front Matter
                      </div>
                      <table className="w-full">
                        <tbody>
                          {pairs.map(({ key, value }) => (
                            <tr key={key} className="border-border border-b last:border-0">
                              <td className="text-foreground w-1/3 px-4 py-2 align-top font-mono font-semibold">
                                {key}
                              </td>
                              <td className="text-muted-foreground px-4 py-2 align-top font-mono break-all">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }

                if (
                  classStr.includes("toc-placeholder") &&
                  (platform === "gitlab" || platform === "bitbucket")
                ) {
                  const headings = extractHeadings(content)
                  if (!headings.length) return null
                  const minDepth = Math.min(...headings.map((h) => h.depth))
                  return (
                    <nav
                      aria-label="Table of Contents"
                      className="md-hover-label border-border bg-muted/20 my-4 rounded-lg border px-5 py-4"
                    >
                      <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                        Table of Contents
                      </p>
                      <ol className="m-0 list-none space-y-1 p-0">
                        {headings.map((h, i) => (
                          <li key={i} style={{ paddingLeft: `${(h.depth - minDepth) * 16}px` }}>
                            <a
                              className={`text-sm underline-offset-2 hover:underline ${LINK_STYLE}`}
                              href={`#${h.id}`}
                            >
                              {h.text}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )
                }

                return (
                  <div
                    {...props}
                    className={
                      classStr.includes("gitlab-inline-diff-add")
                        ? "my-1 block rounded bg-green-500/15 px-2 py-1 text-green-800 dark:text-green-300"
                        : classStr.includes("gitlab-inline-diff-del")
                          ? "my-1 block rounded bg-red-500/15 px-2 py-1 text-red-800 dark:text-red-300"
                          : className || ""
                    }
                  >
                    {children}
                  </div>
                )
              },
              hr: () => <hr className={`md-hover-label ${HR_STYLE}`} />,
              pre: ({ className, children, node, ...props }) => {
                let lang = ""
                const fc = node?.children?.[0]
                if (fc?.type === "element" && fc.tagName === "code") {
                  const cc = fc.properties?.className || []
                  const m = /language-(\w+)/.exec(
                    Array.isArray(cc) ? cc.map(String).join(" ") : String(cc)
                  )
                  if (m) lang = m[1].toLowerCase()
                }
                // Render a labelled preview block for special fenced languages
                // instead of a standard code block
                if (
                  lang &&
                  ["mermaid", "geojson", "topojson", "stl"].includes(lang) &&
                  (platform === "github" || platform === "gitlab")
                ) {
                  return (
                    <div
                      className={`md-hover-label border-border bg-muted/10 my-4 overflow-hidden rounded-lg border ${className || ""}`}
                    >
                      <div className="bg-muted text-muted-foreground border-border flex items-center gap-2 border-b px-4 py-2 text-xs font-semibold uppercase">
                        {lang === "mermaid" ? (
                          <Workflow className="h-4 w-4" />
                        ) : lang === "geojson" || lang === "topojson" ? (
                          <MapIcon className="h-4 w-4" />
                        ) : lang === "stl" ? (
                          <Box className="h-4 w-4" />
                        ) : null}
                        {lang} Preview (Simulated)
                      </div>
                      <pre className="text-foreground/80 bg-background/50 m-0 overflow-auto rounded-none border-0 p-4 font-mono text-sm">
                        {children}
                      </pre>
                    </div>
                  )
                }
                return (
                  <pre {...props} className={`md-hover-label ${CODE_STYLES.block}`}>
                    {children}
                  </pre>
                )
              },
              summary: ({ ...props }) => (
                <summary
                  {...props}
                  className="bg-muted/30 text-foreground hover:bg-muted/50 cursor-pointer px-4 py-2.5 font-medium transition-colors select-none"
                />
              ),
              sup: ({ ...props }) => (
                <sup {...props} className="md-hover-label-inline text-primary text-xs" />
              ),
              table: ({ ...props }) => {
                if (!["github", "gitlab", "bitbucket"].includes(platform)) return props.children
                return (
                  <div className={`md-hover-label ${TABLE_STYLES.wrapper}`}>
                    <table {...props} className={TABLE_STYLES.table} />
                  </div>
                )
              },
              thead: ({ ...props }) => {
                if (!["github", "gitlab", "bitbucket"].includes(platform)) return props.children
                return <thead {...props} className={TABLE_STYLES.thead} />
              },
              tbody: ({ ...props }) => {
                if (!["github", "gitlab", "bitbucket"].includes(platform)) return props.children
                return <tbody {...props} className={TABLE_STYLES.tbody} />
              },
              tr: ({ ...props }) => {
                if (!["github", "gitlab", "bitbucket"].includes(platform)) return props.children
                return <tr {...props} className={TABLE_STYLES.tr} />
              },
              th: ({ ...props }) => {
                if (!["github", "gitlab", "bitbucket"].includes(platform)) return props.children
                return <th {...props} className={TABLE_STYLES.th} />
              },
              td: ({ ...props }) => {
                if (!["github", "gitlab", "bitbucket"].includes(platform)) return props.children
                return <td {...props} className={TABLE_STYLES.td} />
              },
              dl: ({ children }) => (
                <dl className="border-muted-foreground my-6 space-y-4 border-l-2 pl-4">
                  {children}
                </dl>
              ),
              dt: ({ children }) => (
                <dt className="text-foreground mb-1 font-semibold">{children}</dt>
              ),
              dd: ({ children }) => <dd className="text-muted-foreground ml-4">{children}</dd>,
            }}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            remarkRehypeOptions={{ handlers: { ...defListHastHandlers } }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    )
  }
)
