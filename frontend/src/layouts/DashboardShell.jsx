import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function DashboardShell({ title, headerActions }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="eg-app-shell">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="eg-main">
                <Navbar title={title} onMenuClick={() => setSidebarOpen(true)}>
                    {headerActions}
                </Navbar>
                <div style={{ flex: 1 }}>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    );
}