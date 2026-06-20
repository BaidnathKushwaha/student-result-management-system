import Icon from '../../assets/icons/Icon';
import { getInitials } from '../../utils/helpers';

export default function FacultyTable({ facultyList, onEdit, onDelete }) {
    if (facultyList.length === 0) {
        return (
            <div className="eg-empty">
                <div className="eg-empty-title">No faculty members yet</div>
                <p>Add faculty records so they can be assigned to enter marks.</p>
            </div>
        );
    }

    return (
        <div className="eg-table-wrap">
            <table className="eg-table">
                <thead>
                <tr>
                    <th>Faculty</th>
                    <th>Email</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {facultyList.map((faculty) => (
                    <tr key={faculty.id}>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: 'var(--color-green-light)',
                                        color: 'var(--color-green)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                >
                                    {getInitials(faculty.name)}
                                </div>
                                <span style={{ fontWeight: 600 }}>{faculty.name}</span>
                            </div>
                        </td>
                        <td>{faculty.email}</td>
                        <td>
                            <div className="eg-table-actions">
                                <button
                                    type="button"
                                    className="eg-btn eg-btn-secondary eg-btn-sm"
                                    onClick={() => onEdit(faculty)}
                                    aria-label={`Edit ${faculty.name}`}
                                >
                                    <Icon name="pencil" size={14} />
                                </button>
                                <button
                                    type="button"
                                    className="eg-btn eg-btn-danger eg-btn-sm"
                                    onClick={() => onDelete(faculty)}
                                    aria-label={`Delete ${faculty.name}`}
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