/**
 * Mock commitment/hash generation utility for hackathon demo
 * In production, this would use proper cryptographic functions
 */

/**
 * Generates a mock commitment hash from data
 * @param {Object} data - The data to generate a commitment from
 * @returns {string} A mock hash string
 */
export function generateCommitment(data) {
  // Convert data to string
  const dataString = JSON.stringify(data);
  
  // Generate a simple mock hash (not cryptographically secure)
  // For demo purposes only
  const hash = '0x' + Math.random().toString(16).substr(2, 12) + 
                Math.random().toString(16).substr(2, 12);
  
  return hash;
}

/**
 * Generates a deterministic-looking hash based on input
 * (Still not secure, just looks more realistic for demo)
 * @param {string} input - Input string to hash
 * @returns {string} Mock hash
 */
export function mockHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex-like string
  const hexHash = Math.abs(hash).toString(16).padStart(12, '0');
  return '0x' + hexHash + Math.random().toString(16).substr(2, 12);
}

/**
 * Verifies a commitment (mock implementation)
 * @param {string} commitment - The commitment hash to verify
 * @param {Object} data - The data to verify against
 * @returns {boolean} Always returns true for demo
 */
export function verifyCommitment(commitment, data) {
  // In a real implementation, this would verify the commitment
  // For demo, we just check if commitment exists
  return commitment && commitment.length > 0;
}