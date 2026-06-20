import { useState, useEffect } from 'react';
import { SEMESTERS } from '../../utils/constants';

const EMPTY = { subjectCode: '', subjectName: '', credits: '', semester: '' };

export default function SubjectForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save Subject' }) {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialValues) {
            setValues({
                subjectCode: initialValues.subjectCode || '',
                subjectName: initialValues.subjectName || '',
                credits: initialValues.credits ?? '',
                semester: initialValues.semester ?? '',
            });
        } else {
            setValues(EMPTY);
        }
    }, [initialValues]);

    const validate = () => {
        const next = {};
        if (!values.subjectCode.trim()) next.subjectCode = 'Subject code is required';
        if (!values.subjectName.trim()) next.subjectName = 'Subject name is required';
        if (!values.credits) next.credits = 'Credits is required';
        else if (Number(values.credits) < 1) next.credits = 'Credits must be at least 1';
        if (!values.semester) next.semester = 'Semester is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (field) => (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit({
                ...values,
                credits: Number(values.credits),
                semester: Number(values.semester),
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="eg-form-row">
                <div className="eg-field">
                    <label className="eg-label" htmlFor="subjectCode">Subject code</label>
                    <input
                        id="subjectCode"
                        className={`eg-input ${errors.subjectCode ? 'eg-input-error' : ''}`}
                        value={values.subjectCode}
                        onChange={handleChange('subjectCode')}
                        placeholder="CS301"
                    />
                    {errors.subjectCode && <span className="eg-error-text">{errors.subjectCode}</span>}
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="subjectName">Subject name</label>
                    <input
                        id="subjectName"
                        className={`eg-input ${errors.subjectName ? 'eg-input-error' : ''}`}
                        value={values.subjectName}
                        onChange={handleChange('subjectName')}
                        placeholder="Data Structures"
                    />
                    {errors.subjectName && <span className="eg-error-text">{errors.subjectName}</span>}
                </div>
            </div>

            <div className="eg-form-row">
                <div className="eg-field">
                    <label className="eg-label" htmlFor="credits">Credits</label>
                    <input
                        id="credits"
                        type="number"
                        min="1"
                        className={`eg-input ${errors.credits ? 'eg-input-error' : ''}`}
                        value={values.credits}
                        onChange={handleChange('credits')}
                        placeholder="4"
                    />
                    {errors.credits && <span className="eg-error-text">{errors.credits}</span>}
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="subjSemester">Semester</label>
                    <select
                        id="subjSemester"
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