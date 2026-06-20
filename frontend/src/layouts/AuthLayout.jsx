import { Link } from 'react-router-dom';
import Icon from '../assets/icons/Icon';

export default function AuthLayout({ children }) {
    return (
        <div className="eg-auth-shell">
            <div className="eg-auth-card" style={{ position: 'relative' }}>
                <Link 
                    to="/" 
                    className="eg-btn eg-btn-secondary eg-btn-sm" 
                    style={{ 
                        position: 'absolute', 
                        top: 24, 
                        right: 24, 
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                    aria-label="Back to Home"
                >
                    <Icon name="chevron-left" size={14} /> Home
                </Link>

                <div className="eg-auth-brand" style={{ paddingRight: 80 }}>
                    <div className="eg-auth-brand-mark">E</div>
                    <div>
                        <div className="eg-auth-brand-name">EduGrade</div>
                        <div className="eg-auth-brand-tag">Result Management System</div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}