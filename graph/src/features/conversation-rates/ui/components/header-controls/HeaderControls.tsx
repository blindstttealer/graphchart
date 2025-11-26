import React from "react";
import {
  Select,
  Option,
  Button,
  Tooltip as AdmiralTooltip,
  Toggle,
} from "@admiral-ds/react-ui";
import styles from "./styles.module.css";
import { ThemeMode } from "../conversation-rates-component/types";
import { StringCurveType } from "../header-controls/const";
import { LineStyleSelect } from "../line-style-select/LineStyleSelect";
import { Variation } from "../../../../../shared/types";

export interface EnhancedVariation extends Variation {
  stableId: string;
}

interface HeaderControlsProps {
  enhancedVariations: EnhancedVariation[];
  selectedVariations: string[];
  timeRange: string;
  lineStyle: StringCurveType;
  themeMode: ThemeMode;
  isZoomActive: boolean;
  zoomHistory: any[];

  onVariationSelect: (value: string | Array<string>) => void;
  onTimeRangeChange: (value: string | Array<string>) => void;
  onLineStyleChange: (value: StringCurveType) => void;
  onThemeToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onZoom: () => void;
  onResetZoom: () => void;
  onExportPNG: () => void;

  targetZoomRef: React.RefObject<HTMLDivElement | null>;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  enhancedVariations,
  selectedVariations,
  timeRange,
  lineStyle,
  themeMode,
  isZoomActive,
  zoomHistory,
  onVariationSelect,
  onTimeRangeChange,
  onLineStyleChange,
  onThemeToggle,
  onZoom,
  onResetZoom,
  onExportPNG,
  targetZoomRef,
}) => {
  

  return (
    <div className={`${styles.headerControls} ${styles[themeMode]}`}>
      <div className={styles.leftControls}>
        <div className={styles.controlGroup}>
          <Select
            mode="select"
            multiple
            value={selectedVariations}
            onSelectedChange={onVariationSelect}
            placeholder="Select variations"
            className={styles.variationSelect}
            dimension="s"
          >
            {enhancedVariations.map((variation) => {
              const key = variation.stableId;
              return (
                <Option key={key} value={key}>
                  {variation.name}
                </Option>
              );
            })}
          </Select>
        </div>

        <div className={styles.controlGroup}>
          <Select
            value={timeRange}
            onSelectedChange={onTimeRangeChange}
            className={styles.timeRangeSelect}
            dimension="s"
          >
            <Option value="day">Daily</Option>
            <Option value="week">Weekly</Option>
          </Select>
        </div>
      </div>

      <div className={styles.rightControls}>
        <div className={styles.controlGroup}>
          <LineStyleSelect value={lineStyle} onChange={onLineStyleChange} />
        </div>
        <div className={styles.controlGroup}>
          <div className={styles.themeToggle}>
            <span className={styles.themeLabel}>☀️</span>
            <Toggle
              checked={themeMode === "dark"}
              onChange={onThemeToggle}
              dimension="s"
            />
            <span className={styles.themeLabel}>🌙</span>
          </div>
        </div>
        <div className={styles.controlGroup}>
          <div className={styles.advancedControls}>
            <div className={styles.zoomControls}>
              <Button
                dimension="s"
                className={`${styles.zoomButton} ${
                  isZoomActive ? styles.active : ""
                }`}
                onClick={onZoom}
                title="Zoom area (click and drag on chart)"
              >
                🔍
              </Button>
              <Button
                dimension="s"
                className={styles.zoomButton}
                onClick={onResetZoom}
                disabled={zoomHistory.length <= 1}
                title="Reset zoom"
              >
                ⟲
              </Button>
            </div>

            <Button
              dimension="s"
              className={styles.exportButton}
              onClick={onExportPNG}
              title="Export chart as PNG"
            >
              📥 Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
