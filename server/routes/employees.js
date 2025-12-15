const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET all employees with pagination and filtering
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, departmentId } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
            ];
        }
        if (departmentId) {
            where.departmentId = parseInt(departmentId);
        }

        const employees = await prisma.employee.findMany({
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            include: { department: true },
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.employee.count({ where });

        res.json({
            data: employees,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { department: true },
        });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create employee
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, role, departmentId, status } = req.body;
        const employee = await prisma.employee.create({
            data: {
                firstName,
                lastName,
                email,
                role,
                status,
                departmentId: departmentId ? parseInt(departmentId) : null,
            },
        });
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update employee
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, role, departmentId, status } = req.body;
        const employee = await prisma.employee.update({
            where: { id: parseInt(req.params.id) },
            data: {
                firstName,
                lastName,
                email,
                role,
                status,
                departmentId: departmentId ? parseInt(departmentId) : null,
            },
        });
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        await prisma.employee.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
