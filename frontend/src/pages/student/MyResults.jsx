import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import ResultCard from '../../components/results/ResultCard';
import GradeSummary from '../../components/results/GradeSummary';
import { fetchMyProfile } from '../../services/studentService';
import { fetchResult } from '../../services/resultService';
import { getErrorMessage } from '../../utils/helpers';

export default function StudentMyResults() {
    const [profile, setProfile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setNotFound(false);
            try {
                const profileData = await fetchMyProfile();
                setProfile(profileData);
                try {
                    const resultData = await fetchResult(profileData.id, profileData.semester);
                    setResult(resultData);
                } catch (err) {
                    if (err.response?.status === 404) {
                        setNotFound(true);
                    } else {
                        throw err;
                    }
                }
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Loader label="Loading your results…" />;

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Student</div>
                <h1 className="eg-page-title">My Results</h1>
                <p className="eg-page-subtitle">
                    {profile ? `Result for your current semester — Semester ${profile.semester}.` : 'Your current result.'}
                </p>
            </div>

            {notFound && (
                <div className="eg-alert eg-alert-error">
                    Your result for this semester hasn't been published yet. Check back once your faculty has recorded
                    and finalized your marks, or browse{' '}
                    <Link to="/student/semester-results" style={{ textDecoration: 'underline', fontWeight: 600 }}>
                        past semester results
                    </Link>
                    .
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
        </div>
    );
}