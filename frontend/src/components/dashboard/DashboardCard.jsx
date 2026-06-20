import Icon from '../../assets/icons/Icon';

export default function DashboardCard({ label, value, icon, accent = 'navy', footer }) {
    return (
        <div className={`eg-stat-card accent-${accent}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="eg-stat-label">{label}</div>
                {icon && (
                    <span style={{ color: 'var(--color-slate-light)' }}>
            <Icon name={icon} size={18} />
          </span>
                )}
            </div>
            <div className="eg-stat-value">{value}</div>
            {footer && <div className="eg-stat-footer">{footer}</div>}
        </div>
    );
}