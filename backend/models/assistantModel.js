const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User reference
  name: { type: String }, // Assistant's name
  voice: {
    voiceId: { type: String },
    provider: { type: String },
  },
  model: {
    model: { type: String }, // Model type, e.g., "gpt-3.5-turbo"
    messages: [
      {
        role: { type: String }, // Role (e.g., "system", "user")
        content: { type: String }, // Message content
      },
    ],
    provider: { type: String }, // Provider for the model
    toolIds: [{ type: String }], // Array of tool IDs
  },
  firstMessage: { type: String }, // First message content
  voicemailMessage: { type: String }, // Voicemail message
  endCallMessage: { type: String }, // End call message
  transcriber: {
    model: { type: String },
    provider: { type: String },
  },
  clientMessages: [String], // Array of client message types
  serverMessages: [String], // Array of server message types
  endCallPhrases: [String], // Array of phrases to end the call
  recordingEnabled: { type: Boolean, default: false }, // Recording flag
  isServerUrlSecretSet: { type: Boolean, default: false }, // Server URL secret flag
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
  updatedAt: { type: Date, default: Date.now }, // Timestamp for updates
});

module.exports = mongoose.model('Assistant', assistantSchema);
