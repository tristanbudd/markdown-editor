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
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import type { PluggableList, Plugin } from "unified"

import { ScrollArea } from "@/components/ui/scroll-area"

import type { PlatformType } from "./platform-selector"

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
}

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

// Use specific types for unist tree nodes if available, or fallback to an interfac
interface UnistNode {
  type: string
  value?: string
  children?: UnistNode[]
  data?: {
    hProperties?: {
      className?: string
    }
    [key: string]: unknown
  }
}

const remarkEmojis = () => (tree: UnistNode) => {
  const walk = (node: UnistNode) => {
    if (node.type === "text" && node.value) {
      // Avoid replacing inside code blocks if they are parsed as text, though unified stringifies them to code nodes
      node.value = node.value.replace(/:([a-z0-9_+-]+):/g, (match: string, p1: string) => {
        return EMOJI_MAP[p1] || match
      })
    }
    if (node.children) {
      node.children.forEach(walk)
    }
  }
  walk(tree)
}

const remarkGithubAlerts = () => (tree: UnistNode) => {
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
            const alertType = match[1].toLowerCase()
            const remainingText = match[2]

            node.data = node.data || {}
            node.data.hProperties = node.data.hProperties || {}
            node.data.hProperties.className = `github-alert github-alert-${alertType}`

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

const remarkGitlabInlineDiff = () => (tree: UnistNode) => {
  const walk = (node: UnistNode, parent?: UnistNode) => {
    if (node.type === "paragraph" && node.children) {
      const newChildren: UnistNode[] = []

      node.children.forEach((child) => {
        if (child.type === "text" && child.value) {
          const lines = child.value.split(/\r?\n/)

          lines.forEach((line) => {
            const trimmed = line.trim()
            const match = trimmed.match(/^([\[{])([+-])\s(.+?)\s\2([\]}])$/)

            if (match) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [_, open, sign, text, close] = match
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

      if (parent?.children && newChildren.some((child) => child.data?.hName === "div")) {
        const index = parent.children.indexOf(node)
        parent.children.splice(index, 1, ...newChildren)
      }
    }

    if (node.children) {
      node.children.slice().forEach((child) => walk(child, node))
    }
  }
  walk(tree)
}

export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  function MarkdownPreview({ content, platform }, ref) {
    const remarkPlugins = useMemo(() => {
      const plugins: PluggableList = []
      plugins.push(remarkGfm)
      if (platform === "github" || platform === "gitlab") {
        plugins.push(remarkMath)
        plugins.push(remarkEmojis as Plugin)
        plugins.push(remarkGithubAlerts as Plugin)
        if (platform === "gitlab") {
          plugins.push(remarkDefinitionList)
          plugins.push(remarkGitlabInlineDiff as Plugin)
        }
      }
      return plugins
    }, [platform])

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

    const Heading = ({ as: Tag = "h2", children, className = "", id, ...props }: HeadingProps) => {
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

    return (
      <ScrollArea className="h-full">
        <div
          ref={ref}
          className="prose prose-sm dark:prose-invert mx-auto max-w-none p-6 text-black md:p-8 dark:text-white"
        >
          <ReactMarkdown
            components={{
              h1: ({ children, ...props }) => (
                <Heading
                  as="h1"
                  {...props}
                  className="text-foreground border-border mb-4 scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h2: ({ children, ...props }) => (
                <Heading
                  as="h2"
                  {...props}
                  className="text-foreground border-border mt-8 mb-3 scroll-m-20 border-b pb-1.5 text-xl font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h3: ({ children, ...props }) => (
                <Heading
                  as="h3"
                  {...props}
                  className="text-foreground mt-6 mb-2 scroll-m-20 text-lg font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h4: ({ children, ...props }) => (
                <Heading
                  as="h4"
                  {...props}
                  className="text-foreground mt-5 mb-1.5 scroll-m-20 text-base font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h5: ({ children, ...props }) => (
                <Heading
                  as="h5"
                  {...props}
                  className="text-foreground mt-4 mb-1 scroll-m-20 text-sm font-semibold tracking-tight"
                >
                  {children}
                </Heading>
              ),
              h6: ({ children, ...props }) => (
                <Heading
                  as="h6"
                  {...props}
                  className="text-muted-foreground mt-4 mb-1 scroll-m-20 text-sm font-medium tracking-tight"
                >
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
                // Only string children are expected for inline code
                const codeValue = Array.isArray(children) ? children.join("") : children
                // Regex for HEX, RGB, HSL
                const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                const rgbRegex =
                  /^rgb\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/
                const hslRegex =
                  /^hsl\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})%\s*,\s*([0-9]{1,3})%\s*\)$/
                let color = null
                if (typeof codeValue === "string") {
                  if (hexRegex.test(codeValue)) {
                    color = codeValue
                  } else if (rgbRegex.test(codeValue)) {
                    color = codeValue
                  } else if (hslRegex.test(codeValue)) {
                    color = codeValue
                  }
                }
                if (isInline) {
                  return (
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <code
                        className="md-hover-label-inline bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-xs"
                        {...props}
                      >
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
                  className="md-hover-label-inline text-primary hover:text-primary/80 underline underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              ),
              img: ({ ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  {...props}
                  alt={props.alt || ""}
                  className="md-hover-label-inline border-border h-auto max-w-full rounded-lg border"
                  loading="lazy"
                />
              ),
              // TODO: Add support for [~] (strikethrough) on GitLab
              ul: ({ className, children, ...props }) => {
                const isTaskList = className?.includes("contains-task-list")
                const isPlatformTaskList = ["github", "gitlab", "bitbucket"].includes(platform)

                const listClasses = `md-hover-label !mt-6 mb-4 ml-6 space-y-2 ${
                  isTaskList && isPlatformTaskList ? "ml-0 list-none pl-0" : "list-disc"
                }`

                if (isTaskList && !isPlatformTaskList) {
                  if (platform === "standard") {
                    return (
                      <ul {...props} className={listClasses}>
                        {children}
                      </ul>
                    )
                  }
                  const extractTaskText = (child: ReactNode): ReactNode => {
                    if (typeof child === "string") return child

                    if (isValidElement(child)) {
                      // Narrow to a generic props object that includes children
                      const element = child as ReactElement<{ children?: ReactNode }>
                      const { children: kids } = element.props

                      if (Array.isArray(kids)) {
                        const filteredKids = kids.filter((k): k is ReactNode => {
                          if (isValidElement(k)) {
                            return k.type !== "input"
                          }
                          return true
                        })

                        return <Fragment key={element.key}>{filteredKids}</Fragment>
                      }
                      return kids ?? ""
                    }
                    return ""
                  }

                  return (
                    <ul className={listClasses}>
                      {Array.isArray(children) ? (
                        children.map((child, idx) => {
                          const content = extractTaskText(child)
                          return content ? (
                            <li key={idx} className="leading-relaxed">
                              {content}
                            </li>
                          ) : null
                        })
                      ) : (
                        <li className="leading-relaxed">{children}</li>
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
                <ol {...props} className="md-hover-label my-2 ml-4 list-decimal space-y-1" />
              ),
              li: ({ children, ...props }) => {
                if (platform === "standard" && children) {
                  let marker = ""

                  const filterInputsAndMarker = (child: ReactNode): ReactNode => {
                    if (isTaskElement(child)) {
                      if (child.type === "input") {
                        marker = child.props.checked ? "[X] " : "[ ] "
                        return null
                      }

                      if (child.props.children) {
                        const kids = child.props.children
                        const newChildren: ReactNode = Array.isArray(kids)
                          ? kids.map(filterInputsAndMarker)
                          : filterInputsAndMarker(kids)

                        return cloneElement(child, { ...child.props }, newChildren)
                      }
                    }
                    return child
                  }

                  const filteredChildren = Array.isArray(children)
                    ? children.map(filterInputsAndMarker)
                    : filterInputsAndMarker(children)

                  return (
                    <li {...props} className="leading-relaxed">
                      {marker}
                      {filteredChildren}
                    </li>
                  )
                }

                return (
                  <li {...props} className="leading-relaxed">
                    {children}
                  </li>
                )
              },
              blockquote: ({ className, children, ...props }) => {
                const classStr = String(className || "")
                if (classStr.includes("github-alert")) {
                  let alertType: "note" | "tip" | "important" | "warning" | "caution" = "note"
                  if (classStr.includes("github-alert-tip")) alertType = "tip"
                  else if (classStr.includes("github-alert-important")) alertType = "important"
                  else if (classStr.includes("github-alert-warning")) alertType = "warning"
                  else if (classStr.includes("github-alert-caution")) alertType = "caution"

                  const Icon = {
                    note: Info,
                    tip: Lightbulb,
                    important: AlertCircle,
                    warning: AlertTriangle,
                    caution: XOctagon,
                  }[alertType]

                  const colorClass = {
                    note: "border-blue-500 [&>p]:text-foreground bg-blue-500/10",
                    tip: "border-green-500 [&>p]:text-foreground bg-green-500/10",
                    important: "border-purple-500 [&>p]:text-foreground bg-purple-500/10",
                    warning: "border-yellow-500 [&>p]:text-foreground bg-yellow-500/10",
                    caution: "border-red-500 [&>p]:text-foreground bg-red-500/10",
                  }[alertType]

                  const textColorClass = {
                    note: "text-blue-500",
                    tip: "text-green-500",
                    important: "text-purple-500",
                    warning: "text-yellow-500",
                    caution: "text-red-500",
                  }[alertType]

                  return (
                    <blockquote
                      {...props}
                      className={`md-hover-label my-4 border-l-4 px-4 py-3 ${colorClass} rounded-r-lg ${className}`}
                    >
                      <div
                        className={`mb-2 flex items-center gap-2 font-semibold ${textColorClass}`}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span className="capitalize">{alertType}</span>
                      </div>
                      <div className="text-foreground/80">{children}</div>
                    </blockquote>
                  )
                }

                return (
                  <blockquote
                    {...props}
                    className="md-hover-label border-primary/40 text-muted-foreground my-4 border-l-4 pl-4 italic"
                  >
                    {children}
                  </blockquote>
                )
              },
              hr: () => <hr className="md-hover-label border-border my-8" />,
              pre: ({ className, children, node, ...props }) => {
                let lang = ""
                const firstChild = node?.children?.[0]
                if (firstChild?.type === "element" && firstChild.tagName === "code") {
                  const childClass = firstChild.properties?.className || []
                  const match = /language-(\w+)/.exec(
                    Array.isArray(childClass)
                      ? childClass.map(String).join(" ")
                      : String(childClass)
                  )
                  if (match) lang = match[1].toLowerCase()
                }

                if (
                  lang &&
                  ["mermaid", "geojson", "topojson", "stl"].includes(lang) &&
                  (platform === "github" || platform === "gitlab")
                ) {
                  return (
                    <div
                      className={`md-hover-label border-border bg-muted/10 my-4 overflow-hidden rounded-lg border ${
                        className || ""
                      }`}
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
                  <pre
                    {...props}
                    className="md-hover-label border-border bg-muted/50 my-4 overflow-x-auto rounded-lg border p-4 text-sm"
                  >
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
                const isPlatformTable = ["github", "gitlab", "bitbucket"].includes(platform)
                if (!isPlatformTable) return props.children
                return (
                  <div className="md-hover-label my-6 w-full overflow-y-auto">
                    <table {...props} className="w-full overflow-hidden rounded-lg" />
                  </div>
                )
              },
              thead: ({ ...props }) => {
                const isPlatformTable = ["github", "gitlab", "bitbucket"].includes(platform)
                if (!isPlatformTable) return props.children
                return <thead {...props} className="bg-muted/50 border-b" />
              },
              tbody: ({ ...props }) => {
                const isPlatformTable = ["github", "gitlab", "bitbucket"].includes(platform)
                if (!isPlatformTable) return props.children
                return <tbody {...props} className="divide-border divide-y" />
              },
              tr: ({ ...props }) => {
                const isPlatformTable = ["github", "gitlab", "bitbucket"].includes(platform)
                if (!isPlatformTable) return props.children
                return <tr {...props} className="hover:bg-muted/30 transition-colors" />
              },
              th: ({ ...props }) => {
                const isPlatformTable = ["github", "gitlab", "bitbucket"].includes(platform)
                if (!isPlatformTable) return props.children
                return (
                  <th
                    {...props}
                    className="text-foreground border-r px-4 py-3 text-left font-semibold last:border-0"
                  />
                )
              },
              td: ({ ...props }) => {
                const isPlatformTable = ["github", "gitlab", "bitbucket"].includes(platform)
                if (!isPlatformTable) return props.children
                return (
                  <td
                    {...props}
                    className="text-muted-foreground border-r px-4 py-3 last:border-0"
                  />
                )
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
            remarkRehypeOptions={{
              handlers: {
                ...defListHastHandlers,
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    )
  }
)
