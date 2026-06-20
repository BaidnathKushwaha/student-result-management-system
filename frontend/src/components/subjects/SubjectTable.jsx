import Icon from '../../assets/icons/Icon';

export default function SubjectTable({ subjects, onEdit, onDelete }) {
    if (subjects.length === 0) {
        return (
            <div className="eg-empty">
                <div className="eg-empty-title">No subjects added</div>
                <p>Add subjects per semester so faculty can record marks against them.</p>
            </div>
        );
    }

    return (
        <div className="eg-table-wrap">
            <table className="eg-table">
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Subject name</th>
                    <th>Credits</th>
                    <th>Semester</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {subjects.map((subject) => (
                    <tr key={subject.id}>
                        <td className="eg-mono">{subject.subjectCode}</td>
                        <td style={{ fontWeight: 600 }}>{subject.subjectName}</td>
                        <td className="eg-mono">{subject.credits}</td>
                        <td>
                            <span className="eg-badge eg-badge-slate">Sem {subject.semester}</span>
                        </td>
                        <td>
                            <div className="eg-table-actions">
                                <button
                                    type="button"
                                    className="eg-btn eg-btn-secondary eg-btn-sm"
                                    onClick={() => onEdit(subject)}
                                    aria-label={`Edit ${subject.subjectName}`}
                                >
                                    <Icon name="pencil" size={14} />
                                </button>
                                <button
                                    type="button"
                                    className="eg-btn eg-btn-danger eg-btn-sm"
                                    onClick={() => onDelete(subject)}
                                    aria-label={`Delete ${subject.subjectName}`}
                                >
                                    <Icon name="trash" size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}