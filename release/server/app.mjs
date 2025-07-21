import express from "express";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import seedrandom from "seedrandom";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ===== Types =====
let services = [];
let masters = [];
let appointments = [];

function getDayStatus(date) {
    const normalizedDate = new Date(date);
    const rng = seedrandom(normalizedDate.toISOString());

    const weekDay = normalizedDate.getDay();
    if (weekDay === 0 || weekDay === 6) return "closed";
    if (rng() < 0.1) return "blocked";
    return "working";
}

// ===== Mock Data Generation =====
function generateMockData() {
    // Generate Services
    services = Array.from({ length: 25 }, () => ({
        id: uuidv4(),
        name: faker.commerce.productName(),
    }));

    // Generate Masters
    masters = Array.from({ length: 8 }, () => {
        const masterServices = faker.helpers.shuffle(services).slice(0, 3);
        return {
            id: uuidv4(),
            name: faker.person.fullName(),
            avatarUrl: faker.image.avatar(),
            services: masterServices,
        };
    });

    // Generate Appointments
    appointments = Array.from({ length: 50 }, () => {
        const master = randomElement(masters);
        const service = randomElement(master.services);
        const possibleStatuses = ["new", "cancelled", "paid", "confirmed"];

        const monthAfter = new Date();
        monthAfter.setMonth(new Date().getMonth() + 1);

        return {
            id: uuidv4(),
            customerName: faker.person.fullName(),
            at: faker.date.between({ from: new Date(), to: monthAfter }).toISOString(),
            service,
            master,
            notes: Math.random() < 0.3 ? faker.lorem.sentence() : null,
            status: randomElement(possibleStatuses),
        };
    }).filter((appointment) => {
        const dayStatus = getDayStatus(appointment.at);
        return dayStatus === "working";
    });
}

generateMockData();

// ===== Helpers =====
function paginate(array, page = 1, perPage = 10) {
    const offset = (page - 1) * perPage;
    return array.slice(offset, offset + perPage);
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

// ===== Endpoints =====

// GET /services
app.get("/services", (req, res) => {
    const { search = "", page = 1, perPage = 10 } = req.query;
    const filtered = services.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );
    res.json({ data: paginate(filtered, +page, +perPage), total: filtered.length });
});

// GET /masters
app.get("/masters", (req, res) => {
    const { search = "", page = 1, perPage = 10 } = req.query;
    const filtered = masters.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );
    res.json({ data: paginate(filtered, +page, +perPage), total: filtered.length });
});

// GET /appointments
app.get("/appointments", (req, res) => {
    const {
        since,
        until,
        serviceIds,
        masterIds,
        search = "",
        page = 1,
        perPage = 10,
    } = req.query;

    let filtered = [...appointments];

    if (since) filtered = filtered.filter((a) => new Date(a.at) >= new Date(since));
    if (until) filtered = filtered.filter((a) => new Date(a.at) <= new Date(until));
    if (serviceIds) {
        const ids = Array.isArray(serviceIds) ? serviceIds : [serviceIds];
        filtered = filtered.filter((a) => ids.includes(a.service.id));
    }
    if (masterIds) {
        const ids = Array.isArray(masterIds) ? masterIds : [masterIds];
        filtered = filtered.filter((a) => ids.includes(a.master.id));
    }
    if (search) {
        filtered = filtered.filter((a) =>
            a.customerName.toLowerCase().includes(search.toLowerCase())
        );
    }

    filtered = filtered.sort((a, b) => new Date(a.at) - new Date(b.at));

    res.json({
        data: paginate(filtered, +page, +perPage),
        total: filtered.length,
    });
});

// POST /appointments
app.post("/appointments", (req, res) => {
    const { at, serviceId, masterId, customerName, notes = null, status } = req.body;

    const service = services.find((s) => s.id === serviceId);
    const master = masters.find((m) => m.id === masterId);

    if (!service || !master) {
        return res.status(400).json({ error: "Invalid serviceId or masterId" });
    }

    if (!customerName) {
        return res.status(400).json({ error: "Missing customerName" });
    }

    if (!isValidDate(new Date(at))) {
        return res.status(400).json({ error: "Invalid at" });
    }

    const newAppointment = {
        id: uuidv4(),
        at,
        service,
        master,
        customerName,
        notes,
        status,
    };

    appointments.push(newAppointment);

    res.status(201).json({ data: newAppointment });
});

// GET /day-statuses
app.get("/day-statuses", (req, res) => {
    const { year, month } = req.query;

    if (year === undefined || month === undefined) {
        return res.status(400).json({ error: "Missing year or month" });
    }

    const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();
    const monthStart = new Date(year, parseInt(month), 1);
    monthStart.setHours(0, 0, 0, 0);

    const statuses = Array.from({ length: daysInMonth }, (_, index) => {
        const date = new Date(monthStart);
        date.setDate(index);
        return getDayStatus(date);
    });

    res.json({ data: statuses });
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Mock API server is running at http://localhost:${PORT}`);
});
