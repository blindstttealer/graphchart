export interface Variation {
  id?: number;
  name: string;
}

export interface DailyData {
  date: string;
  visits: { [key: string]: number };
  conversions: { [key: string]: number };
}

export interface ProcessedData {
  date: string;
  [key: string]: number | string; 
}

export interface TestData {
  variations: Variation[];
  data: DailyData[];
}
