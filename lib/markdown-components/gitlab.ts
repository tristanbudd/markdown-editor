import type { InsertableComponent } from "./index"

export const GITLAB_COMPONENTS: InsertableComponent[] = [
  {
    id: "inline-diff",
    label: "Inline Diff",
    description: "Insert an inline diff",
    icon: "diff",
    template: "{+ added feature +}\n{- removed feature -}\n",
  },
  {
    id: "description-list",
    label: "Description List",
    description: "Insert a description list",
    icon: "list",
    template: "Term 1\n: Definition 1\n\nTerm 2\n: Definition 2\n\n",
  },
  {
    id: "task-list-gl",
    label: "Task List",
    description: "Insert a task list",
    icon: "list-task",
    template: "- [ ] Task 1\n- [~] Task 2\n- [x] Task 3\n",
  },
]
