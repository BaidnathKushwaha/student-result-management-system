import { useEffect, useState } from 'react';
import { fetchAllAuditLogs, fetchAuditLogsByUsername, fetchAuditLogsByRole } from '../../services/notificationService';
import Icon from '../../assets/icons/Icon';
import Loader from '../../components/common/Loader';
import { formatDateTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Filters
    const [searchUser, setSearchUser] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    
    // Trigger reloading when page or filters change
    const loadLogs = async () => {
        setLoading(true);
        try {
            let data;
            const size = 15;
            if (searchUser.trim() !== '') {
                data = await fetchAuditLogsByUsername(searchUser.trim(), { page, size });
            } else if (roleFilter !== '') {
                data = await fetchAuditLogsByRole(roleFilter, { page, size });
            } else {
                data = await fetchAllAuditLogs({ page, size });
            }
            
            setLogs(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [page]);

    // Handle filter submit
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(0); // Reset to first page
        loadLogs();
    };

    const handleClearFilters = () => {
        setSearchUser('');
        setRoleFilter('');
        setPage(0);
        // Note: state changes are asynchronous, so we load directly
        setTimeout(loadLogs, 0);
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

    const formatAction = (action) => {
        return action.replace(/_/g, ' ');
    };

    return (
        <div className="eg-page">
            <div className="eg-page-header">
                <div className="eg-eyebrow">Governance</div>
                <h1 className="eg-page-title">Audit Logs</h1>
                <p className="eg-page-subtitle">Inspect historical activity and transaction logs across the entire system.</p>
            </div>

            {/* Filters bar */}
            <form onSubmit={handleFilterSubmit} className="eg-card eg-card-padded" style={{ marginBottom: 24, padding: 16 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 240px' }} className="eg-field">
                        <label className="eg-label" htmlFor="userSearch">Search Username</label>
                        <input
                            id="userSearch"
                            type="text"
                            className="eg-input"
                            placeholder="e.g. admin, faculty_jane"
                            value={searchUser}
                            onChange={(e) => {
                                setSearchUser(e.target.value);
                                setRoleFilter(''); // Clear other filter to avoid backend collision
                            }}
                        />
                    </div>

                    <div style={{ flex: '1 1 200px' }} className="eg-field">
                        <label className="eg-label" htmlFor="roleFilter">Filter by Role</label>
                        <select
                            id="roleFilter"
                            className="eg-select"
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setSearchUser(''); // Clear other filter to avoid backend collision
                            }}
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="FACULTY">FACULTY</option>
                            <option value="STUDENT">STUDENT</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="eg-btn eg-btn-primary eg-btn-sm" style={{ height: 42 }}>
                            <Icon name="search" size={14} /> Search
                        </button>
                        <button type="button" onClick={handleClearFilters} className="eg-btn eg-btn-secondary eg-btn-sm" style={{ height: 42 }}>
                            Clear
                        </button>
                    </div>
                </div>
            </form>

            {/* Logs Table */}
            <div className="eg-card">
                {loading ? (
                    <Loader label="Loading audit logs..." />
                ) : logs.length === 0 ? (
                    <div className="eg-empty">
                        <div className="eg-empty-title">No logs found</div>
                        <p style={{ color: 'var(--color-slate-light)', fontSize: 13 }}>
                            No entries match your search criteria. Try modifying your filter values.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="eg-table-wrap">
                            <table className="eg-table">
                                <thead>
                                    <tr>
                                        <th>Actor</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                        <th>Description</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td style={{ fontWeight: 600 }}>{log.username}</td>
                                            <td>
                                                <span className={`eg-badge ${getRoleClass(log.role)}`}>
                                                    {log.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ 
                                                    textTransform: 'capitalize', 
                                                    fontWeight: 500, 
                                                    color: 'var(--color-navy-light)',
                                                    fontSize: 12.5
                                                }}>
                                                    {formatAction(log.action)}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--color-slate)', maxWidth: '400px', lineHeight: 1.4 }}>
                                                {log.description}
                                            </td>
                                            <td className="eg-mono" style={{ fontSize: 12, color: 'var(--color-slate-light)' }}>
                                                {formatDateTime(log.timestamp)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="eg-pagination">
                            <span className="eg-pagination-info">
                                Showing page {page + 1} of {totalPages || 1} ({totalElements} total entries)
                            </span>
                            <div className="eg-pagination-controls">
                                <button
                                    type="button"
                                    className="eg-btn eg-btn-secondary eg-btn-sm"
                                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                    disabled={page === 0}
                                    style={{ padding: '6px 10px' }}
                                    aria-label="Previous page"
                                >
                                    <Icon name="chevron-left" size={14} />
                                </button>
                                <span className="eg-page-indicator">{page + 1}</span>
                                <button
                                    type="button"
                                    className="eg-btn eg-btn-secondary eg-btn-sm"
                                    onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={page >= totalPages - 1}
                                    style={{ padding: '6px 10px' }}
                                    aria-label="Next page"
                                >
                                    <Icon name="chevron-right" size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
