import DashboardShell from './DashboardShell';
import NotificationBell from '../components/notifications/NotificationBell';

export default function StudentLayout() {
    return <DashboardShell title="Student Portal" headerActions={<NotificationBell />} />;
}