const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  marqueeText: {
    type: String,
    default: "🎉 Welcome to Sri Bhoomi Organics 🌿"
  },
  promoImage: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('Settings', settingsSchema);