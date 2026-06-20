import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardCard from '../../components/dashboard/DashboardCard';
import Loader from '../../components/common/Loader';
import { fetchMyProfile } from '../../services/studentService';
import { fetchResult } from '../../services/resultService';
import { getErrorMessage, formatNumber } from '../../utils/helpers';

export default function StudentDashboard() {
    const [profile, setProfile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const profileData = await fetchMyProfile();
                setProfile(profileData);
                try {
                    const resultData = await fetchResult(profileData.id, profileData.semester);
                    setResult(resultData);
                } catch {
                    setResult(null); // No result generated yet for current semester — not an error state
                }
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
                <h1 className="eg-page-title">Welcome, {profile?.name?.split(' ')[0] || 'Student'}</h1>
                <p className="eg-page-subtitle">Here's a snapshot of your current academic standing.</p>
            </div>

            <div className="eg-stat-grid">
                <DashboardCard label="Current semester" value={profile?.semester ?? '—'} icon="book" accent="navy" />
                <DashboardCard
                    label="Current GPA"
                    value={result ? formatNumber(result.gpa, 2) : '—'}
                    icon="award"
                    accent="gold"
                    footer={result ? `Semester ${result.semester}` : 'Not generated yet'}
                />
                <DashboardCard
                    label="Percentage"
                    value={result ? `${formatNumber(result.percentage, 1)}%` : '—'}
                    icon="bar-chart"
                    accent="green"
                />
                <DashboardCard label="Department" value={profile?.department ?? '—'} icon="briefcase" />
            </div>

            <div className="eg-card eg-card-padded">
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>Recent results</h3>
                {result ? (
                    <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>
                        Your latest result for Semester {result.semester} shows a GPA of{' '}
                        <strong>{formatNumber(result.gpa, 2)}</strong> with {formatNumber(result.percentage, 1)}% overall.{' '}
                        <Link to="/student/results" style={{ textDecoration: 'underline', fontWeight: 600 }}>
                            View full breakdown →
                        </Link>
                    </p>
                ) : (
                    <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>
                        No result has been generated for your current semester yet. Check back once your faculty has
                        recorded and published marks, or browse{' '}
                        <Link to="/student/semester-results" style={{ textDecoration: 'underline', fontWeight: 600 }}>
                            past semesters
                        </Link>
                        .
                    </p>
                )}
            </div>
        </div>
    );
}