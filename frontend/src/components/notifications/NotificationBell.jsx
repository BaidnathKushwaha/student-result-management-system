import { useEffect, useState, useRef } from 'react';
import Icon from '../../assets/icons/Icon';
import NotificationDropdown from './NotificationDropdown';
import {
    fetchUnreadNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
} from '../../services/notificationService';
import toast from 'react-hot-toast';

export default function NotificationBell() {
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const containerRef = useRef(null);

    const loadNotifications = async () => {
        try {
            const [notifications, countData] = await Promise.all([
                fetchUnreadNotifications(),
                fetchUnreadCount()
            ]);
            setUnreadNotifications(notifications);
            setUnreadCount(countData.unreadCount || 0);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    };

    useEffect(() => {
        loadNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Handle clicks outside of dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleToggle = () => {
        setDropdownOpen(!dropdownOpen);
        if (!dropdownOpen) {
            loadNotifications();
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setUnreadNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
            toast.success('Notification marked as read');
        } catch (err) {
            toast.error('Failed to update notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const data = await markAllAsRead();
            setUnreadNotifications([]);
            setUnreadCount(0);
            toast.success(`Marked ${data.markedRead || 0} notifications as read`);
        } catch (err) {
            toast.error('Failed to update notifications');
        }
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
                type="button"
                onClick={handleToggle}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-navy)',
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: '50%',
                    transition: 'background-color 0.15s ease',
                }}
                className="hover:bg-gray-100"
                aria-label="Notifications"
            >
                <Icon name="bell" size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        background: 'var(--color-red)',
                        color: 'var(--color-paper)',
                        fontSize: 9,
                        fontWeight: 700,
                        height: 16,
                        minWidth: 16,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                        boxShadow: '0 0 0 2px var(--color-paper)',
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {dropdownOpen && (
                <NotificationDropdown
                    notifications={unreadNotifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClose={() => setDropdownOpen(false)}
                />
            )}
        </div>
    );
}
