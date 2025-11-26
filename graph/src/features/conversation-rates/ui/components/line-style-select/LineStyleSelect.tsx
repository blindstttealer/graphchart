import React from "react";
import { Select, Option } from "@admiral-ds/react-ui";
import { StringCurveType, CURVE_OPTIONS } from "../header-controls/const";

interface LineStyleSelectProps {
  value: StringCurveType;
  onChange: (value: StringCurveType) => void;
}

export const LineStyleSelect: React.FC<LineStyleSelectProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (newValue: string | Array<string>) => {
    if (typeof newValue === "string") {
      const isValidCurveType = CURVE_OPTIONS.some(
        (opt) => opt.value === newValue
      );
      if (isValidCurveType) {
        onChange(newValue as StringCurveType);
      }
    }
  };

  return (
    <Select
      value={value}
      onSelectedChange={handleChange}
      dimension="s"
      placeholder="Select line style"
    >
      {CURVE_OPTIONS.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};
