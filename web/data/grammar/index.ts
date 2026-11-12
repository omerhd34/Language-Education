import type { TopicContent } from "@/data/grammar/types";
import { topicContent1 } from "@/data/grammar/1";
import { topicContent2 } from "@/data/grammar/2";
import { topicContent3 } from "@/data/grammar/3";
import { topicContent4 } from "@/data/grammar/4";
import { topicContent5 } from "@/data/grammar/5";
import { topicContent6 } from "@/data/grammar/6";
import { topicContent7 } from "@/data/grammar/7";
import { topicContent8 } from "@/data/grammar/8";
import { topicContent9 } from "@/data/grammar/9";
import { topicContent10 } from "@/data/grammar/10";
import { topicContent11 } from "@/data/grammar/11";
import { topicContent123 } from "@/data/grammar/exam/123";
import { topicContent12 } from "@/data/grammar/12";
import { topicContent13 } from "@/data/grammar/13";
import { topicContent14 } from "@/data/grammar/14";
import { topicContent15 } from "@/data/grammar/15";
import { topicContent16 } from "@/data/grammar/16";
import { topicContent17 } from "@/data/grammar/17";
import { topicContent18 } from "@/data/grammar/18";
import { topicContent124 } from "@/data/grammar/exam/124";
import { topicContent19 } from "@/data/grammar/19";
import { topicContent20 } from "@/data/grammar/20";
import { topicContent21 } from "@/data/grammar/21";
import { topicContent22 } from "@/data/grammar/22";
import { topicContent23 } from "@/data/grammar/23";
import { topicContent24 } from "@/data/grammar/24";
import { topicContent125 } from "@/data/grammar/exam/125";
import { topicContent25 } from "@/data/grammar/25";
import { topicContent26 } from "@/data/grammar/26";
import { topicContent27 } from "@/data/grammar/27";
import { topicContent28 } from "@/data/grammar/28";
import { topicContent29 } from "@/data/grammar/29";
import { topicContent126 } from "@/data/grammar/exam/126";
import { topicContent30 } from "@/data/grammar/30";
import { topicContent31 } from "@/data/grammar/31";
import { topicContent32 } from "@/data/grammar/32";
import { topicContent33 } from "@/data/grammar/33";
import { topicContent34 } from "@/data/grammar/34";
import { topicContent35 } from "@/data/grammar/35";
import { topicContent127 } from "@/data/grammar/exam/127";
import { topicContent36 } from "@/data/grammar/36";
import { topicContent37 } from "@/data/grammar/37";
import { topicContent38 } from "@/data/grammar/38";
import { topicContent39 } from "@/data/grammar/39";
import { topicContent40 } from "@/data/grammar/40";
import { topicContent128 } from "@/data/grammar/exam/128";

const topicContentById: Record<string, TopicContent> = {
  "1": topicContent1,
  "2": topicContent2,
  "3": topicContent3,
  "4": topicContent4,
  "5": topicContent5,
  "6": topicContent6,
  "7": topicContent7,
  "8": topicContent8,
  "9": topicContent9,
  "10": topicContent10,
  "11": topicContent11,
  "123": topicContent123,
  "12": topicContent12,
  "13": topicContent13,
  "14": topicContent14,
  "15": topicContent15,
  "16": topicContent16,
  "17": topicContent17,
  "18": topicContent18,
  "124": topicContent124,
  "19": topicContent19,
  "20": topicContent20,
  "21": topicContent21,
  "22": topicContent22,
  "23": topicContent23,
  "24": topicContent24,
  "125": topicContent125,
  "25": topicContent25,
  "26": topicContent26,
  "27": topicContent27,
  "28": topicContent28,
  "29": topicContent29,
  "126": topicContent126,
  "30": topicContent30,
  "31": topicContent31,
  "32": topicContent32,
  "33": topicContent33,
  "34": topicContent34,
  "35": topicContent35,
  "127": topicContent127,
  "36": topicContent36,
  "37": topicContent37,
  "38": topicContent38,
  "39": topicContent39,
  "40": topicContent40,
  "128": topicContent128,
};

export function getTopicContent(topicId: string): TopicContent | null {
  return topicContentById[topicId] ?? null;
}

export function hasTopicContent(topicId: string): boolean {
  return topicId in topicContentById;
}
