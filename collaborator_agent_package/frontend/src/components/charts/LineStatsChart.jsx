import React from "react";

const LineStatsChart = ({ data, color = "#4f46e5", height = 200 }) => {
    // Basic mock chart using SVG
    const points = data || [30, 45, 35, 60, 55, 80, 75];
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    const svgPoints = points.map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        const y = 100 - ((p - min) / range) * 80 - 10; // Margin
        return `${x},${y}`;
    }).join(" ");

    return (
        <div className="chart-container" style={{ width: "100%", height }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                {/* Gradient background */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Area under the line */}
                <path
                    d={`M0,100 L${svgPoints} L100,100 Z`}
                    fill="url(#chartGradient)"
                />
                
                {/* The line itself */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={svgPoints}
                />
                
                {/* Data points */}
                {points.map((p, i) => {
                    const x = (i / (points.length - 1)) * 100;
                    const y = 100 - ((p - min) / range) * 80 - 10;
                    return <circle key={i} cx={x} cy={y} r="1.5" fill={color} />;
                })}
            </svg>
        </div>
    );
};

export default LineStatsChart;
