import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const contactSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  givenName: {
    type: String,
    required: true
  },
  familyName: {
    type: String,
    required: true
  },
  notes: {
    type: String,
  },
  groupMembership: {
    type: String,
  },
  emailType: {
    type: String,
  },
  emailValue: {
    type: String,
    required: true
  },
  phoneType: {
    type: String,
  },
  phoneValue: {
    type: String,
    required: true
  },
  organization: {
    type: String,
  }
});

const Contact = model('Contact', contactSchema);

export default Contact;
