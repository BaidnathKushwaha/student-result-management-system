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
import { fetchFacultyViewStudents } from '../../services/studentService';
import { getErrorMessage } from '../../utils/helpers';

export default function FacultyAssignedStudents() {
    const pagination = usePagination(fetchFacultyViewStudents, { size: 10, sortBy: 'name' });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const [viewing, setViewing] = useState(null);

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
        </div>
    );
}