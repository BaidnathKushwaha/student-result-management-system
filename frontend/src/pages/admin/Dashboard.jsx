import { useEffect, useState } from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import StatsChart from '../../components/dashboard/StatsChart';
import Loader from '../../components/common/Loader';
import { fetchStudents } from '../../services/studentService';
import { fetchFaculty } from '../../services/facultyService';
import { fetchSubjects } from '../../services/subjectService';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ students: 0, faculty: 0, subjects: 0 });
    const [bySemester, setBySemester] = useState([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [studentPage, facultyList, subjectList] = await Promise.all([
                    fetchStudents({ page: 0, size: 100, sortBy: 'semester' }),
                    fetchFaculty(),
                    fetchSubjects(),
                ]);

                setStats({
                    students: studentPage.totalElements ?? studentPage.content.length,
                    faculty: facultyList.length,
                    subjects: subjectList.length,
                });

                const semesterCounts = {};
                (studentPage.content || []).forEach((s) => {
                    semesterCounts[s.semester] = (semesterCounts[s.semester] || 0) + 1;
                });
                setBySemester(
                    Object.entries(semesterCounts)
                        .sort((a, b) => Number(a[0]) - Number(b[0]))
                        .map(([sem, count]) => ({ label: `S${sem}`, value: count }))
                );
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
                <h1 className="eg-page-title">Admin Dashboard</h1>
                <p className="eg-page-subtitle">A snapshot of students, faculty, and subjects across the institution.</p>
            </div>

            <div className="eg-stat-grid">
                <DashboardCard label="Total students" value={stats.students} icon="users" accent="navy" />
                <DashboardCard label="Total faculty" value={stats.faculty} icon="briefcase" accent="green" />
                <DashboardCard label="Total subjects" value={stats.subjects} icon="book" accent="gold" />
                <DashboardCard label="Results published" value="—" icon="award" footer="Generate results per semester" />
            </div>

            <div className="eg-card">
                <div className="eg-card-header">
                    <span className="eg-card-title">Students by semester</span>
                </div>
                <div className="eg-card-padded">
                    <StatsChart data={bySemester} />
                </div>
            </div>
        </div>
    );
}