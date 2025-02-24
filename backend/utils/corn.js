const cron = require('node-cron');
const refreshCalendlyToken = require('../controllers/tokenController');

// Schedule the script to run every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('Running token refresh at:', new Date().toISOString());
  await refreshCalendlyToken();
});

console.log('Cron job for token refresh initialized.');
