// Minimal hand-picked icon set (stroke-based, 18x18 viewBox) — no external icon library needed.
// Usage: <Icon name="users" size={18} />

const paths = {
    grid: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
    users:
        'M7 11a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zM2 19c0-2.8 2.2-5 5-5s5 2.2 5 5M12 19c0-2.6 2-4.7 4.5-5M17 14c2.8 0 5 2.2 5 5',
    briefcase:
        'M3 8h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8zM8 8V6a2 2 0 012-2h4a2 2 0 012 2v2',
    book: 'M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4zM4 17a3 3 0 003 3h11',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z',
    'bar-chart': 'M5 21V10M12 21V3M19 21v-7',
    award:
        'M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.6L6 21l6-3 6 3-2.2-7.4',
    user: 'M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM4 21c0-3.9 3.6-7 8-7s8 3.1 8 7',
    search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
    plus: 'M12 5v14M5 12h14',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13',
    pencil: 'M4 20h4L19.5 8.5a2.1 2.1 0 10-3-3L5 17v3z',
    x: 'M18 6L6 18M6 6l12 12',
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-right': 'M9 6l6 6-6 6',
    menu: 'M3 12h18M3 6h18M3 18h18',
    logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
    alert: 'M12 9v4M12 17h.01M10.3 3.9L2.8 17a1.7 1.7 0 001.5 2.6h15.4a1.7 1.7 0 001.5-2.6L13.7 3.9a1.7 1.7 0 00-3.4 0z',
    check: 'M20 6L9 17l-5-5',
    'check-circle': 'M22 11.1V12a10 10 0 11-5.9-9.1M22 4L12 14.01l-3-3',
    refresh: 'M21 2v6h-6M3 22v-6h6M3.5 9a9 9 0 0114.5-4.5L21 8M20.5 15a9 9 0 01-14.5 4.5L3 16',
    mail: 'M4 4h16v16H4V4zm0 0l8 9 8-9',
    download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
    print: 'M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z',
    bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
    const d = paths[name];
    if (!d) return null;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d={d} />
        </svg>
    );
}