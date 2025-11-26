import React from "react";
import styles from "./styles.module.css";
import { formatDate, formatValue } from "./utils";

interface CustomTooltipProps {
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  payload,
  label,
}) => {
  return (
    <div className={styles.customTooltip}>
      <div className={styles.tooltipHeader}>
        <div className={styles.tooltipDate}>
          {label ? formatDate(label) : "No date"}
        </div>
      </div>

      <div className={styles.tooltipList}>
        {payload?.map((entry, index) => (
          <div key={index} className={styles.tooltipItem}>
            <div className={styles.tooltipVariation}>
              <div
                className={styles.tooltipColor}
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </div>
            <div className={styles.tooltipValue}>
              {formatValue(entry.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
