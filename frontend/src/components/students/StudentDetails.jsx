import { getInitials } from '../../utils/helpers';

export default function StudentDetails({ student }) {
    if (!student) return null;

    const rows = [
        { label: 'USN', value: student.usn, mono: true },
        { label: 'Email', value: student.email },
        { label: 'Semester', value: `Semester ${student.semester}` },
        { label: 'Department', value: student.department },
    ];

    return (
        <div className="eg-card eg-card-padded">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'var(--color-navy)',
                        color: 'var(--color-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-display)',
                        fontSize: 20,
                        fontWeight: 700,
                    }}
                >
                    {getInitials(student.name)}
                </div>
                <div>
                    <h3 style={{ fontSize: 19 }}>{student.name}</h3>
                    <span className="eg-mono" style={{ fontSize: 13, color: 'var(--color-slate)' }}>
            {student.usn}
          </span>
                </div>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
                {rows.map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
                        <span style={{ fontSize: 13, color: 'var(--color-slate)' }}>{row.label}</span>
                        <span className={row.mono ? 'eg-mono' : ''} style={{ fontSize: 14, fontWeight: 600 }}>
              {row.value}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
}