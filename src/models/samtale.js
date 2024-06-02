import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const samtaleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  Navn: {
    type: String,
    required: true
  },
  Dato: {
    type: Date,
    required: true
  },
  Epost: {
    type: String,
    required: true
  },
  Year: {
    type: Number,
    required: true
  },
  Month: {
    type: String,
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    required: true
  },
  Grade: {
    type: Number,
    required: true
  }
}, { collection: 'Samtaler' }); // Explicitly set the collection name

const Samtaler = model('Samtaler', samtaleSchema);

export default Samtaler;
