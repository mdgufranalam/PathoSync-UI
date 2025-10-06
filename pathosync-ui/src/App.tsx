import React, { useState, useEffect } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { BillsProvider } from './hooks/useBills';
import { ThemeProvider } from './hooks/useTheme';
import { LoginPage } from './components/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import { Dashboard } from './components/Dashboard';
import { BillingProcess } from './components/BillingProcess';
import { EnhancedBillingProcess } from './components/EnhancedBillingProcess';
import { BillsManagement } from './components/BillsManagement';
import { PatientsManagement } from './components/PatientsManagement';
import { TestPackagesManagement } from './components/TestPackagesManagement';
import { ReportsPage } from './components/ReportsPage';
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

import { Button } from './components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { PermissionService } from './types/permissions';

type Page = 'login' | 'dashboard' | 'billing' | 'enhanced-billing' | 'bills' | 'patients' | 'packages' | 'reports' | 'tests' | 'doctors' | 'users' | 'profile' | 'statistics' | 'subscription' | 'notifications' | 'collection-centers' | 'upgrade-plan';

function AppContent() {
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        id: 'user-1',
        name: 'Dr. Admin',
        email: 'admin@pathosync.com',
        phone: '+91-9876543210',
        role: 'Admin' as const,
        department: 'Administration',
        joinDate: '2024-01-01',
        subscriptionPlan: 'professional' as 'basic' | 'starter' | 'professional' | 'enterprise',
        organizationName: 'PathoCare Labs',
        permissions: ['All Modules Access', 'User Management', 'System Configuration', 'Reports Access'],
        // JWT and Session management
        accessToken: '',
        sessionId: '',
        refreshToken: ''
    });

    // Session management functions
    const setAuthTokens = (tokens: { accessToken: string; sessionId: string; refreshToken?: string }) => {
        setUser(prev => ({
            ...prev,
            accessToken: tokens.accessToken,
            sessionId: tokens.sessionId,
            refreshToken: tokens.refreshToken || ''
        }));

        // Store in localStorage for persistence
        localStorage.setItem('healthcareSaas_tokens', JSON.stringify(tokens));
    };

    const clearAuthTokens = () => {
        setUser(prev => ({
            ...prev,
            accessToken: '',
            sessionId: '',
            refreshToken: ''
        }));

        localStorage.removeItem('healthcareSaas_tokens');
    };

    // Check for existing session on app load
    useEffect(() => {
        const storedTokens = localStorage.getItem('healthcareSaas_tokens');
        if (storedTokens) {
            try {
                const tokens = JSON.parse(storedTokens);
                if (tokens.accessToken && tokens.sessionId) {
                    // Validate tokens with backend (in real app)
                    setAuthTokens(tokens);
                    setIsLoggedIn(true);
                    setCurrentPage('dashboard');
                }
            } catch (error) {
                console.error('Error parsing stored tokens:', error);
                clearAuthTokens();
            }
        }
    }, []);

    const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
        try {
            // Mock login API call
            const loginResponse = await mockLoginAPI(email, password, rememberMe);

            if (loginResponse.success) {
                // Set user data
                setUser({
                    ...loginResponse.user,
                    accessToken: loginResponse.tokens.accessToken,
                    sessionId: loginResponse.tokens.sessionId,
                    refreshToken: loginResponse.tokens.refreshToken
                });

                // Store tokens
                setAuthTokens(loginResponse.tokens);

                // Set subscription plan globally for components to access
                (window as any).userSubscriptionPlan = loginResponse.user.subscriptionPlan;

                setIsLoggedIn(true);
                setCurrentPage('dashboard');
            } else {
                alert('Invalid credentials. Test Users (all use password: password123):\n\n🔹 ADMIN ROLES:\n- admin@basic.com\n- admin@professional.com\n- admin@enterprise.com\n\n🔹 MANAGER ROLES:\n- manager@professional.com\n- manager@enterprise.com\n\n🔹 TECHNICIAN ROLES:\n- tech@starter.com\n- tech@professional.com\n\n🔹 COLLECTION AGENT ROLES:\n- collector@professional.com\n- collector@enterprise.com\n\n🔹 DATA ENTRY ROLES:\n- dataentry@basic.com\n- dataentry@starter.com\n\n🔹 VIEWER ROLES:\n- viewer@basic.com\n- viewer@professional.com');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    // Mock login API function
    const mockLoginAPI = async (email: string, password: string, rememberMe: boolean) => {
        return new Promise<any>((resolve) => {
            setTimeout(() => {
                // Mock user database with different roles and subscription plans for testing permissions
                const mockUsers = {
                    // ADMIN USERS - Full access across subscription tiers
                    'admin@basic.com': {
                        id: 'admin-basic-001',
                        name: 'Dr. Admin Basic',
                        email: 'admin@basic.com',
                        phone: '+91-9876543210',
                        role: 'Admin' as const,
                        department: 'Administration',
                        joinDate: '2024-01-01',
                        subscriptionPlan: 'basic' as const,
                        organizationName: 'Basic Healthcare Clinic',
                        permissions: ['All Modules Access', 'User Management', 'Basic Plan Features']
                    },
                    'admin@professional.com': {
                        id: 'admin-pro-001',
                        name: 'Dr. Admin Professional',
                        email: 'admin@professional.com',
                        phone: '+91-9876543211',
                        role: 'Admin' as const,
                        department: 'Administration',
                        joinDate: '2024-01-01',
                        subscriptionPlan: 'professional' as const,
                        organizationName: 'Professional Diagnostics Lab',
                        permissions: ['All Modules Access', 'User Management', 'Collection Centers', 'Advanced Reports']
                    },
                    'admin@enterprise.com': {
                        id: 'admin-ent-001',
                        name: 'Dr. Admin Enterprise',
                        email: 'admin@enterprise.com',
                        phone: '+91-9876543212',
                        role: 'Admin' as const,
                        department: 'Administration',
                        joinDate: '2024-01-01',
                        subscriptionPlan: 'enterprise' as const,
                        organizationName: 'Enterprise Healthcare Network',
                        permissions: ['All Modules Access', 'User Management', 'Collection Centers', 'Advanced Analytics', 'API Access']
                    },

                    // MANAGER USERS - Management level access
                    'manager@professional.com': {
                        id: 'manager-pro-001',
                        name: 'Sarah Manager',
                        email: 'manager@professional.com',
                        phone: '+91-9876543213',
                        role: 'Manager' as const,
                        department: 'Operations',
                        joinDate: '2024-02-01',
                        subscriptionPlan: 'professional' as const,
                        organizationName: 'Professional Diagnostics Lab',
                        permissions: ['Dashboard:View', 'Bills:All', 'Patients:All', 'Tests:Edit', 'Packages:All', 'Reports:All', 'Users:View', 'Doctors:All', 'Collection Centers:View']
                    },
                    'manager@enterprise.com': {
                        id: 'manager-ent-001',
                        name: 'Michael Manager',
                        email: 'manager@enterprise.com',
                        phone: '+91-9876543214',
                        role: 'Manager' as const,
                        department: 'Operations',
                        joinDate: '2024-02-01',
                        subscriptionPlan: 'enterprise' as const,
                        organizationName: 'Enterprise Healthcare Network',
                        permissions: ['Dashboard:View', 'Bills:All', 'Patients:All', 'Tests:All', 'Packages:All', 'Reports:All', 'Users:View', 'Doctors:All', 'Collection Centers:All', 'Statistics:View']
                    },

                    // TECHNICIAN USERS - Lab operations focus
                    'tech@starter.com': {
                        id: 'tech-starter-001',
                        name: 'Ravi Technician',
                        email: 'tech@starter.com',
                        phone: '+91-9876543215',
                        role: 'Technician' as const,
                        department: 'Laboratory',
                        joinDate: '2024-03-01',
                        subscriptionPlan: 'starter' as const,
                        organizationName: 'Starter Lab Services',
                        permissions: ['Dashboard:View', 'Tests:Edit', 'Packages:View', 'Reports:Edit', 'Patients:View']
                    },
                    'tech@professional.com': {
                        id: 'tech-pro-001',
                        name: 'Priya Technician',
                        email: 'tech@professional.com',
                        phone: '+91-9876543216',
                        role: 'Technician' as const,
                        department: 'Laboratory',
                        joinDate: '2024-03-01',
                        subscriptionPlan: 'professional' as const,
                        organizationName: 'Professional Diagnostics Lab',
                        permissions: ['Dashboard:View', 'Tests:All', 'Packages:Edit', 'Reports:All', 'Patients:Edit', 'Collection Centers:View']
                    },

                    // COLLECTION AGENT USERS - Sample collection focus
                    'collector@professional.com': {
                        id: 'collector-pro-001',
                        name: 'Amit Collector',
                        email: 'collector@professional.com',
                        phone: '+91-9876543217',
                        role: 'Collection Agent' as const,
                        department: 'Collection',
                        joinDate: '2024-04-01',
                        subscriptionPlan: 'professional' as const,
                        organizationName: 'Professional Diagnostics Lab',
                        permissions: ['Dashboard:View', 'Bills:View', 'Patients:Edit', 'Collection Centers:Edit', 'Reports:View']
                    },
                    'collector@enterprise.com': {
                        id: 'collector-ent-001',
                        name: 'Neha Collector',
                        email: 'collector@enterprise.com',
                        phone: '+91-9876543218',
                        role: 'Collection Agent' as const,
                        department: 'Collection',
                        joinDate: '2024-04-01',
                        subscriptionPlan: 'enterprise' as const,
                        organizationName: 'Enterprise Healthcare Network',
                        permissions: ['Dashboard:View', 'Bills:View', 'Patients:All', 'Collection Centers:All', 'Reports:View', 'Doctors:View']
                    },

                    // DATA ENTRY USERS - Limited to data input
                    'dataentry@basic.com': {
                        id: 'dataentry-basic-001',
                        name: 'Kumar Data Entry',
                        email: 'dataentry@basic.com',
                        phone: '+91-9876543219',
                        role: 'Data Entry' as const,
                        department: 'Data Management',
                        joinDate: '2024-05-01',
                        subscriptionPlan: 'basic' as const,
                        organizationName: 'Basic Healthcare Clinic',
                        permissions: ['Dashboard:View', 'Patients:Create', 'Tests:View', 'Reports:Create']
                    },
                    'dataentry@starter.com': {
                        id: 'dataentry-starter-001',
                        name: 'Anita Data Entry',
                        email: 'dataentry@starter.com',
                        phone: '+91-9876543220',
                        role: 'Data Entry' as const,
                        department: 'Data Management',
                        joinDate: '2024-05-01',
                        subscriptionPlan: 'starter' as const,
                        organizationName: 'Starter Lab Services',
                        permissions: ['Dashboard:View', 'Bills:Create', 'Patients:Create', 'Tests:View', 'Reports:Create', 'Doctors:Create']
                    },

                    // VIEWER USERS - Read-only access
                    'viewer@basic.com': {
                        id: 'viewer-basic-001',
                        name: 'Sunita Viewer',
                        email: 'viewer@basic.com',
                        phone: '+91-9876543221',
                        role: 'Viewer' as const,
                        department: 'Quality Assurance',
                        joinDate: '2024-06-01',
                        subscriptionPlan: 'basic' as const,
                        organizationName: 'Basic Healthcare Clinic',
                        permissions: ['Dashboard:View', 'Bills:View', 'Patients:View', 'Tests:View', 'Reports:View']
                    },
                    'viewer@professional.com': {
                        id: 'viewer-pro-001',
                        name: 'Rajesh Viewer',
                        email: 'viewer@professional.com',
                        phone: '+91-9876543222',
                        role: 'Viewer' as const,
                        department: 'Quality Assurance',
                        joinDate: '2024-06-01',
                        subscriptionPlan: 'professional' as const,
                        organizationName: 'Professional Diagnostics Lab',
                        permissions: ['Dashboard:View', 'Bills:View', 'Patients:View', 'Tests:View', 'Packages:View', 'Reports:View', 'Doctors:View', 'Collection Centers:View', 'Users:View', 'Statistics:View']
                    }
                };

                const userData = mockUsers[email as keyof typeof mockUsers];

                if (userData && password === 'password123') {
                    // Generate mock JWT tokens
                    const mockTokens = {
                        accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
                            sub: userData.id,
                            email: userData.email,
                            role: userData.role,
                            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
                            iat: Math.floor(Date.now() / 1000)
                        }))}`,
                        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        refreshToken: rememberMe ? `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : ''
                    };

                    resolve({
                        success: true,
                        user: userData,
                        tokens: mockTokens,
                        message: 'Login successful'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }
            }, 1000);
        });
    };

    const handleLogout = () => {
        // Clear tokens
        clearAuthTokens();

        // Clear global subscription plan
        (window as any).userSubscriptionPlan = undefined;

        setIsLoggedIn(false);
        setCurrentPage('login');
        setSidebarOpen(false);
    };

    const handleUpdateProfile = (userData: any) => {
        console.log('Profile updated:', userData);
    };

    // Access control helpers
    const hasCollectionCentersAccess = () => {
        return user.subscriptionPlan === 'professional' || user.subscriptionPlan === 'enterprise';
    };

    // Permission checking functions
    const canAccessModule = (moduleKey: string) => {
        // Map navigation IDs to permission modules
        const moduleMapping = {
            'dashboard': 'Dashboard',
            'billing': 'Billing/Enhanced Billing',
            'enhanced-billing': 'Billing/Enhanced Billing',
            'bills': 'Bills Management',
            'patients': 'Patients Management',
            'tests': 'Test Packages', // Tests are managed as part of packages
            'packages': 'Test Packages',
            'reports': 'Reports Page',
            'doctors': 'Doctors Management',
            'users': 'Users Management',
            'profile': 'Profile',
            'statistics': 'Statistics/Analytics',
            'subscription': 'Subscription Management',
            'notifications': 'Notifications',
            'collection-centers': 'Collection Centers',
            'upgrade-plan': 'Upgrade Plan'
        };

        const moduleName = moduleMapping[moduleKey as keyof typeof moduleMapping];
        if (!moduleName) return false;

        // Use PermissionService to check access
        return PermissionService.canAccessModule(user.role, moduleName);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={setCurrentPage} user={user} />;
            case 'billing':
                return <BillingProcess onBack={() => setCurrentPage('dashboard')} />;
            case 'enhanced-billing':
                return <EnhancedBillingProcess onBack={() => setCurrentPage('dashboard')} />;
            case 'bills':
                return <BillsManagement />;
            case 'patients':
                return <PatientsManagement currentUser={user} />;
            case 'packages':
                return <TestPackagesManagement />;
            case 'reports':
                return <ReportsPage />;
            case 'tests':
                return <TestsManagement />;
            case 'doctors':
                return <DoctorsManagement />;
            case 'users':
                return <UserManagement currentUser={user} />;
            case 'profile':
                return <UserProfile user={user} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />;
            case 'statistics':
                return <Statistics />;
            case 'subscription':
                return <SubscriptionManagement />;
            case 'notifications':
                return <NotificationCenter />;
            case 'collection-centers':
                // Access control for Collection Centers
                if (!hasCollectionCentersAccess()) {
                    return <UpgradePlan
                        currentPlan={user.subscriptionPlan}
                        onNavigate={setCurrentPage}
                        restrictedFeature="Collection Centers Management"
                    />;
                }
                return <CollectionCentersManagement />;
            case 'upgrade-plan':
                return <UpgradePlan
                    currentPlan={user.subscriptionPlan}
                    onNavigate={setCurrentPage}
                />;
            default:
                return <Dashboard onNavigate={setCurrentPage} user={user} />;
        }
    };

    // Dynamic navigation based on permissions and subscription plan
    const getNavigationItems = () => {
        const allItems = [
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'enhanced-billing', label: 'Enhanced Billing', icon: '💰' },
            { id: 'billing', label: 'Simple Billing', icon: '💳' },
            { id: 'bills', label: 'Bills Management', icon: '🧾' },
            { id: 'patients', label: 'Patients', icon: '👤' },
            { id: 'tests', label: 'Tests', icon: '🧪' },
            { id: 'packages', label: 'Test Packages', icon: '📦' },
            { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'reports', label: 'Reports', icon: '📊' },
            { id: 'statistics', label: 'Statistics', icon: '📈' },
            { id: 'subscription', label: 'Subscription', icon: '📋' },
            { id: 'notifications', label: 'Notifications', icon: '📢' },
            { id: 'collection-centers', label: 'Collection Centers', icon: '🏢' },
        ];

        // Filter items based on permissions and subscription plan
        return allItems.filter(item => {
            // Always show profile (handled separately)
            if (item.id === 'profile') return true;

            // Check subscription plan restrictions for Collection Centers
            if (item.id === 'collection-centers' && !hasCollectionCentersAccess()) {
                return false;
            }

            // Check role-based permissions
            return canAccessModule(item.id);
        });
    };

    const navigationItems = getNavigationItems();

    // Show login page if not logged in
    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 ease-in-out`}>
                <div className="w-64 h-full bg-background border-r border-border flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl text-blue-600">HealthCare SaaS</h1>
                                <p className="text-sm text-muted-foreground">Clinic Management</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setCurrentPage(item.id as Page);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentPage === item.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-border">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-primary font-medium">Dr</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">administrator</p>
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => {
                                    setCurrentPage('profile');
                                    setSidebarOpen(false);
                                }}>
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                    setCurrentPage('profile');
                                    setSidebarOpen(false);
                                }}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                {renderPage()}
            </div>
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