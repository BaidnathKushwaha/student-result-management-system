import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FacultyForm from '../../components/faculty/FacultyForm';
import FacultyTable from '../../components/faculty/FacultyTable';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchFaculty, createFaculty, updateFaculty, deleteFaculty } from '../../services/facultyService';
import { getErrorMessage } from '../../utils/helpers';

export default function AdminFaculty() {
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchFaculty();
            setFacultyList(data);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = facultyList.filter((f) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q);
    });

    const openCreate = () => {
        setEditingFaculty(null);
        setModalOpen(true);
    };

    const openEdit = (faculty) => {
        setEditingFaculty(faculty);
        setModalOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingFaculty) {
                await updateFaculty(editingFaculty.id, values);
                toast.success('Faculty updated');
            } else {
                await createFaculty(values);
                toast.success('Faculty added');
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
            await deleteFaculty(deleteTarget.id);
            toast.success('Faculty removed');
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
                <h1 className="eg-page-title">Faculty</h1>
                <p className="eg-page-subtitle">Manage faculty records used to enter and update marks.</p>
            </div>

            <div className="eg-card">
                <div className="eg-card-header">
                    <span className="eg-card-title">All faculty</span>
                    <button type="button" className="eg-btn eg-btn-primary eg-btn-sm" onClick={openCreate}>
                        <Icon name="plus" size={15} />
                        Add faculty
                    </button>
                </div>

                <div style={{ padding: '16px 20px 0' }}>
                    <div className="eg-toolbar">
                        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
                    </div>
                </div>

                {loading ? <Loader inline label="Loading faculty…" /> : <FacultyTable facultyList={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />}
            </div>

            {modalOpen && (
                <div className="eg-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="eg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="eg-modal-header">
                            <h3 style={{ fontSize: 18 }}>{editingFaculty ? 'Edit faculty' : 'Add faculty'}</h3>
                            <button type="button" className="eg-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                                <Icon name="x" size={18} />
                            </button>
                        </div>
                        <div className="eg-modal-body">
                            <FacultyForm
                                initialValues={editingFaculty}
                                onSubmit={handleSubmit}
                                onCancel={() => setModalOpen(false)}
                                submitLabel={editingFaculty ? 'Update faculty' : 'Add faculty'}
                            />
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete this faculty member?"
                message={`This will permanently remove ${deleteTarget?.name || 'this faculty member'}.`}
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}