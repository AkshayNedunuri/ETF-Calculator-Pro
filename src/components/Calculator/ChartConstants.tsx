import { formatCurrency } from "@/utils/formatCurrency";

export const CHART_TOOLTIP_STYLE = {
    contentStyle: {
        backgroundColor: "#1f2937",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
        color: "#fff",
        padding: "12px"
    },
    itemStyle: {
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold" as const
    },
};

export const PIE_TOOLTIP_STYLE = {
    ...CHART_TOOLTIP_STYLE,
    contentStyle: {
        ...CHART_TOOLTIP_STYLE.contentStyle,
        padding: "8px 12px",
    }
};

export const Y_AXIS_FORMATTER = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
};

export const CHART_MARGINS = { top: 20, right: 30, left: 10, bottom: 20 };

export const PIE_MARGINS = { top: 20, right: 40, bottom: 20, left: 40 };

export const tooltipFormatter = (value: number) => [formatCurrency(value), ""];
