import type { VocabularyLevel } from "@/data/vocabulary/types";

/** Keys: `${level}:${originalCategoryId}` before id prefixing. */
export const vocabularyTitleEnByKey: Record<string, string> = {
  "A1:1": "Greetings and Farewells",
  "A1:2": "People",
  "A1:3": "Numbers",
  "A1:4": "Family",
  "A1:5": "Colors",
  "A1:6": "Months and Seasons",
  "A1:7": "Time and Date",
  "A1:8": "Personal Information",
  "A1:9": "Body",
  "A1:11": "Adjectives",
  "A1:12": "Home and Rooms",
  "A1:13": "Furniture and Household Items",
  "A1:14": "Jobs",
  "A1:15": "Clothes and Shoes",
  "A1:16": "Animals",
  "A1:17": "Basic and Useful Verbs",
  "A1:19": "Food and Ingredients",
  "A1:20": "Weather and Nature",
  "A1:21": "School",
  "A1:22": "City",
  "A1:23": "Leisure Activities",
  "A1:24": "Transportation",
  "A1:25": "Directions and Continents",
  "A1:26": "Adverbs and Pronouns",
  "A1:27": "Prepositions and Determiners",
  "A2:1": "Home Appliances and Devices",
  "A2:2": "Clothes and Accessories",
  "A2:3": "Colors and Shapes",
  "A2:4": "Computer and Information",
  "A2:5": "School and Education",
  "A2:6": "Animals",
  "A2:7": "Appearance",
  "A2:8": "Human Body",
  "A2:9": "Conjunctions and Prepositions",
  "A2:10": "Communication",
  "A2:11": "Cinema and Theatre",
};

export function getVocabularyTitleEn(
  level: VocabularyLevel,
  categoryId: string,
): string | undefined {
  return vocabularyTitleEnByKey[`${level}:${categoryId}`];
}
