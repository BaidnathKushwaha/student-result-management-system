import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import StudentTable from '../../components/students/StudentTable';
import StudentDetails from '../../components/students/StudentDetails';
import Icon from '../../assets/icons/Icon';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchFacultyViewStudents, promoteStudents } from '../../services/studentService';
import { SEMESTERS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/helpers';

export default function FacultyAssignedStudents() {
    const pagination = usePagination(fetchFacultyViewStudents, { size: 10, sortBy: 'name' });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const [viewing, setViewing] = useState(null);
    const [promoteModalOpen, setPromoteModalOpen] = useState(false);
    const [promoteSemester, setPromoteSemester] = useState('');
    const [promoting, setPromoting] = useState(false);

    const handlePromoteSubmit = async (e) => {
        e.preventDefault();
        if (!promoteSemester) {
            toast.error('Please select a semester');
            return;
        }
        setPromoting(true);
        try {
            await promoteStudents(Number(promoteSemester));
            toast.success('Students promoted successfully!');
            setPromoteModalOpen(false);
            setPromoteSemester('');
            pagination.load({ page: 0 }); // Reset to page 0 to see updated results
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setPromoting(false);
        }
    };

    useEffect(() => {
        pagination.load({ page: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = pagination.content.filter((s) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q);
    });

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Faculty</div>
                <h1 className="eg-page-title">Students</h1>
                <p className="eg-page-subtitle">Browse student records. Click a name to view full details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: viewing ? '1fr 340px' : '1fr', gap: 20, alignItems: 'flex-start' }}>
                <div className="eg-card">
                    <div className="eg-card-header">
                        <span className="eg-card-title">All students</span>
                        <button type="button" className="eg-btn eg-btn-primary eg-btn-sm" onClick={() => setPromoteModalOpen(true)}>
                            <Icon name="refresh" size={15} />
                            Promote Students
                        </button>
                    </div>
                    <div style={{ padding: '16px 20px 0' }}>
                        <div className="eg-toolbar">
                            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or USN…" />
                        </div>
                    </div>

                    {pagination.loading ? (
                        <Loader inline label="Loading students…" />
                    ) : (
                        <>
                            <StudentTable students={filtered} onView={setViewing} readOnly />
                            <Pagination
                                page={pagination.page}
                                size={pagination.size}
                                totalElements={pagination.totalElements}
                                totalPages={pagination.totalPages}
                                onPageChange={pagination.goToPage}
                                onSizeChange={pagination.changeSize}
                            />
                        </>
                    )}
                </div>

                {viewing && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                            <button type="button" className="eg-btn eg-btn-secondary eg-btn-sm" onClick={() => setViewing(null)}>
                                <Icon name="x" size={14} />
                                Close
                            </button>
                        </div>
                        <StudentDetails student={viewing} />
                    </div>
                )}
            </div>

            {promoteModalOpen && (
                <div className="eg-modal-overlay" onClick={() => { setPromoteModalOpen(false); setPromoteSemester(''); }}>
                    <div className="eg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="eg-modal-header">
                            <h3 style={{ fontSize: 18 }}>Promote Students</h3>
                            <button type="button" className="eg-modal-close" onClick={() => { setPromoteModalOpen(false); setPromoteSemester(''); }} aria-label="Close">
                                <Icon name="x" size={18} />
                            </button>
                        </div>
                        <div className="eg-modal-body">
                            <form onSubmit={handlePromoteSubmit}>
                                <div className="eg-field" style={{ marginBottom: 20 }}>
                                    <label className="eg-label" htmlFor="promoteSemester">Current Semester</label>
                                    <select
                                        id="promoteSemester"
                                        className="eg-select"
                                        value={promoteSemester}
                                        onChange={(e) => setPromoteSemester(e.target.value)}
                                        required
                                    >
                                        <option value="">Select current semester</option>
                                        {SEMESTERS.filter(s => s < 8).map((s) => (
                                            <option key={s} value={s}>
                                                Semester {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {promoteSemester && (
                                    <div className="eg-card eg-card-padded" style={{ backgroundColor: 'var(--color-navy-light)', border: '1px solid var(--color-navy)', marginBottom: 20 }}>
                                        <p style={{ color: '#ffffff', fontSize: 14, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Icon name="alert" size={16} />
                                            <span>
                                                All students currently in <strong>Semester {promoteSemester}</strong> will be automatically promoted to <strong>Semester {Number(promoteSemester) + 1}</strong>.
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div className="eg-form-actions">
                                    <button type="button" className="eg-btn eg-btn-secondary" onClick={() => { setPromoteModalOpen(false); setPromoteSemester(''); }} disabled={promoting}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="eg-btn eg-btn-primary" disabled={promoting || !promoteSemester}>
                                        {promoting ? 'Promoting…' : 'Promote'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}