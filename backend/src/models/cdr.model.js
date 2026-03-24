const mongoose = require('mongoose');

const cdrSchema = new mongoose.Schema({
  callerName: { type: String, required: true },
  callerNumber: { type: String, required: true },
  receiverNumber: { type: String, required: true },
  city: { type: String, required: true },
  callDirection: { type: Boolean, required: true }, // true: inbound, false: outbound
  callStatus: { type: Boolean, required: true },    // true: success, false: failed
  callDuration: { type: Number, required: true },
  callCost: { type: String, required: true },
  callStartTime: { type: String, required: true },
  callEndTime: { type: String, required: true },
}, { timestamps: true });

// Normalize the output (convert _id to id)
cdrSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('CDR', cdrSchema);
