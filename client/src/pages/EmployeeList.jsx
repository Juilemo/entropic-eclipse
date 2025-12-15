import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import EmployeeModal from '../components/EmployeeModal';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, [search]); // Debounce in real app

    const fetchEmployees = async () => {
        try {
            const query = new URLSearchParams();
            if (search) query.append('search', search);

            const res = await fetch(`/api/employees?${query.toString()}`);
            const data = await res.json();
            setEmployees(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await fetch('/api/departments');
            const data = await res.json();
            setDepartments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (employeeData) => {
        try {
            const url = selectedEmployee
                ? `/api/employees/${selectedEmployee.id}`
                : '/api/employees';

            const method = selectedEmployee ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData)
            });

            if (res.ok) {
                setModalOpen(false);
                fetchEmployees();
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (err) {
            console.error(err);
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await fetch(`/api/employees/${id}`, { method: 'DELETE' });
            fetchEmployees();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'badge-active';
            case 'INACTIVE': return 'badge-inactive';
            case 'ON_LEAVE': return 'badge-leave';
            default: return 'badge-inactive';
        }
    };

    return (
        <div>
            <EmployeeModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                employee={selectedEmployee}
                onSave={handleSave}
                departments={departments}
            />

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '320px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => { setSelectedEmployee(null); setModalOpen(true); }}>
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            {/* Table Card */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead style={{ backgroundColor: 'var(--bg-panel)' }}>
                            <tr>
                                <th>Employee</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} style={{ transition: 'background-color 0.2s' }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--bg-panel)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '600',
                                                    border: '1px solid var(--border)'
                                                }}>
                                                    {emp.firstName[0]}{emp.lastName[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>{emp.firstName} {emp.lastName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{emp.role}</span></td>
                                        <td>{emp.department?.name || '—'}</td>
                                        <td>
                                            <span className={`badge ${getStatusClass(emp.status)}`}>
                                                {emp.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {new Date(emp.joinedDate).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    className="btn"
                                                    style={{ padding: '0.5rem', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
                                                    onClick={() => { setSelectedEmployee(emp); setModalOpen(true); }}
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    className="btn"
                                                    style={{ padding: '0.5rem', border: 'none', background: 'transparent', color: 'var(--danger)' }}
                                                    onClick={() => handleDelete(emp.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
