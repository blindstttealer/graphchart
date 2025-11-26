import { ProcessedData, Variation } from "../../../../../shared/types";
import { DailyData } from "../conversation-rates-component/types";
import { v4 as uuidv4 } from "uuid";

export const enhanceVariationsWithIds = (
  variations: Variation[]
): Array<Variation & { stableId: string }> => {
  return variations.map((variation) => ({
    ...variation,
    stableId: variation.id?.toString() || uuidv4(),
  }));
};

export const processData = (
  data: DailyData[],
  variations: Array<Variation & { stableId: string }>
): ProcessedData[] => {
  return data.map((daily) => {
    const formattedDate = formatDailyDate(daily.date);

    const processed: ProcessedData = { date: formattedDate };

    variations.forEach((variation) => {
      const key = variation.stableId;

      const visits =
        daily.visits[key] || daily.visits[variation.id?.toString() || "0"] || 0;
      const conversions =
        daily.conversions[key] ||
        daily.conversions[variation.id?.toString() || "0"] ||
        0;

      const conversionRate = visits > 0 ? (conversions / visits) * 100 : 0;

      processed[key] = parseFloat(conversionRate.toFixed(2));
    });

    return processed;
  });
};

const formatDailyDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.getDate().toString().padStart(2, "0");
  } catch {
    return dateStr;
  }
};

export const aggregateWeeklyData = (
  data: ProcessedData[],
  variations: Array<Variation & { stableId: string }>,
  originalData: DailyData[]
): ProcessedData[] => {
  const weeklyData: ProcessedData[] = [];

  for (let i = 0; i < data.length; i += 7) {
    const week = data.slice(i, i + 7);
    const originalWeek = originalData.slice(i, i + 7);
    if (!week.length) continue;


    const startDateStr = originalWeek[0]?.date;
    const endDateStr = originalWeek.at(-1)?.date;

    const startDay = startDateStr ? new Date(startDateStr).getDate() : 1;
    const endDay = endDateStr ? new Date(endDateStr).getDate() : 7;

    const point: ProcessedData = {
      date: `(${startDay}-${endDay})`,
    };

    variations.forEach((v) => {
      const key = v.stableId;
      const rates = week.map((d) => +d[key]).filter((r) => !isNaN(r));
      point[key] = rates.length
        ? +(rates.reduce((a, b) => a + b) / rates.length).toFixed(2)
        : 0;
    });

    weeklyData.push(point);
  }

  return weeklyData;
};

export const getAvailableVariationIds = (
  enhancedVariations: Array<Variation & { stableId: string }>
): string[] => {
  const ids = new Set<string>();

  enhancedVariations.forEach((v) => ids.add(v.stableId));

  return Array.from(ids);
};

export const getYAxisDomain = (
  data: ProcessedData[],
  selectedVariations: string[]
): [number, number] => {
  if (!data.length || !selectedVariations.length) return [0, 10];

  let min = Infinity;
  let max = -Infinity;

  data.forEach((item) => {
    selectedVariations.forEach((key) => {
      const value = Number(item[key]);
      if (!isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
  });

  if (min === Infinity || max === -Infinity) return [0, 10];

  const padding = (max - min) * 0.1;

  return [
    Math.max(0, parseFloat((min - padding).toFixed(2))),
    parseFloat((max + padding).toFixed(2)),
  ];
};
