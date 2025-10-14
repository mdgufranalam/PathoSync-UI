require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8081;

// Import routes
const tenantsRouter = require('./routes/tenants');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const bulkActionsRouter = require('./routes/bulk-actions');
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const testsRouter = require('./routes/tests');
const reportsRouter = require('./routes/reports');
const publicReportsRouter = require('./routes/public-reports');
const billingRouter = require('./routes/billing');
const subscriptionPlansRouter = require('./routes/subscription-plans');
const testCategoriesRouter = require('./routes/test-categories');
const testParametersRouter = require('./routes/test-parameters');
const testPackagesRouter = require('./routes/test-packages');
const packageTestsRouter = require('./routes/package-tests');
const userSessionsRouter = require('./routes/user-sessions');
const billItemsRouter = require('./routes/bill-items');
const collectionCentersRouter = require('./routes/collection-centers');
const collectionCenterStaffRouter = require('./routes/collection-center-staff');
const saasRouter = require('./routes/saas'); // Import saas router
const storageRouter = require('./routes/storage'); // Import storage router
const whatsappRouter = require('./routes/whatsapp'); // Import whatsapp router
const razorpayRouter = require('./routes/razorpay'); // Import razorpay router
const upiRouter = require('./routes/upi'); // Import upi router
const statisticsRouter = require('./routes/statistics'); // Import statistics router
const exportRouter = require('./routes/export'); // Import export router
const rolesRouter = require('./routes/roles');
const permissionsRouter = require('./routes/permissions');
const healthRouter = require('./routes/health');

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('PathoSync API is running!');
});

// Mount routers
app.use('/api/tenants', tenantsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/users', bulkActionsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/tests', testsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/public/reports', publicReportsRouter);
app.use('./api/billing', billingRouter);
app.use('/api/subscription-plans', subscriptionPlansRouter);
app.use('/api/test-categories', testCategoriesRouter);
app.use('/api/test-parameters', testParametersRouter);
app.use('/api/test-packages', testPackagesRouter);
app.use('/api/package-tests', packageTestsRouter);
app.use('/api/user-sessions', userSessionsRouter);
app.use('/api/bill-items', billItemsRouter);
app.use('/api/collection-centers', collectionCentersRouter);
app.use('/api/collection-center-staff', collectionCenterStaffRouter);
app.use('/api/saas', saasRouter); // Mount saas router
app.use('/api/storage', storageRouter); // Mount storage router
app.use('/api/whatsapp', whatsappRouter); // Mount whatsapp router
app.use('/api/razorpay', razorpayRouter); // Mount razorpay router
app.use('/api/upi', upiRouter); // Mount upi router
app.use('/api/statistics', statisticsRouter); // Mount statistics router
app.use('/api/export', exportRouter); // Mount export router
app.use('/api/roles', rolesRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/health', healthRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
