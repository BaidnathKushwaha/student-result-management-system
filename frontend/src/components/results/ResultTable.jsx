import { formatNumber, getGpaBadgeVariant } from '../../utils/helpers';

export default function ResultTable({ results }) {
    if (results.length === 0) {
        return (
            <div className="eg-empty">
                <div className="eg-empty-title">No results generated yet</div>
                <p>Generate a result for a student and semester to see it listed here.</p>
            </div>
        );
    }

    return (
        <div className="eg-table-wrap">
            <table className="eg-table">
                <thead>
                <tr>
                    <th>USN</th>
                    <th>Student</th>
                    <th>Semester</th>
                    <th>Percentage</th>
                    <th>GPA</th>
                </tr>
                </thead>
                <tbody>
                {results.map((r) => (
                    <tr key={`${r.studentId}-${r.semester}`}>
                        <td className="eg-mono">{r.usn}</td>
                        <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                        <td>
                            <span className="eg-badge eg-badge-slate">Sem {r.semester}</span>
                        </td>
                        <td className="eg-mono">{formatNumber(r.percentage, 1)}%</td>
                        <td>
                            <span className={`eg-badge eg-badge-${getGpaBadgeVariant(r.gpa)}`}>{formatNumber(r.gpa, 2)}</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}