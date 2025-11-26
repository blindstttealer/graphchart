import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import styles from "./styles.module.css";
import { ProcessedData } from "../../../../../shared/types";
import { ThemeMode } from "../conversation-rates-component/types";
import { CustomTooltip } from "../../../../../components/tooltip/Tooltip";
import { CurveType } from "recharts/types/shape/Curve";
import { colors } from "./const ";
import { EnhancedVariation } from "../conversation-rates-component/types"; 
import { getYAxisDomain } from "./utils";

export interface LineChartProps {
  data: ProcessedData[];
  variations: EnhancedVariation[];
  selectedVariations: string[];
  lineStyle: CurveType;
  themeMode: ThemeMode;
  isZoomActive: boolean;
  zoomArea: { left: string; right: string } | null;
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: () => void;
  chartRef: React.RefObject<any>;
  width?: number | `${number}%`; 
  height?: number;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  variations,
  selectedVariations,
  lineStyle,
  themeMode,
  isZoomActive,
  zoomArea,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  chartRef,
  height = 500,
  width = '100%',
}) => {
  const visibleVariations = variations.filter(
    (v) => selectedVariations.includes(v.stableId) 
  );

  const yAxisDomain = getYAxisDomain(data, selectedVariations); 

  return (
    <div className={`${styles.chartContainer} ${styles[themeMode]}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart
          ref={chartRef}
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{ cursor: isZoomActive ? "crosshair" : "default" }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={yAxisDomain} 
            tickFormatter={(value) => `${value}%`}
            allowDataOverflow={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {zoomArea && (
            <ReferenceArea
              x1={zoomArea.left}
              x2={zoomArea.right}
              strokeOpacity={0.3}
            />
          )}

          {visibleVariations.map((variation, index) => {
            const key = variation.stableId; 
            const color = colors[index % colors.length];

            return (
              <Line
                key={key}
                type={lineStyle}
                dataKey={key}
                name={variation.name}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                connectNulls
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
