import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import ResultCard from '../../components/results/ResultCard';
import GradeSummary from '../../components/results/GradeSummary';
import { fetchMyProfile } from '../../services/studentService';
import { fetchResult } from '../../services/resultService';
import { getErrorMessage } from '../../utils/helpers';
import { SEMESTERS } from '../../utils/constants';

export default function StudentSemesterResults() {
    const [profile, setProfile] = useState(null);
    const [semester, setSemester] = useState('');
    const [result, setResult] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingResult, setLoadingResult] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoadingProfile(true);
            try {
                const data = await fetchMyProfile();
                setProfile(data);
                setSemester(String(data.semester));
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoadingProfile(false);
            }
        };
        load();
    }, []);

    const handleView = async (sem) => {
        if (!profile || !sem) return;
        setLoadingResult(true);
        setNotFound(false);
        setResult(null);
        try {
            const data = await fetchResult(profile.id, sem);
            setResult(data);
        } catch (err) {
            if (err.response?.status === 404) {
                setNotFound(true);
            } else {
                toast.error(getErrorMessage(err));
            }
        } finally {
            setLoadingResult(false);
        }
    };

    // Auto-load the result for the default (current) semester once profile is ready
    useEffect(() => {
        if (profile && semester) {
            handleView(semester);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    const handleSemesterChange = (e) => {
        const sem = e.target.value;
        setSemester(sem);
        handleView(sem);
    };

    if (loadingProfile) return <Loader label="Loading…" />;

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Student</div>
                <h1 className="eg-page-title">Semester Results</h1>
                <p className="eg-page-subtitle">Pick a semester to view that result.</p>
            </div>

            <div className="eg-card eg-card-padded" style={{ marginBottom: 16, maxWidth: 280 }}>
                <div className="eg-field" style={{ marginBottom: 0 }}>
                    <label className="eg-label" htmlFor="semSelect">Semester</label>
                    <select id="semSelect" className="eg-select" value={semester} onChange={handleSemesterChange}>
                        {SEMESTERS.map((s) => (
                            <option key={s} value={s}>Semester {s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loadingResult && <Loader inline label="Loading result…" />}

            {!loadingResult && notFound && (
                <div className="eg-alert eg-alert-error">
                    No result available for Semester {semester} yet.
                </div>
            )}

            {!loadingResult && result && (
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