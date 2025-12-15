const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET all departments
router.get('/', async (req, res) => {
    try {
        const departments = await prisma.department.findMany();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create department (helper for seeding/admin)
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        const department = await prisma.department.create({
            data: { name, description },
        });
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
