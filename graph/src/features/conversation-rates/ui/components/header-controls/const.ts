import { CurveType } from "recharts/types/shape/Curve";
import { CurveFactory } from "victory-vendor/d3-shape";
export type StringCurveType = Exclude<CurveType, CurveFactory>;

export const CURVE_OPTIONS: Array<{ value: StringCurveType; label: string }> = [
  { value: "linear", label: "Linear" },
  { value: "monotone", label: "Smooth (Monotone)" },
  { value: "monotoneX", label: "Monotone X" },
  { value: "monotoneY", label: "Monotone Y" },
  { value: "natural", label: "Natural" },
  { value: "basis", label: "Basis" },
  { value: "basisClosed", label: "Basis Closed" },
  { value: "basisOpen", label: "Basis Open" },
  { value: "bump", label: "Bump" },
  { value: "bumpX", label: "Bump X" },
  { value: "bumpY", label: "Bump Y" },
  { value: "step", label: "Step" },
  { value: "stepBefore", label: "Step Before" },
  { value: "stepAfter", label: "Step After" },
  { value: "linearClosed", label: "Linear Closed" },
];
