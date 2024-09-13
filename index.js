const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI; // Ensure this is correctly placed here

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const encryptedDataSchema = new mongoose.Schema({
  text: { type: String, required: true },
  algorithm: { type: String, required: true },
  cipherText: { type: String, required: true },
  generatedPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const EncryptedData = mongoose.model('EncryptedData', encryptedDataSchema);

app.post('/encrypt', async (req, res) => {
  console.log("post request received");
  const { text, algorithm, cipherText, generatedPassword } = req.body;

  if (!text || !algorithm || !cipherText || !generatedPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newEncryptedData = new EncryptedData({
      text,
      algorithm,
      cipherText,
      generatedPassword,
    });
    await newEncryptedData.save();
    res.status(201).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

