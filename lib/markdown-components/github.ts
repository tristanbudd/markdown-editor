import type { InsertableComponent } from "./index"

export const GITHUB_COMPONENTS: InsertableComponent[] = [
  {
    id: "table",
    label: "Table",
    description: "Insert a table",
    icon: "table",
    template: "| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |",
  },
  {
    id: "task-list",
    label: "Task List",
    description: "Insert a task list",
    icon: "list-task",
    template: "- [ ] Task 1\n- [x] Task 2",
  },
  {
    id: "emoji",
    label: "Emoji",
    description: "Insert an emoji",
    icon: "smile",
    template: ":smile:",
  },
  {
    id: "collapsible-section",
    label: "Collapsible Section",
    description: "Insert a collapsible section",
    icon: "collapse",
    template:
      "<details>\n  <summary>Click to expand</summary>\n\n  Collapsible content goes here.\n\n</details>",
  },
  {
    id: "footnote",
    label: "Footnote",
    description: "Insert a footnote",
    icon: "footnote",
    template: "Here is a footnote reference[^1].\n\n[^1]: Here is the footnote.",
  },
  {
    id: "comment",
    label: "Comment",
    description: "Insert a comment that won't be rendered",
    icon: "comment",
    template: "<!-- This is a comment -->",
  },
  {
    id: "note",
    label: "Note",
    description: "Insert a note block",
    icon: "note",
    template:
      "> [!NOTE]\n> This is a note. Notes are great for highlighting important information or providing additional context.",
  },
  {
    id: "tip",
    label: "Tip",
    description: "Insert a tip block",
    icon: "lightbulb",
    template:
      "> [!TIP]\n> This is a tip. Tips are useful for offering helpful advice or best practices.",
  },
  {
    id: "important",
    label: "Important",
    description: "Insert an important block",
    icon: "important",
    template:
      "> [!IMPORTANT]\n> This is important. Use important blocks to emphasize critical information that users must pay attention to.",
  },
  {
    id: "warning",
    label: "Warning",
    description: "Insert a warning block",
    icon: "warning",
    template:
      "> [!WARNING]\n> This is a warning. Warnings should be used to alert readers about potential issues or important considerations.",
  },
  {
    id: "caution",
    label: "Caution",
    description: "Insert a caution block",
    icon: "caution",
    template:
      "> [!CAUTION]\n> This is a caution. Cautions are ideal for advising readers about risks or negative outcomes associated with certain actions.",
  },
  {
    id: "inline-math",
    label: "Inline Math",
    description: "Insert inline math formula",
    icon: "math",
    template: "$E=mc^2$",
  },
  {
    id: "math-block",
    label: "Math Block",
    description: "Insert a math block",
    icon: "math-block",
    template: "$$\nE=mc^2\n$$",
  },
  {
    id: "diagram",
    label: "Diagram",
    description: "Insert a Mermaid diagram",
    icon: "diagram",
    template: "```mermaid\ngraph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n  C-->D;\n```",
  },
  {
    id: "geojson",
    label: "GeoJSON",
    description: "Insert a GeoJSON map",
    icon: "map",
    template:
      '```geojson\n{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {},\n      "geometry": {\n        "type": "Point",\n        "coordinates": [0, 0]\n      }\n    }\n  ]\n}\n```',
  },
  {
    id: "topojson",
    label: "TopoJSON",
    description: "Insert a TopoJSON map",
    icon: "map",
    template:
      '```topojson\n{\n  "type": "Topology",\n  "objects": {},\n  "arcs": [],\n  "transform": {}\n}\n```',
  },
  {
    id: "stl3d",
    label: "STL 3D Model",
    description: "Insert a 3D model in STL format",
    icon: "cube",
    template:
      "```stl\nsolid cube\n  facet normal 0 0 1\n    outer loop\n      vertex 0 0 0\n      vertex 1 0 0\n      vertex 1 1 0\n    endloop\n  endfacet\nendsolid cube\n```",
  },
]
