import fs from "node:fs";
import path from "node:path";
import { dashboardTopics } from "../data/dashboardTopics";
import { createTopicContent } from "../data/topics/createTopicContent";
import type { TopicContent } from "../data/topics/types";

const dir = path.resolve("data/topics");

function toTs(content: TopicContent, exportName: string): string {
  return `import type { TopicContent } from "@/data/topics/types";

export const ${exportName}: TopicContent = ${JSON.stringify(content, null, 2)};
`;
}

const ids: string[] = [];

for (const topic of dashboardTopics) {
  ids.push(topic.id);

  if (topic.id === "1") {
    continue;
  }

  const content = createTopicContent(topic);
  const exportName = `topicContent${topic.id}`;
  fs.writeFileSync(
    path.join(dir, `${topic.id}.ts`),
    toTs(content, exportName),
    "utf8",
  );
}

const imports = ids
  .map((id) => `import { topicContent${id} } from "@/data/topics/${id}";`)
  .join("\n");

const entries = ids.map((id) => `  "${id}": topicContent${id},`).join("\n");

const index = `import type { TopicContent } from "@/data/topics/types";
${imports}

const topicContentById: Record<string, TopicContent> = {
${entries}
};

export function getTopicContent(topicId: string): TopicContent | null {
  return topicContentById[topicId] ?? null;
}

export function hasTopicContent(topicId: string): boolean {
  return topicId in topicContentById;
}
`;

fs.writeFileSync(path.join(dir, "index.ts"), index, "utf8");
console.log(
  `Wrote ${ids.length - 1} topic files + index (${ids.length} total).`,
);
