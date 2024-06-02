// models/SystemLog.js
import mongoose from 'mongoose';

const SystemLogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SystemLog = mongoose.model('SystemLog', SystemLogSchema);

export default SystemLog;