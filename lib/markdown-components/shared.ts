import type { InsertableComponent } from "./index"

export const SHARED_COMPONENTS: InsertableComponent[] = [
  {
    id: "heading-1",
    label: "Heading 1",
    description: "Large section heading",
    icon: "heading-1",
    template: "# Heading 1\n",
  },
  {
    id: "heading-2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: "heading-2",
    template: "## Heading 2\n",
  },
  {
    id: "heading-3",
    label: "Heading 3",
    description: "Small section heading",
    icon: "heading-3",
    template: "### Heading 3\n",
  },
]
