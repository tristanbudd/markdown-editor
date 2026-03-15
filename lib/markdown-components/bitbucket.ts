import type { InsertableComponent } from "./index"

export const BITBUCKET_COMPONENTS: InsertableComponent[] = [
  {
    id: "table-bb",
    label: "Table",
    description: "Insert a table",
    icon: "table",
    template: "| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n",
  },
  {
    id: "footnote-bb",
    label: "Footnote",
    description: "Insert a footnote",
    icon: "footnote",
    template:
      "Here is a statement that needs a footnote.[^1]\n\n[^1]: This is the footnote content.\n\n",
  },
  {
    id: "toc-bb",
    label: "Table of Contents",
    description: "Insert a table of contents",
    icon: "table",
    template: "[TOC]\n\n",
  },
]
