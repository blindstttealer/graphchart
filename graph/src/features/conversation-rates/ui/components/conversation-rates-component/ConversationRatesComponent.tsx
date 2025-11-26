import React, { useState, useMemo, useEffect, useRef } from "react";

import styles from "./styles.module.css";
import { TestData, ThemeMode } from "./types";
import { HeaderControls } from "../header-controls";
import { LineChartComponent } from "../line-chart/LineChart";
import { StringCurveType } from "../header-controls/const";
import {
  aggregateWeeklyData,
  enhanceVariationsWithIds,
  getAvailableVariationIds,
  processData,
} from "../line-chart/utils";
import { Variation } from "../../../../../shared/types";
import { toPng } from "html-to-image";

export const ConversationRatesComponent: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("day");
  const [selectedVariations, setSelectedVariations] = useState<string[]>([]);
  const [lineStyle, setLineStyle] = useState<StringCurveType>("linear");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enhancedVariations, setEnhancedVariations] = useState<
    Array<Variation & { stableId: string }>
  >([]);

  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomArea, setZoomArea] = useState<{
    left: string;
    right: string;
  } | null>(null);
  const [zoomHistory, setZoomHistory] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);

  const chartRef = useRef<any>(null);
  const targetZoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data.json");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const enhancedVars = enhanceVariationsWithIds(data.variations);
        setEnhancedVariations(enhancedVars);
        setTestData(data);

        const allVariationIds = getAvailableVariationIds(enhancedVars);
        console.log("allVariationIds", allVariationIds);
        setSelectedVariations(allVariationIds);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processedData = useMemo(() => {
    if (!testData || !enhancedVariations.length) return [];
    const dailyData = processData(testData.data, enhancedVariations);
    return timeRange === "day"
      ? dailyData
      : aggregateWeeklyData(dailyData, enhancedVariations, testData.data);
  }, [timeRange, testData, enhancedVariations]);

  useEffect(() => {
    if (processedData.length > 0) {
      setData(processedData);
      setZoomHistory([processedData]);
    }
  }, [processedData]);

  const handleZoom = () => {
    if (!isZoomActive) {
      setIsZoomActive(true);
    }
  };

  const handleResetZoom = () => {
    setData(processedData);
    setZoomArea(null);
    setIsZoomActive(false);
    setZoomHistory([processedData]);
  };

  const handleMouseDown = (e: any) => {
    if (!isZoomActive || !e) return;

    const activeLabel = e.activeLabel;
    if (activeLabel) {
      setZoomArea({
        left: activeLabel,
        right: activeLabel,
      });
      console.log(" Zoom area started:", activeLabel);
    } else {
      console.log(" No active label found");
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isZoomActive || !zoomArea || !e) return;

    const activeLabel = e.activeLabel;
    if (activeLabel && zoomArea.left !== activeLabel) {
      setZoomArea({
        ...zoomArea,
        right: activeLabel,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isZoomActive || !zoomArea) return;

    const { left, right } = zoomArea;

    if (left === right) {
      setZoomArea(null);
      return;
    }

    const leftIndex = data.findIndex((item) => item.date === left);
    const rightIndex = data.findIndex((item) => item.date === right);

    if (leftIndex !== -1 && rightIndex !== -1) {
      const start = Math.min(leftIndex, rightIndex);
      const end = Math.max(leftIndex, rightIndex);
      const zoomedData = data.slice(start, end + 1);

      setData(zoomedData);
      setZoomHistory((prev) => [...prev, zoomedData]);
    }

    setZoomArea(null);
    setIsZoomActive(false);
  };

  const handleExportPNG = async () => {
      const chartElement = document.querySelector(
        ".chartContainer"
      ) as HTMLElement;

      if (chartElement) {
        try {
          const dataUrl = await toPng(chartElement, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: themeMode === "dark" ? "#2d2d2d" : "#ffffff",
            style: {
              transform: "scale(1)",
            },
          });

          const downloadLink = document.createElement("a");
          downloadLink.download = `conversion-rates-${
            new Date().toISOString().split("T")[0]
          }.png`;
          downloadLink.href = dataUrl;
          downloadLink.click();
        } catch (error) {
          console.error("Error exporting PNG:", error);
        }
      } 
  };

  const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeMode(event.target.checked ? "dark" : "light");
  };

  const handleVariationSelect = (value: string | Array<string>) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        setSelectedVariations(value);
      }
    }
  };

  const handleTimeRangeChange = (value: string | Array<string>) => {
    if (typeof value === "string") {
      setTimeRange(value);
      handleResetZoom();
    }
  };

  const handleLineStyleChange = (value: string) => {
    setLineStyle(value as StringCurveType);
  };

  if (loading) return <div className={styles.loading}>Loading data...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!testData) return <div className={styles.error}>No data available</div>;

  return (
    <div className={`${styles.app} ${styles[themeMode]}`} ref={targetZoomRef}>
      {isZoomActive && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: themeMode === "dark" ? "#007AFF" : "#007AFF",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            zIndex: 1000,
            fontSize: "14px",
            fontWeight: "bold",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          🔍 Zoom Mode Active
          {zoomArea && (
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                opacity: 0.9,
              }}
            >
              Drag from {zoomArea.left} to select area
            </div>
          )}
        </div>
      )}
      <HeaderControls
        enhancedVariations={enhancedVariations}
        selectedVariations={selectedVariations}
        timeRange={timeRange}
        lineStyle={lineStyle}
        themeMode={themeMode}
        isZoomActive={isZoomActive}
        zoomHistory={zoomHistory}
        onVariationSelect={handleVariationSelect}
        onTimeRangeChange={handleTimeRangeChange}
        onLineStyleChange={handleLineStyleChange}
        onThemeToggle={handleThemeToggle}
        onZoom={handleZoom}
        onResetZoom={handleResetZoom}
        onExportPNG={handleExportPNG}
        targetZoomRef={targetZoomRef}
      />

      <div className={`${styles.chartContainer} chartContainer`}>
        <LineChartComponent
          data={data}
          variations={enhancedVariations}
          selectedVariations={selectedVariations}
          lineStyle={lineStyle}
          themeMode={themeMode}
          isZoomActive={isZoomActive}
          zoomArea={zoomArea}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          chartRef={chartRef}
        />
      </div>
    </div>
  );
};
