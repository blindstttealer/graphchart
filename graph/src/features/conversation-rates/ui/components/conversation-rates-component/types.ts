import { Variation } from "../../../../../shared/types";

export interface DailyData {
  date: string;
  visits: { [variationId: string]: number };
  conversions: { [variationId: string]: number };
}

export interface TestData {
  variations: Variation[];
  data: DailyData[];
}



export type LineStyle = "line" | "smooth" | "area";

export type ThemeMode = "light" | "dark";

export interface EnhancedVariation extends Variation {
  stableId: string;
}