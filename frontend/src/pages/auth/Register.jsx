import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const ROLE_HOME = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.FACULTY]: '/faculty/dashboard',
    [ROLES.STUDENT]: '/student/dashboard',
};

const EMPTY = { username: '', password: '', role: ROLES.STUDENT, referenceId: '' };

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState(EMPTY);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field) => (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }));

    const needsReferenceId = values.role === ROLES.STUDENT;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!values.username.trim() || !values.password.trim()) {
            setError('Username and password are required');
            return;
        }
        if (needsReferenceId && !values.referenceId) {
            setError('Enter the Student ID created by your admin to link your account');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                username: values.username.trim(),
                password: values.password,
                role: values.role,
                referenceId: values.referenceId ? Number(values.referenceId) : undefined,
            };
            const user = await register(payload);
            toast.success('Account created');
            navigate(ROLE_HOME[user.role] || '/login', { replace: true });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <h1 className="eg-auth-title">Create account</h1>
            <p className="eg-auth-subtitle">
                Students and faculty: ask your administrator for your record ID first.
            </p>

            {error && <div className="eg-alert eg-alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="reg-username">Username</label>
                    <input
                        id="reg-username"
                        className="eg-input"
                        value={values.username}
                        onChange={handleChange('username')}
                        placeholder="choose a username"
                        autoComplete="username"
                    />
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="reg-password">Password</label>
                    <input
                        id="reg-password"
                        type="password"
                        className="eg-input"
                        value={values.password}
                        onChange={handleChange('password')}
                        placeholder="minimum 6 characters"
                        autoComplete="new-password"
                    />
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="reg-role">Role</label>
                    <select id="reg-role" className="eg-select" value={values.role} onChange={handleChange('role')}>
                        <option value={ROLES.STUDENT}>Student</option>
                        <option value={ROLES.FACULTY}>Faculty</option>
                        <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                </div>

                {needsReferenceId && (
                    <div className="eg-field">
                        <label className="eg-label" htmlFor="reg-referenceId">Student ID</label>
                        <input
                            id="reg-referenceId"
                            type="number"
                            className="eg-input eg-mono"
                            value={values.referenceId}
                            onChange={handleChange('referenceId')}
                            placeholder="e.g. 14"
                        />
                        <span style={{ fontSize: 12, color: 'var(--color-slate)' }}>
              This links your login to the student record your admin created.
            </span>
                    </div>
                )}

                <button type="submit" className="eg-btn eg-btn-primary eg-btn-block" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <div className="eg-auth-footer">
                Already have an account? <Link to="/login">Sign in</Link>
            </div>
        </AuthLayout>
    );
}