import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import ResultCard from '../../components/results/ResultCard';
import GradeSummary from '../../components/results/GradeSummary';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchStudents } from '../../services/studentService';
import { generateResult, fetchResult } from '../../services/resultService';
import { getErrorMessage } from '../../utils/helpers';
import { SEMESTERS } from '../../utils/constants';

export default function AdminReports() {
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [semester, setSemester] = useState('');
    const [result, setResult] = useState(null);
    const [loadingResult, setLoadingResult] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoadingStudents(true);
            try {
                const page = await fetchStudents({ page: 0, size: 200, sortBy: 'name' });
                setStudents(page.content || []);
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoadingStudents(false);
            }
        };
        load();
    }, []);

    const filteredStudents = students.filter((s) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q);
    });

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setSemester(String(student.semester));
        setResult(null);
        setNotFound(false);
    };

    const handleView = async () => {
        if (!selectedStudent || !semester) return;
        setLoadingResult(true);
        setNotFound(false);
        try {
            const data = await fetchResult(selectedStudent.id, semester);
            setResult(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setNotFound(true);
                setResult(null);
            } else {
                toast.error(getErrorMessage(err));
            }
        } finally {
            setLoadingResult(false);
        }
    };

    const handleGenerate = async () => {
        if (!selectedStudent || !semester) return;
        setGenerating(true);
        try {
            const data = await generateResult(selectedStudent.id, semester);
            setResult(data);
            setNotFound(false);
            toast.success('Result generated');
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Admin</div>
                <h1 className="eg-page-title">Reports</h1>
                <p className="eg-page-subtitle">Generate or review a student's result for any semester.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'flex-start' }}>
                <div className="eg-card">
                    <div className="eg-card-header">
                        <span className="eg-card-title">Students</span>
                    </div>
                    <div style={{ padding: '14px 16px 0' }}>
                        <SearchBar value={search} onChange={setSearch} placeholder="Search students…" />
                    </div>
                    {loadingStudents ? (
                        <Loader inline label="Loading…" />
                    ) : (
                        <div style={{ maxHeight: 480, overflowY: 'auto', padding: 8 }}>
                            {filteredStudents.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => handleSelectStudent(s)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        background: selectedStudent?.id === s.id ? 'var(--color-cream)' : 'transparent',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        marginBottom: 2,
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                                    <div className="eg-mono" style={{ fontSize: 12, color: 'var(--color-slate)' }}>
                                        {s.usn} &middot; Sem {s.semester}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    {!selectedStudent && (
                        <div className="eg-card eg-empty">
                            <div className="eg-empty-title">No student selected</div>
                            <p>Choose a student to generate or view their result.</p>
                        </div>
                    )}

                    {selectedStudent && (
                        <>
                            <div className="eg-card eg-card-padded" style={{ marginBottom: 16 }}>
                                <div className="eg-transcript-actions" style={{ marginBottom: 0 }}>
                                    <div className="eg-field" style={{ marginBottom: 0, minWidth: 160 }}>
                                        <label className="eg-label" htmlFor="semSelect">Semester</label>
                                        <select id="semSelect" className="eg-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
                                            {SEMESTERS.map((s) => (
                                                <option key={s} value={s}>Semester {s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="button" className="eg-btn eg-btn-secondary" onClick={handleView} disabled={loadingResult} style={{ marginTop: 22 }}>
                                        {loadingResult ? 'Loading…' : 'View result'}
                                    </button>
                                    <button type="button" className="eg-btn eg-btn-primary" onClick={handleGenerate} disabled={generating} style={{ marginTop: 22 }}>
                                        <Icon name="refresh" size={15} />
                                        {generating ? 'Generating…' : 'Generate / refresh result'}
                                    </button>
                                </div>
                            </div>

                            {notFound && (
                                <div className="eg-alert eg-alert-error">
                                    No result found for this semester yet. Click "Generate / refresh result" to calculate it from recorded marks.
                                </div>
                            )}

                            {result && (
                                <>
                                    <div style={{ marginBottom: 16 }}>
                                        <ResultCard result={result} />
                                    </div>
                                    <GradeSummary subjectMarks={result.subjectMarks} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}