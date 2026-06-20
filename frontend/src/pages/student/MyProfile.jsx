import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';
import StudentDetails from '../../components/students/StudentDetails';
import { fetchMyProfile } from '../../services/studentService';
import { getErrorMessage } from '../../utils/helpers';

export default function StudentMyProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchMyProfile();
                setProfile(data);
            } catch (err) {
                toast.error(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <Loader label="Loading profile…" />;

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Student</div>
                <h1 className="eg-page-title">My Profile</h1>
                <p className="eg-page-subtitle">Your registered academic details.</p>
            </div>

            <div style={{ maxWidth: 480 }}>
                <StudentDetails student={profile} />
            </div>
        </div>
    );
}