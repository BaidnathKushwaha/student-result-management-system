import { useState, useEffect } from 'react';
import { SEMESTERS } from '../../utils/constants';

const EMPTY = { usn: '', name: '', email: '', semester: '', department: '' };

export default function StudentForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save Student' }) {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialValues) {
            setValues({
                usn: initialValues.usn || '',
                name: initialValues.name || '',
                email: initialValues.email || '',
                semester: initialValues.semester ?? '',
                department: initialValues.department || '',
            });
        } else {
            setValues(EMPTY);
        }
    }, [initialValues]);

    const validate = () => {
        const next = {};
        if (!values.usn.trim()) next.usn = 'USN is required';
        if (!values.name.trim()) next.name = 'Name is required';
        if (!values.email.trim()) next.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'Enter a valid email';
        if (!values.semester) next.semester = 'Semester is required';
        if (!values.department.trim()) next.department = 'Department is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (field) => (e) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit({ ...values, semester: Number(values.semester) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="eg-form-row">
                <div className="eg-field">
                    <label className="eg-label" htmlFor="usn">USN</label>
                    <input
                        id="usn"
                        className={`eg-input ${errors.usn ? 'eg-input-error' : ''}`}
                        value={values.usn}
                        onChange={handleChange('usn')}
                        placeholder="1XX21CS001"
                    />
                    {errors.usn && <span className="eg-error-text">{errors.usn}</span>}
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="name">Full name</label>
                    <input
                        id="name"
                        className={`eg-input ${errors.name ? 'eg-input-error' : ''}`}
                        value={values.name}
                        onChange={handleChange('name')}
                        placeholder="Jane Doe"
                    />
                    {errors.name && <span className="eg-error-text">{errors.name}</span>}
                </div>
            </div>

            <div className="eg-field">
                <label className="eg-label" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    className={`eg-input ${errors.email ? 'eg-input-error' : ''}`}
                    value={values.email}
                    onChange={handleChange('email')}
                    placeholder="jane.doe@college.edu"
                />
                {errors.email && <span className="eg-error-text">{errors.email}</span>}
            </div>

            <div className="eg-form-row">
                <div className="eg-field">
                    <label className="eg-label" htmlFor="semester">Semester</label>
                    <select
                        id="semester"
                        className={`eg-select ${errors.semester ? 'eg-input-error' : ''}`}
                        value={values.semester}
                        onChange={handleChange('semester')}
                    >
                        <option value="">Select semester</option>
                        {SEMESTERS.map((s) => (
                            <option key={s} value={s}>
                                Semester {s}
                            </option>
                        ))}
                    </select>
                    {errors.semester && <span className="eg-error-text">{errors.semester}</span>}
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="department">Department</label>
                    <input
                        id="department"
                        className={`eg-input ${errors.department ? 'eg-input-error' : ''}`}
                        value={values.department}
                        onChange={handleChange('department')}
                        placeholder="Computer Science"
                    />
                    {errors.department && <span className="eg-error-text">{errors.department}</span>}
                </div>
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