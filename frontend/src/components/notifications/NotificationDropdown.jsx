import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import Icon from '../../assets/icons/Icon';

export default function NotificationDropdown({ 
    notifications, 
    onMarkAsRead, 
    onMarkAllAsRead, 
    onClose 
}) {
    return (
        <div 
            className="eg-card eg-notification-dropdown"
            style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 320,
                maxHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--color-paper)'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-cream)'
            }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)' }}>
                    Unread Alerts
                </span>
                {notifications.length > 0 && (
                    <button 
                        onClick={onMarkAllAsRead}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-gold)',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: 300
            }}>
                {notifications.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '30px 16px',
                        color: 'var(--color-slate-light)',
                        fontSize: 12.5
                    }}>
                        <div style={{ marginBottom: 6 }}>
                            <Icon name="bell" size={24} style={{ color: 'var(--color-slate-light)' }} />
                        </div>
                        You're all caught up!
                    </div>
                ) : (
                    notifications.map((n) => (
                        <NotificationItem 
                            key={n.id} 
                            notification={n} 
                            onReadClick={onMarkAsRead} 
                        />
                    ))
                )}
            </div>

            <div style={{
                padding: '8px',
                textAlign: 'center',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-cream)'
            }}>
                <Link 
                    to="/student/notifications" 
                    onClick={onClose}
                    style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: 'var(--color-navy)',
                        textDecoration: 'underline'
                    }}
                >
                    See all notifications
                </Link>
            </div>
        </div>
    );
}
