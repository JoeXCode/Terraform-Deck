const nodes: [number, number][] = [[1240, 150], [1450, 150], [1450, 400], [1240, 400], [1450, 650], [1660, 400], [1240, 650]];
const links = [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [3, 6], [4, 6]];

/** Faint architecture sketch for opening and closing slides, kept clear of the title text. */
export function ArchBackdrop() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1920 1080" fill="none" opacity=".3">
      {links.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0] + 85} y1={nodes[a][1] + 40} x2={nodes[b][0] + 85} y2={nodes[b][1] + 40} stroke="#2A3A50" strokeWidth="2" strokeDasharray="6 8" />
      ))}
      {nodes.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="170" height="80" rx="12" fill="#0B0F14" strokeWidth="2" stroke={i === 1 || i === 4 ? "#7B42BC" : "#2A3A50"} />
      ))}
    </svg>
  );
}
