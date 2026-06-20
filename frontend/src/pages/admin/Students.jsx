import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StudentForm from '../../components/students/StudentForm';
import StudentTable from '../../components/students/StudentTable';
import { usePagination } from '../../hooks/usePagination';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../../services/studentService';
import { getErrorMessage } from '../../utils/helpers';

export default function AdminStudents() {
    const pagination = usePagination(fetchStudents, { size: 10, sortBy: 'name' });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        pagination.load({ page: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = pagination.content.filter((s) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    });

    const openCreate = () => {
        setEditingStudent(null);
        setModalOpen(true);
    };

    const openEdit = (student) => {
        setEditingStudent(student);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const handleSubmit = async (values) => {
        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, values);
                toast.success('Student updated');
            } else {
                await createStudent(values);
                toast.success('Student added');
            }
            setModalOpen(false);
            pagination.load();
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteStudent(deleteTarget.id);
            toast.success('Student removed');
            setDeleteTarget(null);
            pagination.load();
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Admin</div>
                <h1 className="eg-page-title">Students</h1>
                <p className="eg-page-subtitle">Add, update, search, and remove student records.</p>
            </div>

            <div className="eg-card">
                <div className="eg-card-header">
                    <span className="eg-card-title">All students</span>
                    <button type="button" className="eg-btn eg-btn-primary eg-btn-sm" onClick={openCreate}>
                        <Icon name="plus" size={15} />
                        Add student
                    </button>
                </div>

                <div style={{ padding: '16px 20px 0' }}>
                    <div className="eg-toolbar">
                        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, USN, or email…" />
                    </div>
                </div>

                {pagination.loading ? (
                    <Loader inline label="Loading students…" />
                ) : (
                    <>
                        <StudentTable students={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />
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

            {modalOpen && (
                <div className="eg-modal-overlay" onClick={closeModal}>
                    <div className="eg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="eg-modal-header">
                            <h3 style={{ fontSize: 18 }}>{editingStudent ? 'Edit student' : 'Add student'}</h3>
                            <button type="button" className="eg-modal-close" onClick={closeModal} aria-label="Close">
                                <Icon name="x" size={18} />
                            </button>
                        </div>
                        <div className="eg-modal-body">
                            <StudentForm
                                initialValues={editingStudent}
                                onSubmit={handleSubmit}
                                onCancel={closeModal}
                                submitLabel={editingStudent ? 'Update student' : 'Add student'}
                            />
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete this student?"
                message={`This will permanently remove ${deleteTarget?.name || 'this student'} and cannot be undone.`}
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}