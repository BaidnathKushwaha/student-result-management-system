import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecentAuditLogs } from '../../services/notificationService';
import { formatDateTime } from '../../utils/helpers';
import Icon from '../../assets/icons/Icon';
import Loader from '../common/Loader';

export default function RecentActivities() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const data = await fetchRecentAuditLogs();
                setLogs(data);
            } catch (err) {
                console.error('Failed to load recent activities:', err);
            } finally {
                setLoading(false);
            }
        };
        loadLogs();
    }, []);

    const getActionIcon = (action) => {
        if (action.includes('REGISTERED') || action.includes('LOGIN')) return 'user';
        if (action.includes('STUDENT')) return 'users';
        if (action.includes('FACULTY')) return 'briefcase';
        if (action.includes('SUBJECT')) return 'book';
        if (action.includes('MARKS')) return 'edit';
        if (action.includes('RESULT')) return 'award';
        if (action.includes('DOWNLOAD')) return 'download';
        return 'activity';
    };

    const getRoleClass = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'eg-badge-slate';
            case 'FACULTY':
                return 'eg-badge-gold';
            case 'STUDENT':
                return 'eg-badge-green';
            default:
                return 'eg-badge-slate';
        }
    };

    if (loading) {
        return <Loader inline label="Loading activities..." />;
    }

    return (
        <div className="eg-card">
            <div className="eg-card-header">
                <span className="eg-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name="activity" size={18} style={{ color: 'var(--color-navy)' }} />
                    Recent Activities
                </span>
                <Link to="/admin/audit-logs" className="eg-btn eg-btn-secondary eg-btn-sm">
                    View All Logs
                </Link>
            </div>
            
            <div className="eg-card-padded" style={{ padding: '20px 24px' }}>
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-slate-light)' }}>
                        No activities logged yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {logs.map((log) => (
                            <div key={log.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'var(--color-cream)',
                                    color: 'var(--color-navy)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Icon name={getActionIcon(log.action)} size={14} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontWeight: 600, fontSize: 13.5 }}>{log.username}</span>
                                            <span className={`eg-badge ${getRoleClass(log.role)}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                                                {log.role}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: 11, color: 'var(--color-slate-light)', fontFamily: 'var(--font-mono)' }}>
                                            {formatDateTime(log.timestamp)}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--color-slate)', marginTop: 4, lineHeight: 1.4 }}>
                                        {log.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
