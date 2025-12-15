const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create Departments
    const engineering = await prisma.department.upsert({
        where: { name: 'Engineering' },
        update: {},
        create: {
            name: 'Engineering',
            description: 'Software development and infrastructure',
        },
    });

    const hr = await prisma.department.upsert({
        where: { name: 'Human Resources' },
        update: {},
        create: {
            name: 'Human Resources',
            description: 'Employee relations and recruiting',
        },
    });

    const marketing = await prisma.department.upsert({
        where: { name: 'Marketing' },
        update: {},
        create: {
            name: 'Marketing',
            description: 'Brand awareness and market research',
        },
    });

    // Create Employees
    await prisma.employee.createMany({
        data: [
            {
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
                role: 'MANAGER',
                departmentId: engineering.id,
                status: 'ACTIVE',
            },
            {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob.johnson@example.com',
                role: 'EMPLOYEE',
                departmentId: engineering.id,
                status: 'ACTIVE',
            },
            {
                firstName: 'Charlie',
                lastName: 'Williams',
                email: 'charlie.williams@example.com',
                role: 'EMPLOYEE',
                departmentId: hr.id,
                status: 'ON_LEAVE',
            },
            {
                firstName: 'Diana',
                lastName: 'Brown',
                email: 'diana.brown@example.com',
                role: 'ADMIN',
                departmentId: marketing.id,
                status: 'ACTIVE',
            },
        ],
    });

    console.log('Seed data inserted');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
