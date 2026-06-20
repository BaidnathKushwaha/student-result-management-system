import { useState, useEffect } from 'react';

const EMPTY = { name: '', email: '' };

export default function FacultyForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save Faculty' }) {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setValues(initialValues ? { name: initialValues.name || '', email: initialValues.email || '' } : EMPTY);
    }, [initialValues]);

    const validate = () => {
        const next = {};
        if (!values.name.trim()) next.name = 'Name is required';
        if (!values.email.trim()) next.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (field) => (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="eg-field">
                <label className="eg-label" htmlFor="facultyName">Full name</label>
                <input
                    id="facultyName"
                    className={`eg-input ${errors.name ? 'eg-input-error' : ''}`}
                    value={values.name}
                    onChange={handleChange('name')}
                    placeholder="Dr. Anita Rao"
                />
                {errors.name && <span className="eg-error-text">{errors.name}</span>}
            </div>

            <div className="eg-field">
                <label className="eg-label" htmlFor="facultyEmail">Email</label>
                <input
                    id="facultyEmail"
                    type="email"
                    className={`eg-input ${errors.email ? 'eg-input-error' : ''}`}
                    value={values.email}
                    onChange={handleChange('email')}
                    placeholder="anita.rao@college.edu"
                />
                {errors.email && <span className="eg-error-text">{errors.email}</span>}
            </div>

            <div className="eg-form-actions">
                <button type="button" className="eg-btn eg-btn-secondary" onClick={onCancel} disabled={submitting}>
                    Cancel
                </button>
                <button type="submit" className="eg-btn eg-btn-primary" disabled={submitting}>
                    {submitting ? 'Saving…' : submitLabel}
                </button>
            </div>
        </form>
    );
}