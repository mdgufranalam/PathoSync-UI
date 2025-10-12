const express = require('express');
const router = express.Router();

// In-memory data store for tenants
let tenants = [
    { 
        id: '1', 
        name: 'Alpha Diagnostics', 
        subdomain: 'alpha', 
        email: 'admin@alpha.com', 
        subscription: 'Premium', 
        billingCycle: 'Yearly', 
        status: 'Active' 
    },
    { 
        id: '2', 
        name: 'Beta Health', 
        subdomain: 'beta', 
        email: 'contact@betahealth.com', 
        subscription: 'Standard', 
        billingCycle: 'Monthly', 
        status: 'Active' 
    },
];
let nextId = 3;

// GET all tenants
router.get('/tenants', (req, res) => {
    res.json({ success: true, data: tenants });
});

// POST a new tenant
router.post('/tenants', (req, res) => {
    const newTenant = { id: String(nextId++), ...req.body, status: 'Active' };
    tenants.push(newTenant);
    res.json({ success: true, data: newTenant });
});

// PUT (update) a tenant
router.put('/tenants/:id', (req, res) => {
    const { id } = req.params;
    const index = tenants.findIndex(t => t.id === id);
    if (index !== -1) {
        tenants[index] = { ...tenants[index], ...req.body };
        res.json({ success: true, data: tenants[index] });
    } else {
        res.status(404).json({ success: false, message: 'Tenant not found' });
    }
});

// DELETE a tenant
router.delete('/tenants/:id', (req, res) => {
    const { id } = req.params;
    const index = tenants.findIndex(t => t.id === id);
    if (index !== -1) {
        tenants.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Tenant not found' });
    }
});

module.exports = router;
