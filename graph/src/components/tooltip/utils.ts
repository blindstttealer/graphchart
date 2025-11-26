export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatValue = (value: any): string => {
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return "N/A";
  }
  return `${numericValue.toFixed(2).replace(".", ",")}%`;
};
