import { useState, useEffect } from 'react';

const EMPTY = { studentId: '', subjectId: '', internalMarks: '', externalMarks: '' };

export default function MarksForm({
                                      students = [],
                                      subjects = [],
                                      initialValues,
                                      onSubmit,
                                      onCancel,
                                      submitLabel = 'Save Marks',
                                      lockStudent = false,
                                  }) {
    const [values, setValues] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialValues) {
            setValues({
                studentId: initialValues.studentId ?? '',
                subjectId: initialValues.subjectId ?? '',
                internalMarks: initialValues.internalMarks ?? '',
                externalMarks: initialValues.externalMarks ?? '',
            });
        } else {
            setValues(EMPTY);
        }
    }, [initialValues]);

    const validate = () => {
        const next = {};
        if (!values.studentId) next.studentId = 'Select a student';
        if (!values.subjectId) next.subjectId = 'Select a subject';
        if (values.internalMarks === '') next.internalMarks = 'Required';
        else if (Number(values.internalMarks) < 0) next.internalMarks = 'Cannot be negative';
        if (values.externalMarks === '') next.externalMarks = 'Required';
        else if (Number(values.externalMarks) < 0) next.externalMarks = 'Cannot be negative';
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
                studentId: Number(values.studentId),
                subjectId: Number(values.subjectId),
                internalMarks: Number(values.internalMarks),
                externalMarks: Number(values.externalMarks),
            });
        } finally {
            setSubmitting(false);
        }
    };

    const total =
        values.internalMarks !== '' && values.externalMarks !== ''
            ? Number(values.internalMarks) + Number(values.externalMarks)
            : null;

    return (
        <form onSubmit={handleSubmit}>
            <div className="eg-form-row">
                <div className="eg-field">
                    <label className="eg-label" htmlFor="studentSelect">Student</label>
                    <select
                        id="studentSelect"
                        className={`eg-select ${errors.studentId ? 'eg-input-error' : ''}`}
                        value={values.studentId}
                        onChange={handleChange('studentId')}
                        disabled={lockStudent}
                    >
                        <option value="">Select student</option>
                        {students.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.usn})
                            </option>
                        ))}
                    </select>
                    {errors.studentId && <span className="eg-error-text">{errors.studentId}</span>}
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="subjectSelect">Subject</label>
                    <select
                        id="subjectSelect"
                        className={`eg-select ${errors.subjectId ? 'eg-input-error' : ''}`}
                        value={values.subjectId}
                        onChange={handleChange('subjectId')}
                    >
                        <option value="">Select subject</option>
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.subjectCode} — {s.subjectName}
                            </option>
                        ))}
                    </select>
                    {errors.subjectId && <span className="eg-error-text">{errors.subjectId}</span>}
                </div>
            </div>

            <div className="eg-form-row">
                <div className="eg-field">
                    <label className="eg-label" htmlFor="internalMarks">Internal marks</label>
                    <input
                        id="internalMarks"
                        type="number"
                        min="0"
                        className={`eg-input eg-mono ${errors.internalMarks ? 'eg-input-error' : ''}`}
                        value={values.internalMarks}
                        onChange={handleChange('internalMarks')}
                        placeholder="0–50"
                    />
                    {errors.internalMarks && <span className="eg-error-text">{errors.internalMarks}</span>}
                </div>
                <div className="eg-field">
                    <label className="eg-label" htmlFor="externalMarks">External marks</label>
                    <input
                        id="externalMarks"
                        type="number"
                        min="0"
                        className={`eg-input eg-mono ${errors.externalMarks ? 'eg-input-error' : ''}`}
                        value={values.externalMarks}
                        onChange={handleChange('externalMarks')}
                        placeholder="0–50"
                    />
                    {errors.externalMarks && <span className="eg-error-text">{errors.externalMarks}</span>}
                </div>
            </div>

            {total !== null && (
                <div className="eg-alert eg-alert-info" style={{ marginBottom: 0 }}>
                    Total marks will be recorded as <strong className="eg-mono">{total}</strong> / 100
                </div>
            )}

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