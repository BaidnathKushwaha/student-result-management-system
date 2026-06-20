import Icon from '../../assets/icons/Icon';

export default function StudentTable({ students, onEdit, onDelete, onView, readOnly = false }) {
    if (students.length === 0) {
        return (
            <div className="eg-empty">
                <div className="eg-empty-title">No students found</div>
                <p>Try adjusting your search, or add a new student to get started.</p>
            </div>
        );
    }

    return (
        <div className="eg-table-wrap">
            <table className="eg-table">
                <thead>
                <tr>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Semester</th>
                    <th>Department</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {students.map((student) => (
                    <tr key={student.id}>
                        <td className="eg-mono">{student.usn}</td>
                        <td>
                            {onView ? (
                                <button
                                    type="button"
                                    onClick={() => onView(student)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: 'var(--color-navy)', padding: 0 }}
                                >
                                    {student.name}
                                </button>
                            ) : (
                                student.name
                            )}
                        </td>
                        <td>{student.email}</td>
                        <td>
                            <span className="eg-badge eg-badge-slate">Sem {student.semester}</span>
                        </td>
                        <td>{student.department}</td>
                        <td>
                            {!readOnly && (
                                <div className="eg-table-actions">
                                    <button
                                        type="button"
                                        className="eg-btn eg-btn-secondary eg-btn-sm"
                                        onClick={() => onEdit(student)}
                                        aria-label={`Edit ${student.name}`}
                                    >
                                        <Icon name="pencil" size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className="eg-btn eg-btn-danger eg-btn-sm"
                                        onClick={() => onDelete(student)}
                                        aria-label={`Delete ${student.name}`}
                                    >
                                        <Icon name="trash" size={14} />
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}