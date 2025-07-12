const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const swapRoutes = require('./routes/swapRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
connectDB(); 

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Skill Swap Platform API is running...');
});
app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
