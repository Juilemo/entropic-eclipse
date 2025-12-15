import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, employee, onSave, departments }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'EMPLOYEE',
        departmentId: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                role: employee.role,
                departmentId: employee.departmentId || '',
                status: employee.status
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: 'EMPLOYEE',
                departmentId: departments[0]?.id || '',
                status: 'ACTIVE'
            });
        }
    }, [employee, departments]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '500px', maxWidth: '90%', animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <h3>{employee ? 'Edit Employee' : 'Add Employee'}</h3>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>First Name</label>
                            <input
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Last Name</label>
                            <input
                                required
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Department</label>
                            <select
                                value={formData.departmentId}
                                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="EMPLOYEE">Employee</option>
                                <option value="MANAGER">Manager</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="ON_LEAVE">On Leave</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
