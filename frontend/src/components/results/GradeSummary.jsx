import { getGradeLabel } from '../../utils/helpers';

export default function GradeSummary({ subjectMarks = [] }) {
    if (subjectMarks.length === 0) return null;

    const counts = subjectMarks.reduce((acc, m) => {
        const grade = getGradeLabel(m.totalMarks);
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
    }, {});

    const order = ['O', 'A+', 'A', 'B+', 'B', 'F'];

    return (
        <div className="eg-card eg-card-padded">
            <div className="eg-card-title" style={{ marginBottom: 16 }}>Grade distribution</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {order
                    .filter((g) => counts[g])
                    .map((grade) => (
                        <div
                            key={grade}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                padding: '12px 18px',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                minWidth: 64,
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{grade}</span>
                            <span className="eg-mono" style={{ fontSize: 12, color: 'var(--color-slate)' }}>
                {counts[grade]} {counts[grade] === 1 ? 'subject' : 'subjects'}
              </span>
                        </div>
                    ))}
            </div>
        </div>
    );
}