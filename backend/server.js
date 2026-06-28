const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 🚨 CORS को पूरी तरह ओपन कर रहे हैं ताकि कोई ब्लॉक न कर सके
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// MongoDB Connection (सुनिश्चित करें कि यह सही है)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tasktracker')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes कनेक्शन
app.use('/api/tasks', require('./routes/taskRoutes'));

// 5001 पोर्ट का उपयोग
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is absolutely running on port ${PORT}`);
});