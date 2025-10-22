import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import routes
import schemaRoutes from './routes/schemas.js';
import authorityRoutes from './routes/authorities.js';
import verifyRoutes from './routes/verify.js';
import eventRoutes from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS for React Native frontend
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Land Verification Backend is running!');
});

// API Routes
app.use('/schemas', schemaRoutes);
app.use('/authorities', authorityRoutes);
app.use('/verify', verifyRoutes);
app.use('/events', eventRoutes);

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});