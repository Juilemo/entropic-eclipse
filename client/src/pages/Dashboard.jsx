import React, { useEffect, useState } from 'react';
import { Users, Building2, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        employeesByDept: []
    });

    useEffect(() => {
        // In a real app, I'd fetch these stats from the API
        // For now, I'll simulate or fetch raw data and calculate
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                fetch('/api/employees'),
                fetch('/api/departments')
            ]);
            const empData = await empRes.json();
            const deptData = await deptRes.json();

            // Calc stats
            const deptCounts = {};
            empData.data.forEach(e => {
                const dName = e.department?.name || 'Unassigned';
                deptCounts[dName] = (deptCounts[dName] || 0) + 1;
            });

            const chartData = Object.keys(deptCounts).map(name => ({
                name,
                value: deptCounts[name]
            }));

            setStats({
                totalEmployees: empData.pagination.total,
                totalDepartments: deptData.length,
                employeesByDept: chartData
            });
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
    };

    const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={Users}
                    color="var(--primary)"
                />
                <StatCard
                    title="Departments"
                    value={stats.totalDepartments}
                    icon={Building2}
                    color="var(--accent)"
                />
                <StatCard
                    title="Active Roles"
                    value="3"
                    icon={Briefcase}
                    color="var(--success)"
                />
            </div>

            {/* Chart Section */}
            <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Department Distribution</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.employeesByDept}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.employeesByDept.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    {stats.employeesByDept.map((entry, index) => (
                        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{entry.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: `${color}20`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon size={28} />
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{value}</div>
            </div>
        </div>
    );
}
