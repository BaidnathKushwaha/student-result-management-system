import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import MarksForm from '../../components/marks/MarksForm';
import MarksTable from '../../components/marks/MarksTable';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchFacultyViewStudents } from '../../services/studentService';
import { fetchSubjects } from '../../services/subjectService';
import { fetchMarksByStudent, addMarks, updateMarks, deleteMarks } from '../../services/marksService';
import { getErrorMessage } from '../../utils/helpers';

export default function FacultyMarksEntry() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [marksList, setMarksList] = useState([]);
    const [loadingBase, setLoadingBase] = useState(true);
    const [loadingMarks, setLoadingMarks] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingMarks, setEditingMarks] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadBase = async () => {
            setLoadingBase(true);
            try {
                const [studentPage, subjectList] = await Promise.all([
                    fetchFacultyViewStudents({ page: 0, size: 200, sortBy: 'name' }),
                    fetchSubjects(),
                ]);
                setStudents(studentPage.content || []);
                setSubjects(subjectList);
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoadingBase(false);
            }
        };
        loadBase();
    }, []);

    const loadMarksFor = async (student) => {
        setSelectedStudent(student);
        setLoadingMarks(true);
        try {
            const data = await fetchMarksByStudent(student.id);
            setMarksList(data);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoadingMarks(false);
        }
    };

    const filteredStudents = students.filter((s) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q);
    });

    const openCreate = () => {
        setEditingMarks(null);
        setModalOpen(true);
    };

    const openEdit = (marks) => {
        setEditingMarks(marks);
        setModalOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (editingMarks) {
                await updateMarks(editingMarks.id, values);
                toast.success('Marks updated');
            } else {
                await addMarks(values);
                toast.success('Marks recorded');
            }
            setModalOpen(false);
            if (selectedStudent) loadMarksFor(selectedStudent);
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteMarks(deleteTarget.id);
            toast.success('Marks removed');
            setDeleteTarget(null);
            if (selectedStudent) loadMarksFor(selectedStudent);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Faculty</div>
                <h1 className="eg-page-title">Marks Entry</h1>
                <p className="eg-page-subtitle">Select a student, then enter or update marks for any subject.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'flex-start' }}>
                <div className="eg-card">
                    <div className="eg-card-header">
                        <span className="eg-card-title">Students</span>
                    </div>
                    <div style={{ padding: '14px 16px 0' }}>
                        <SearchBar value={search} onChange={setSearch} placeholder="Search students…" />
                    </div>
                    {loadingBase ? (
                        <Loader inline label="Loading…" />
                    ) : (
                        <div style={{ maxHeight: 480, overflowY: 'auto', padding: 8 }}>
                            {filteredStudents.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => loadMarksFor(s)}
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
                            {filteredStudents.length === 0 && (
                                <div className="eg-empty">
                                    <p>No matching students</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="eg-card">
                    <div className="eg-card-header">
            <span className="eg-card-title">
              {selectedStudent ? `Marks — ${selectedStudent.name}` : 'Select a student'}
            </span>
                        {selectedStudent && (
                            <button type="button" className="eg-btn eg-btn-primary eg-btn-sm" onClick={openCreate}>
                                <Icon name="plus" size={15} />
                                Add marks
                            </button>
                        )}
                    </div>

                    {!selectedStudent && (
                        <div className="eg-empty">
                            <div className="eg-empty-title">No student selected</div>
                            <p>Choose a student from the list to enter their marks.</p>
                        </div>
                    )}

                    {selectedStudent && loadingMarks && <Loader inline label="Loading marks…" />}

                    {selectedStudent && !loadingMarks && (
                        <MarksTable marksList={marksList} onEdit={openEdit} onDelete={setDeleteTarget} showStudent={false} />
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="eg-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="eg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <div className="eg-modal-header">
                            <h3 style={{ fontSize: 18 }}>{editingMarks ? 'Update marks' : 'Enter marks'}</h3>
                            <button type="button" className="eg-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">
                                <Icon name="x" size={18} />
                            </button>
                        </div>
                        <div className="eg-modal-body">
                            <MarksForm
                                students={students}
                                subjects={subjects}
                                initialValues={
                                    editingMarks || (selectedStudent ? { studentId: selectedStudent.id } : null)
                                }
                                lockStudent={!!selectedStudent && !editingMarks}
                                onSubmit={handleSubmit}
                                onCancel={() => setModalOpen(false)}
                                submitLabel={editingMarks ? 'Update marks' : 'Save marks'}
                            />
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete this marks record?"
                message="This will permanently remove the recorded marks for this subject."
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}