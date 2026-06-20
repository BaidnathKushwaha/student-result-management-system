import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Icon from '../assets/icons/Icon';
import { ROLES } from '../utils/constants';

export default function Home() {
    const { isAuthenticated, role } = useAuth();

    const ROLE_HOME = {
        [ROLES.ADMIN]: '/admin/dashboard',
        [ROLES.FACULTY]: '/faculty/dashboard',
        [ROLES.STUDENT]: '/student/dashboard',
    };

    return (
        <div className="eg-landing eg-animate-fade-in">
            {/* Header / Navbar */}
            <header className="eg-landing-header">
                <div className="eg-landing-brand">
                    <div className="eg-landing-brand-mark">E</div>
                    <div>
                        <div className="eg-landing-brand-name">EduGrade</div>
                        <div className="eg-landing-brand-tag">Result Management System</div>
                    </div>
                </div>
                <nav className="eg-landing-nav">
                    {isAuthenticated ? (
                        <Link to={ROLE_HOME[role] || '/login'} className="eg-btn eg-btn-primary eg-btn-sm eg-animate-pulse">
                            Go to Dashboard <Icon name="grid" size={14} />
                        </Link>
                    ) : (
                        <div style={{ display: 'flex', gap: 10 }}>
                            <Link to="/login" className="eg-btn eg-btn-secondary eg-btn-sm">Sign In</Link>
                            <Link to="/register" className="eg-btn eg-btn-primary eg-btn-sm">Register</Link>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <section className="eg-landing-hero">
                <div className="eg-landing-hero-content eg-animate-fade-in-up">
                    <span className="eg-eyebrow">Academic Registrar Portal</span>
                    <h1 className="eg-landing-hero-title">
                        Academic Records & Transcript Center
                    </h1>
                    <p className="eg-landing-hero-subtitle">
                        A modern, secure registry for managing college marks, computing course grades, generating transcripts, and tracking performance over semesters.
                    </p>
                    <div className="eg-landing-hero-actions">
                        {isAuthenticated ? (
                            <Link to={ROLE_HOME[role] || '/login'} className="eg-btn eg-btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/login" className="eg-btn eg-btn-primary">
                                Access Portal
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Role Portal Entrance cards */}
            <section className="eg-landing-portals">
                <div className="eg-landing-section-header eg-animate-fade-in-up">
                    <span className="eg-eyebrow">Access Portals</span>
                    <h2 className="eg-landing-section-title">Select Your Role</h2>
                    <p className="eg-landing-section-subtitle">Dedicated workspaces designed for administrators, teachers, and student profiles.</p>
                </div>
                <div className="eg-landing-portals-grid">
                    <div className="eg-landing-portal-card eg-animate-slide-up-1">
                        <div className="eg-landing-portal-icon admin">
                            <Icon name="users" size={24} />
                        </div>
                        <h3>Administrator Portal</h3>
                        <p>Manage the student directory, enlist faculty members, compile curriculum lists, update grade boundaries, and review college-wide reports.</p>
                        <Link to="/login" className="eg-landing-portal-link">Enter Admin Suite &rarr;</Link>
                    </div>

                    <div className="eg-landing-portal-card eg-animate-slide-up-2">
                        <div className="eg-landing-portal-icon faculty">
                            <Icon name="briefcase" size={24} />
                        </div>
                        <h3>Faculty Workplace</h3>
                        <p>View assigned student cohorts, record coursework test scores, upload external theory marks, update logs, and submit semester marksheets.</p>
                        <Link to="/login" className="eg-landing-portal-link">Enter Faculty Workspace &rarr;</Link>
                    </div>

                    <div className="eg-landing-portal-card eg-animate-slide-up-3">
                        <div className="eg-landing-portal-icon student">
                            <Icon name="book" size={24} />
                        </div>
                        <h3>Student Dashboard</h3>
                        <p>Access personal profiles, track overall CGPA, review grade-point distributions, and verify official semester grade sheets.</p>
                        <Link to="/login" className="eg-landing-portal-link">Check My Grades &rarr;</Link>
                    </div>
                </div>
            </section>

            {/* Features Details */}
            <section id="features" className="eg-landing-features">
                <div className="eg-landing-section-header">
                    <span className="eg-eyebrow">System Capabilities</span>
                    <h2 className="eg-landing-section-title">Engineered for Academic Integrity</h2>
                    <p className="eg-landing-section-subtitle">A robust feature suite that automates calculation and reduces administrative overhead.</p>
                </div>
                <div className="eg-landing-features-grid">
                    <div className="eg-landing-feature-item">
                        <div className="eg-landing-feature-checkbox">
                            <Icon name="check-circle" size={18} />
                        </div>
                        <div>
                            <h4>Automated Grading Scales</h4>
                            <p>Instantly maps cumulative marks out of 100 to standard grades (O, A+, A, B+, B, F) and grade points matching backend rules.</p>
                        </div>
                    </div>
                    <div className="eg-landing-feature-item">
                        <div className="eg-landing-feature-checkbox">
                            <Icon name="check-circle" size={18} />
                        </div>
                        <div>
                            <h4>Dynamic Performance Reports</h4>
                            <p>Generates class-wide subject marks, distribution models, and department pass-percentages for administrative decision making.</p>
                        </div>
                    </div>
                    <div className="eg-landing-feature-item">
                        <div className="eg-landing-feature-checkbox">
                            <Icon name="check-circle" size={18} />
                        </div>
                        <div>
                            <h4>Secure Authorization Layer</h4>
                            <p>Enforces role-based filters on the client and service layers. Students can view only their own records; faculty can edit only academic marks.</p>
                        </div>
                    </div>
                    <div className="eg-landing-feature-item">
                        <div className="eg-landing-feature-checkbox">
                            <Icon name="check-circle" size={18} />
                        </div>
                        <div>
                            <h4>Modern Responsive Layout</h4>
                            <p>Designed with a premium academic-registrar paper aesthetic, supporting desktop layouts and mobile navigation menus.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="eg-footer">
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <strong>EduGrade</strong> &middot; Academic Record Registry
                    </div>
                    <div style={{ color: 'var(--color-slate-light)' }}>
                        &copy; {new Date().getFullYear()} EduGrade. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
