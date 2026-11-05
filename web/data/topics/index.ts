import type { TopicContent } from "@/data/topics/types";
import { topicContent1 } from "@/data/topics/1";
import { topicContent2 } from "@/data/topics/2";
import { topicContent3 } from "@/data/topics/3";
import { topicContent122 } from "@/data/topics/exam/122";
import { topicContent4 } from "@/data/topics/4";
import { topicContent5 } from "@/data/topics/5";
import { topicContent6 } from "@/data/topics/6";
import { topicContent7 } from "@/data/topics/7";
import { topicContent8 } from "@/data/topics/8";
import { topicContent9 } from "@/data/topics/9";
import { topicContent10 } from "@/data/topics/10";
import { topicContent11 } from "@/data/topics/11";
import { topicContent123 } from "@/data/topics/exam/123";
import { topicContent12 } from "@/data/topics/12";
import { topicContent13 } from "@/data/topics/13";
import { topicContent14 } from "@/data/topics/14";
import { topicContent15 } from "@/data/topics/15";
import { topicContent16 } from "@/data/topics/16";
import { topicContent17 } from "@/data/topics/17";
import { topicContent18 } from "@/data/topics/18";
import { topicContent124 } from "@/data/topics/exam/124";
import { topicContent19 } from "@/data/topics/19";
import { topicContent20 } from "@/data/topics/20";
import { topicContent21 } from "@/data/topics/21";
import { topicContent22 } from "@/data/topics/22";
import { topicContent23 } from "@/data/topics/23";
import { topicContent24 } from "@/data/topics/24";
import { topicContent125 } from "@/data/topics/exam/125";
import { topicContent25 } from "@/data/topics/25";
import { topicContent26 } from "@/data/topics/26";
import { topicContent27 } from "@/data/topics/27";
import { topicContent28 } from "@/data/topics/28";
import { topicContent29 } from "@/data/topics/29";
import { topicContent126 } from "@/data/topics/exam/126";
import { topicContent30 } from "@/data/topics/30";
import { topicContent31 } from "@/data/topics/31";
import { topicContent32 } from "@/data/topics/32";
import { topicContent33 } from "@/data/topics/33";
import { topicContent34 } from "@/data/topics/34";
import { topicContent35 } from "@/data/topics/35";
import { topicContent127 } from "@/data/topics/exam/127";
import { topicContent36 } from "@/data/topics/36";
import { topicContent37 } from "@/data/topics/37";
import { topicContent38 } from "@/data/topics/38";
import { topicContent39 } from "@/data/topics/39";
import { topicContent40 } from "@/data/topics/40";
import { topicContent128 } from "@/data/topics/exam/128";

const topicContentById: Record<string, TopicContent> = {
  "1": topicContent1,
  "2": topicContent2,
  "3": topicContent3,
  "122": topicContent122,
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
