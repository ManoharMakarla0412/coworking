const mongoose = require('mongoose');

const CallLogSchema = new mongoose.Schema({
  id: { type: String, required: true },
  assistantId: { type: String, required: true },
  phoneNumberId: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  orgId: { type: String, required: true },
  cost: { type: Number, required: true },
  customer: {
    number: { type: String, required: true },
  },
  status: { type: String, required: true },
  phoneCallProvider: { type: String, required: true },
  phoneCallProviderId: { type: String, required: true },
  phoneCallTransport: { type: String, required: true },
  name: { type: String, required: true },
  monitor: {
    listenUrl: { type: String, required: true },
    controlUrl: { type: String, required: true },
  },
  transport: { type: Object },
});

module.exports = mongoose.model('CallLog', CallLogSchema);
