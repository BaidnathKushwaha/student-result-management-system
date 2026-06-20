import { getGpaBadgeVariant, formatNumber } from '../../utils/helpers';
import { getGradeLabel } from '../../utils/helpers';
import Icon from '../../assets/icons/Icon';
import { logTranscriptDownload } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';

export default function ResultCard({ result }) {
    const { role } = useAuth();

    const triggerDownloadLog = async () => {
        if (role === 'STUDENT' && result.studentId && result.semester) {
            try {
                await logTranscriptDownload(result.studentId, result.semester);
            } catch (err) {
                console.error('Failed to log transcript download:', err);
            }
        }
    };
    if (!result) return null;

    const gpaVariant = getGpaBadgeVariant(result.gpa);

    const handleDownloadCSV = () => {
        if (!result.subjectMarks) return;
        triggerDownloadLog();
        const headers = ['Subject Code', 'Subject Name', 'Internal Marks', 'External Marks', 'Total Marks', 'Grade'];
        const rows = result.subjectMarks.map(m => [
            m.subjectCode,
            m.subjectName,
            m.internalMarks,
            m.externalMarks,
            m.totalMarks,
            getGradeLabel(m.totalMarks)
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `result_${result.usn}_sem_${result.semester}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="eg-transcript">
            <div className="eg-transcript-header">
                <div>
                    <div className="eg-transcript-title">{result.studentName}</div>
                    <div className="eg-transcript-meta">
                        USN {result.usn} &middot; Semester {result.semester}
                    </div>
                </div>
                <div className="eg-transcript-stamp">
                    <span className="eg-transcript-stamp-label">GPA</span>
                    <span className="eg-transcript-stamp-value">{formatNumber(result.gpa, 2)}</span>
                </div>
            </div>

            <div className="eg-transcript-body">
                <div className="eg-transcript-summary">
                    <div className="eg-transcript-summary-item">
                        <div className="eg-transcript-summary-label">Percentage</div>
                        <div className="eg-transcript-summary-value">{formatNumber(result.percentage, 1)}%</div>
                    </div>
                    <div className="eg-transcript-summary-item">
                        <div className="eg-transcript-summary-label">GPA</div>
                        <div className="eg-transcript-summary-value">
                            <span className={`eg-badge eg-badge-${gpaVariant}`} style={{ fontSize: 16, padding: '4px 14px' }}>
                                {formatNumber(result.gpa, 2)}
                            </span>
                        </div>
                    </div>
                    <div className="eg-transcript-summary-item">
                        <div className="eg-transcript-summary-label">Subjects</div>
                        <div className="eg-transcript-summary-value">{result.subjectMarks?.length ?? 0}</div>
                    </div>
                </div>

                {result.subjectMarks && result.subjectMarks.length > 0 && (
                    <div className="eg-table-wrap">
                        <table className="eg-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Internal</th>
                                    <th>External</th>
                                    <th>Total</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.subjectMarks.map((m) => (
                                    <tr key={m.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{m.subjectName}</div>
                                            <div className="eg-mono" style={{ fontSize: 12, color: 'var(--color-slate-light)' }}>
                                                {m.subjectCode}
                                            </div>
                                        </td>
                                        <td className="eg-mono">{m.internalMarks}</td>
                                        <td className="eg-mono">{m.externalMarks}</td>
                                        <td className="eg-mono" style={{ fontWeight: 700 }}>{m.totalMarks}</td>
                                        <td>{getGradeLabel(m.totalMarks)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Print and Export actions */}
                <div className="eg-transcript-actions no-print" style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                    <button type="button" onClick={() => { triggerDownloadLog(); window.print(); }} className="eg-btn eg-btn-primary eg-btn-sm">
                        <Icon name="print" size={14} /> Print / Save PDF
                    </button>
                    <button type="button" onClick={handleDownloadCSV} className="eg-btn eg-btn-secondary eg-btn-sm">
                        <Icon name="download" size={14} /> Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
}