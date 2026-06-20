import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardCard from '../../components/dashboard/DashboardCard';
import Loader from '../../components/common/Loader';
import { fetchFacultyViewStudents } from '../../services/studentService';
import { fetchSubjects } from '../../services/subjectService';
import { getErrorMessage } from '../../utils/helpers';

export default function FacultyDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ students: 0, subjects: 0 });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [studentPage, subjects] = await Promise.all([
                    fetchFacultyViewStudents({ page: 0, size: 1, sortBy: 'name' }),
                    fetchSubjects(),
                ]);
                setStats({
                    students: studentPage.totalElements ?? 0,
                    subjects: subjects.length,
                });
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Loader label="Loading dashboard…" />;

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Overview</div>
                <h1 className="eg-page-title">Faculty Dashboard</h1>
                <p className="eg-page-subtitle">Quick view of your teaching workload.</p>
            </div>

            <div className="eg-stat-grid">
                <DashboardCard label="Visible students" value={stats.students} icon="users" accent="navy" />
                <DashboardCard label="Subjects in catalog" value={stats.subjects} icon="book" accent="gold" />
                <DashboardCard label="Marks entry" value="Open" icon="edit" accent="green" footer="Go to Marks Entry to begin" />
            </div>

            <div className="eg-card eg-card-padded">
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>Getting started</h3>
                <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>
                    Use <strong>Marks Entry</strong> to record internal and external marks for a student's subject —
                    the total is calculated automatically. Use <strong>Students</strong> to look up a student's details,
                    and <strong>Results</strong> to view computed GPA and percentage once marks are recorded.
                </p>
            </div>
        </div>
    );
}