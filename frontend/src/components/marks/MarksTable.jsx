import Icon from '../../assets/icons/Icon';
import { getGradeLabel, getGradeBadgeVariant } from '../../utils/helpers';

export default function MarksTable({ marksList, onEdit, onDelete, showStudent = true, readOnly = false }) {
    if (marksList.length === 0) {
        return (
            <div className="eg-empty">
                <div className="eg-empty-title">No marks recorded yet</div>
                <p>Enter marks for a subject to see them appear here.</p>
            </div>
        );
    }

    return (
        <div className="eg-table-wrap">
            <table className="eg-table">
                <thead>
                <tr>
                    {showStudent && <th>Student</th>}
                    <th>Subject</th>
                    <th>Internal</th>
                    <th>External</th>
                    <th>Total</th>
                    <th>Grade</th>
                    {!readOnly && <th></th>}
                </tr>
                </thead>
                <tbody>
                {marksList.map((m) => (
                    <tr key={m.id}>
                        {showStudent && (
                            <td>
                                <div style={{ fontWeight: 600 }}>{m.studentName}</div>
                            </td>
                        )}
                        <td>
                            <div style={{ fontWeight: 600 }}>{m.subjectName}</div>
                            <div className="eg-mono" style={{ fontSize: 12, color: 'var(--color-slate-light)' }}>
                                {m.subjectCode}
                            </div>
                        </td>
                        <td className="eg-mono">{m.internalMarks}</td>
                        <td className="eg-mono">{m.externalMarks}</td>
                        <td className="eg-mono" style={{ fontWeight: 700 }}>{m.totalMarks}</td>
                        <td>
                <span className={`eg-badge eg-badge-${getGradeBadgeVariant(m.totalMarks)}`}>
                  {getGradeLabel(m.totalMarks)}
                </span>
                        </td>
                        {!readOnly && (
                            <td>
                                <div className="eg-table-actions">
                                    <button
                                        type="button"
                                        className="eg-btn eg-btn-secondary eg-btn-sm"
                                        onClick={() => onEdit(m)}
                                        aria-label="Edit marks"
                                    >
                                        <Icon name="pencil" size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className="eg-btn eg-btn-danger eg-btn-sm"
                                        onClick={() => onDelete(m)}
                                        aria-label="Delete marks"
                                    >
                                        <Icon name="trash" size={14} />
                                    </button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}