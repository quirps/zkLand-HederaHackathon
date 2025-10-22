import { Router } from 'express';
import * as proofModel from '../models/proofModel.js';

const router = Router();

// POST /verify
router.post('/', (req, res) => {
  const { schemaId, authorityId, proofInput } = req.body;

  // 1. Basic validation
  if (!schemaId || !proofInput) {
    return res.status(400).json({ message: 'schemaId and proofInput are required' });
  }

  // 2. Log the request (optional)
  proofModel.create({
    schemaId,
    authorityId,
    proof: proofInput,
    status: 'pending',
  }).catch(console.error); // Log error but don't block response

  // 3. Simulate heavy proof generation/verification (3-second delay)
  console.log(`Simulating proof verification for schema: ${schemaId}...`);
  setTimeout(async () => {
    const verificationResult = {
      verified: true, // Mocked result
      timestamp: new Date().toISOString(),
      message: 'Verification successful (Mocked)',
    };
    
    // 4. Update log (optional)
    // In a real app, you'd find the pending record and update its status
    
    console.log('Verification complete.');
    res.status(200).json(verificationResult);
  }, 3000);
});

export default router;