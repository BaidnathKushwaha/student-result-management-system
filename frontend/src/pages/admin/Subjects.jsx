import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SubjectForm from '../../components/subjects/SubjectForm';
import SubjectTable from '../../components/subjects/SubjectTable';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchSubjects, createSubject, updateSubject, deleteSubject } from '../../services/subjectService';
import { getErrorMessage } from '../../utils/helpers';

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchSubjects();
            setSubjects(data);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = subjects.filter((s) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return s.subjectName.toLowerCase().includes(q) || s.subjectCode.toLowerCase().includes(q);
    });

    const openCreate = () => {
        setEditingSubject(null);
        setModalOpen(true);
    };

    const openEdit = (subject) => {
        setEditingSubject(subject);
        setModalOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingSubject) {
                await updateSubject(editingSubject.id, values);
                toast.success('Subject updated');
            } else {
                await createSubject(values);
                toast.success('Subject added');
            }
            setModalOpen(false);
            load();
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteSubject(deleteTarget.id);
            toast.success('Subject removed');
            setDeleteTarget(null);
            load();
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
                <h1 className="eg-page-title">Subjects</h1>
                <p className="eg-page-subtitle">Define subjects, credits, and semester for the curriculum.</p>
            </div>

            <div className="eg-card">
                <div className="eg-card-header">
                    <span className="eg-card-title">All subjects</span>
                    <button type="button" className="eg-btn eg-btn-primary eg-btn-sm" onClick={openCreate}>
                        <Icon name="plus" size={15} />
                        Add subject
                    </button>
                </div>

                <div style={{ padding: '16px 20px 0' }}>
                    <div className="eg-toolbar">
                        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or code…" />
                    </div>
                </div>

                {loading ? <Loader inline label="Loading subjects…" /> : <SubjectTable subjects={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />}
            </div>

            {modalOpen && (
                <div className="eg-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="eg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="eg-modal-header">
                            <h3 style={{ fontSize: 18 }}>{editingSubject ? 'Edit subject' : 'Add subject'}</h3>
                            <button type="button" className="eg-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                                <Icon name="x" size={18} />
                            </button>
                        </div>
                        <div className="eg-modal-body">
                            <SubjectForm
                                initialValues={editingSubject}
                                onSubmit={handleSubmit}
                                onCancel={() => setModalOpen(false)}
                                submitLabel={editingSubject ? 'Update subject' : 'Add subject'}
                            />
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete this subject?"
                message={`This will permanently remove ${deleteTarget?.subjectName || 'this subject'}.`}
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}