import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

export default function Layout({ children }) {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Employees', path: '/employees' },
        { icon: Settings, label: 'Departments', path: '/departments' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--bg-panel)',
                borderRight: '1px solid var(--border)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div className="logo" style={{ marginBottom: '3rem' }}>
                    Nexus<span style={{ color: 'var(--primary)' }}>HR</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
                                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: isActive ? 600 : 500,
                                        }}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="btn" style={{ width: '100%', justifyContent: 'center', border: 'none', background: 'transparent', color: 'var(--text-dim)' }}>
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>
                        {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                        }}>
                            JD
                        </div>
                    </div>
                </header>
                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
