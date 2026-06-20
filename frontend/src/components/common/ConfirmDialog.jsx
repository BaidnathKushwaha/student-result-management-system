import Icon from '../../assets/icons/Icon';

export default function ConfirmDialog({
                                          open,
                                          title = 'Are you sure?',
                                          message = 'This action cannot be undone.',
                                          confirmLabel = 'Delete',
                                          cancelLabel = 'Cancel',
                                          danger = true,
                                          loading = false,
                                          onConfirm,
                                          onCancel,
                                      }) {
    if (!open) return null;

    return (
        <div className="eg-modal-overlay" onClick={onCancel}>
            <div className="eg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="eg-modal-body" style={{ paddingTop: 32 }}>
                    <div className="eg-confirm-icon">
                        <Icon name="alert" size={22} />
                    </div>
                    <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
                    <p style={{ color: 'var(--color-slate)', fontSize: 14 }}>{message}</p>
                    <div className="eg-form-actions">
                        <button type="button" className="eg-btn eg-btn-secondary" onClick={onCancel} disabled={loading}>
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            className={`eg-btn ${danger ? 'eg-btn-danger' : 'eg-btn-primary'}`}
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading ? 'Please wait…' : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}