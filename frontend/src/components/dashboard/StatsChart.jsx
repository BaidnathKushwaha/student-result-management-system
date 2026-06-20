/**
 * Minimal bar chart rendered as inline SVG — avoids pulling in a charting
 * library for a handful of bars. data: [{ label, value }]
 */
export default function StatsChart({ data = [], maxValue, height = 180, color = 'var(--color-navy)' }) {
    if (data.length === 0) {
        return <div className="eg-empty">No data to display yet.</div>;
    }

    const max = maxValue || Math.max(...data.map((d) => d.value), 1);
    const barWidth = 100 / data.length;

    return (
        <div>
            <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: '100%', height }}>
                {data.map((d, i) => {
                    const barHeight = (d.value / max) * (height - 28);
                    const x = i * barWidth + barWidth * 0.2;
                    const w = barWidth * 0.6;
                    const y = height - 24 - barHeight;
                    return (
                        <g key={d.label}>
                            <rect x={x} y={y} width={w} height={barHeight} rx="1.5" fill={color} opacity={0.85} />
                            <text
                                x={x + w / 2}
                                y={height - 24 - barHeight - 4}
                                fontSize="5"
                                textAnchor="middle"
                                fill="var(--color-navy)"
                                fontFamily="var(--font-mono)"
                            >
                                {d.value}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <div style={{ display: 'flex', marginTop: 4 }}>
                {data.map((d) => (
                    <div
                        key={d.label}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            fontSize: 11,
                            color: 'var(--color-slate)',
                            fontFamily: 'var(--font-mono)',
                        }}
                    >
                        {d.label}
                    </div>
                ))}
            </div>
        </div>
    );
}