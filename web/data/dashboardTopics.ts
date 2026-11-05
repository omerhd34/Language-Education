import { grammarHeadings, type GrammarHeading } from "@/data/grammarHeading";

export type CefrLevel = "Başlangıç" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type DashboardSubtopic = {
  id: string;
  title: string;
  titleEng: string;
  titleEx: string;
  progress: number;
};

export type DashboardTopic = {
  id: string;
  title: string;
  titleEng: string;
  titleEx: string;
  level: CefrLevel;
  isExam?: boolean;
  subtopics: DashboardSubtopic[];
};

const levelExamSeeds: GrammarHeading[] = [
  {
    id: "122",
    level: "Başlangıç",
    title: "Başlangıç Yeterlilik Sınavı",
    titleEng: "Starter Proficiency Exam",
    titleEx: "Starter Proficiency Exam",
  },
  {
    id: "123",
    level: "A1",
    title: "A1 Yeterlilik Sınavı",
    titleEng: "A1 Proficiency Exam",
    titleEx: "A1 Proficiency Exam",
  },
  {
    id: "124",
    level: "A2",
    title: "A2 Yeterlilik Sınavı",
    titleEng: "A2 Proficiency Exam",
    titleEx: "A2 Proficiency Exam",
  },
  {
    id: "125",
    level: "B1",
    title: "B1 Yeterlilik Sınavı",
    titleEng: "B1 Proficiency Exam",
    titleEx: "B1 Proficiency Exam",
  },
  {
    id: "126",
    level: "B2",
    title: "B2 Yeterlilik Sınavı",
    titleEng: "B2 Proficiency Exam",
    titleEx: "B2 Proficiency Exam",
  },
  {
    id: "127",
    level: "C1",
    title: "C1 Yeterlilik Sınavı",
    titleEng: "C1 Proficiency Exam",
    titleEx: "C1 Proficiency Exam",
  },
  {
    id: "128",
    level: "C2",
    title: "C2 Yeterlilik Sınavı",
    titleEng: "C2 Proficiency Exam",
    titleEx: "C2 Proficiency Exam",
  },
];

function toTopic(seed: GrammarHeading, isExam = false): DashboardTopic {
  return {
    id: seed.id,
    title: seed.title,
    titleEng: seed.titleEng,
    titleEx: seed.titleEx,
    level: seed.level,
    isExam: isExam || undefined,
    subtopics: [
      {
        id: `${seed.id}-1`,
        title: seed.title,
        titleEng: seed.titleEng,
        titleEx: seed.titleEx,
        progress: 0,
      },
    ],
  };
}

const grammarTopics = grammarHeadings.map((seed) => toTopic(seed));
const levelExams = levelExamSeeds.map((seed) => toTopic(seed, true));

export const dashboardTopics: DashboardTopic[] = [
  ...grammarTopics.filter((topic) => topic.level === "Başlangıç"),
  ...levelExams.filter((topic) => topic.level === "Başlangıç"),
  ...grammarTopics.filter((topic) => topic.level === "A1"),
  ...levelExams.filter((topic) => topic.level === "A1"),
  ...grammarTopics.filter((topic) => topic.level === "A2"),
  ...levelExams.filter((topic) => topic.level === "A2"),
  ...grammarTopics.filter((topic) => topic.level === "B1"),
  ...levelExams.filter((topic) => topic.level === "B1"),
  ...grammarTopics.filter((topic) => topic.level === "B2"),
  ...levelExams.filter((topic) => topic.level === "B2"),
  ...grammarTopics.filter((topic) => topic.level === "C1"),
  ...levelExams.filter((topic) => topic.level === "C1"),
  ...grammarTopics.filter((topic) => topic.level === "C2"),
  ...levelExams.filter((topic) => topic.level === "C2"),
];

export function getDashboardTopicById(
  topicId: string,
): DashboardTopic | undefined {
  return dashboardTopics.find((topic) => topic.id === topicId);
}

export function getTopicTitleEx(topicId: string, fallback = ""): string {
  return getDashboardTopicById(topicId)?.titleEx ?? fallback;
}
