// models/Token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  token_type: { type: String, required: true },
  expires_in: { type: Number, required: true },
  created_at: { type: Number, required: true },
  scope: { type: String, required: false },
  owner: { type: String, required: true },
  organization: { type: String, required: true },
});

module.exports = mongoose.model('Token', tokenSchema);
