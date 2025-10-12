import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BillsProvider } from './hooks/useBills';
import { ThemeProvider } from './hooks/useTheme';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { PasswordResetPage } from './components/PasswordResetPage';
import ErrorBoundary from './components/ErrorBoundary';
import { Dashboard } from './components/Dashboard';
import { BillingProcess } from './components/BillingProcess';
import { EnhancedBillingProcess } from './components/EnhancedBillingProcess';
import { BillsManagement } from './components/BillsManagement';
import { PatientsManagement } from './components/PatientsManagement';
import { TestPackagesManagement } from './components/TestPackagesManagement';
import { ReportsPage } from './components/ReportsPage';
import { ReportDownloadPage } from './pages/ReportDownload';
import { TestsManagement } from './components/TestsManagement';
import { DoctorsManagement } from './components/DoctorsManagement';
import { UserManagement } from './components/UserManagement';
import { UserProfile } from './components/UserProfile';
import { Statistics } from './components/Statistics';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { NotificationCenter } from './components/NotificationCenter';
import { CollectionCentersManagement } from './components/CollectionCentersManagement';
import { UpgradePlan } from './components/UpgradePlan';
import { ThemeToggle } from './components/ThemeToggle';
import SaaSPortal from './components/SaaSPortal';
import { SupabaseAuthService } from './services/auth';
import type { User, Page, Role } from './types';
import { Button } from './components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Menu, User as UserIcon } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { usePermissions, Permissions } from './hooks/usePermissions';

function AppContent() {
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser, login, logout } = useAuth();
    const authService = useMemo(() => new SupabaseAuthService(), []);

    const { permissions } = usePermissions({ userRole: currentUser?.role as Role, userId: currentUser?.id as string });

    useEffect(() => {
        const path = window.location.pathname;
        if (path.startsWith('/reportdownload')) {
            setCurrentPage('reports');
            return;
        }

        const { data: authListener } = authService.onAuthStateChange((_event, session) => {
            if (session) {
                setCurrentPage('dashboard');
            } else {
                setCurrentPage('login');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [authService]);

    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
            setCurrentPage('dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setCurrentPage('login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const onNavigate = (page: Page) => setCurrentPage(page);

    const renderPage = () => {
        const path = window.location.pathname;
        if (path.startsWith('/reportdownload')) {
            return <ReportDownloadPage />;
        }

        if (!currentUser) {
            switch (currentPage) {
                case 'login':
                    return <LoginPage onLogin={handleLogin} onNavigate={onNavigate} />;
                case 'signup':
                    return <SignUpPage onNavigate={onNavigate} />;
                case 'password-reset':
                    return <PasswordResetPage onNavigate={onNavigate} />;
                default:
                    return <LoginPage onLogin={handleLogin} onNavigate={onNavigate} />;
            }
        }

        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={onNavigate} user={currentUser as User} />;
            case 'billing':
                return <BillingProcess onNavigate={onNavigate} />;
            case 'enhanced-billing':
                return <EnhancedBillingProcess onNavigate={onNavigate} onBack={() => setCurrentPage('billing')} />;
            case 'bills':
                return <BillsManagement />;
            case 'patients':
                return <PatientsManagement />;
            case 'packages':
                return <TestPackagesManagement />;
            case 'reports':
                return <ReportsPage />;
            case 'tests':
                return <TestsManagement />;
            case 'doctors':
                return <DoctorsManagement />;
            case 'users':
                return <UserManagement />;
            case 'profile':
                return <UserProfile user={currentUser as User} onLogout={handleLogout} onUpdateProfile={() => {}} onNavigate={onNavigate} />;
            case 'statistics':
                return <Statistics />;
            case 'subscription':
                return <SubscriptionManagement />;
            case 'notifications':
                return <NotificationCenter />;
            case 'collection-centers':
                return <CollectionCentersManagement />;
            case 'upgrade-plan':
                return <UpgradePlan currentPlan={currentUser.subscriptionPlan} onNavigate={onNavigate} />;
            case 'saas-portal':
                return <SaaSPortal />;
            default:
                return <Dashboard onNavigate={onNavigate} user={currentUser as User} />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {currentUser && (
                <aside className={`bg-white dark:bg-gray-800 w-64 p-4 flex-shrink-0 ${sidebarOpen ? '' : 'hidden'} md:block`}>
                    <h1 className="text-2xl font-bold mb-4">PathoSync</h1>
                    <nav>
                        <ul>
                            <li><Button variant="ghost" onClick={() => setCurrentPage('dashboard')}>Dashboard</Button></li>
                            {permissions.billing?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('billing')}>Billing</Button></li>}
                            {permissions.bills?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('bills')}>Bills</Button></li>}
                            {permissions.patients?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('patients')}>Patients</Button></li>}
                            {permissions.packages?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('packages')}>Test Packages</Button></li>}
                            {permissions.reports?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('reports')}>Reports</Button></li>}
                            {permissions.tests?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('tests')}>Tests</Button></li>}
                            {permissions.doctors?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('doctors')}>Doctors</Button></li>}
                            {permissions.users?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('users')}>Users</Button></li>}
                            {permissions.statistics?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('statistics')}>Statistics</Button></li>}
                            {permissions.subscription?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('subscription')}>Subscription</Button></li>}
                            {permissions.collectionCenters?.canView && <li><Button variant="ghost" onClick={() => setCurrentPage('collection-centers')}>Collection Centers</Button></li>}
                        </ul>
                    </nav>
                </aside>
            )}
            <main className="flex-1 flex flex-col overflow-hidden">
                {currentUser && (
                    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                            <Menu />
                        </Button>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <NotificationCenter />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <UserIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setCurrentPage('profile')}>Profile</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCurrentPage('settings')}>Settings</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                )}
                <div className="flex-1 overflow-y-auto p-4">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <BillsProvider>
                        <AppContent />
                        <Toaster />
                    </BillsProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}