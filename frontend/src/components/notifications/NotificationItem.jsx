import Icon from '../../assets/icons/Icon';
import { formatDateTime } from '../../utils/helpers';

export default function NotificationItem({ notification, onReadClick }) {
    const { id, type, title, message, isRead, timestamp } = notification;

    const getIcon = () => {
        switch (type) {
            case 'MARKS_ENTERED':
            case 'MARKS_UPDATED':
                return 'edit';
            case 'MARKS_DELETED':
                return 'trash';
            case 'RESULT_GENERATED':
                return 'award';
            case 'SUBJECT_ASSIGNED':
                return 'book';
            default:
                return 'bell';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'RESULT_GENERATED':
                return 'var(--color-gold)';
            case 'MARKS_ENTERED':
            case 'MARKS_UPDATED':
                return 'var(--color-green)';
            case 'SUBJECT_ASSIGNED':
                return 'var(--color-navy)';
            default:
                return 'var(--color-slate)';
        }
    };

    const handleItemClick = () => {
        if (!isRead && onReadClick) {
            onReadClick(id);
        }
    };

    return (
        <div 
            onClick={handleItemClick}
            className={`eg-notification-item ${isRead ? 'read' : 'unread'}`}
            style={{
                display: 'flex',
                gap: 12,
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-border)',
                cursor: !isRead && onReadClick ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease',
                background: isRead ? 'transparent' : 'var(--color-gold-light)',
            }}
        >
            <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--color-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getIconColor(),
                flexShrink: 0
            }}>
                <Icon name={getIcon()} size={14} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontWeight: isRead ? 500 : 700, fontSize: 13, color: 'var(--color-navy)' }}>
                        {title}
                    </div>
                    {!isRead && (
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--color-red)',
                            flexShrink: 0
                        }} />
                    )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-slate)', marginTop: 2, lineHeight: 1.4 }}>
                    {message}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-slate-light)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    {formatDateTime(timestamp)}
                </div>
            </div>
        </div>
    );
}
