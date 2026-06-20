import Icon from '../../assets/icons/Icon';
import { formatDate } from '../../utils/helpers';

export default function Navbar({ onMenuClick, title }) {
    return (
        <header className="eg-topbar">
            <div className="eg-topbar-left">
                <button type="button" className="eg-topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
                    <Icon name="menu" size={22} />
                </button>
                {title && <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>}
            </div>
            <span className="eg-topbar-date">{formatDate()}</span>
        </header>
    );
}