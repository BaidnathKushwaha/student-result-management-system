import { useEffect, useState } from 'react';
import { fetchMyNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import NotificationItem from '../../components/notifications/NotificationItem';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const data = await fetchMyNotifications();
            setNotifications(data);
        } catch (err) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            toast.success('Notification read');
        } catch (err) {
            toast.error('Failed to update notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const data = await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success(`Marked ${data.markedRead || 0} notifications as read`);
        } catch (err) {
            toast.error('Failed to update notifications');
        }
    };

    const hasUnread = notifications.some(n => !n.isRead);

    return (
        <div className="eg-page" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="eg-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <div className="eg-eyebrow">Academic alerts</div>
                    <h1 className="eg-page-title">Notifications</h1>
                    <p className="eg-page-subtitle">Stay informed about your grades, publications, and class changes.</p>
                </div>
                {hasUnread && (
                    <button 
                        type="button" 
                        onClick={handleMarkAllAsRead} 
                        className="eg-btn eg-btn-primary eg-btn-sm"
                        style={{ height: 38 }}
                    >
                        <Icon name="check-circle" size={14} /> Mark all as read
                    </button>
                )}
            </div>

            <div className="eg-card">
                {loading ? (
                    <Loader label="Loading notification history..." />
                ) : notifications.length === 0 ? (
                    <div className="eg-empty">
                        <div className="eg-empty-title">All clear!</div>
                        <p style={{ color: 'var(--color-slate-light)', fontSize: 13 }}>
                            You have no notifications yet.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onReadClick={notification.isRead ? null : handleMarkAsRead}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
