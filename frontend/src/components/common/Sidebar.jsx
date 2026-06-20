import { NavLink } from 'react-router-dom';
import Icon from '../../assets/icons/Icon';
import { NAV_LINKS } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ open, onClose }) {
    const { user, role, logout } = useAuth();
    const links = NAV_LINKS[role] || [];

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {open && <div className="eg-sidebar-backdrop" onClick={onClose} />}
            <aside className={`eg-sidebar ${open ? 'open' : ''}`}>
                <div className="eg-sidebar-brand">
                    <div className="eg-sidebar-brand-mark">E</div>
                    <div className="eg-sidebar-brand-text">
                        <span className="eg-sidebar-brand-name">EduGrade</span>
                        <span className="eg-sidebar-brand-role">{role}</span>
                    </div>
                </div>

                <nav className="eg-sidebar-nav">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={handleNavClick}
                            className={({ isActive }) => `eg-sidebar-link ${isActive ? 'active' : ''}`}
                        >
              <span className="eg-sidebar-link-icon">
                <Icon name={link.icon} size={17} />
              </span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="eg-sidebar-footer">
                    <div className="eg-sidebar-user">
                        <div className="eg-sidebar-avatar">{getInitials(user?.username)}</div>
                        <div>
                            <div className="eg-sidebar-username">{user?.username}</div>
                            <div className="eg-sidebar-userrole">{role}</div>
                        </div>
                    </div>
                    <button type="button" className="eg-sidebar-logout" onClick={logout}>
                        <Icon name="logout" size={15} />
                        Sign out
                    </button>
                </div>
            </aside>
        </>
    );
}