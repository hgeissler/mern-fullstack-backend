// /backend/data.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// our database's data structure
const DataSchema = new Schema(
  {
    id: Number,
    message: String
  },
  { timestamps: true}
);

// use the new Schema
// it can be modified
module.exports = mongoose.model("Data", DataSchema);

// POSTMAN post:
// headers: content-type: application/json
// body: raw, JSON 
// {
// 	"id": 1233,
// 	"message": "ASD"
// }