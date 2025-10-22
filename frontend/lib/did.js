/**
 * Decentralized Identifier (DID) utilities
 * Mock implementation for hackathon demo
 */

// Static DIDs for demo purposes
const DEMO_LANDOWNER_DID = 'did:bug:landowner:1a2b3c4d5e6f7g8h9i0j';
const DEMO_ISSUER_DID = 'did:bug:issuer:blb:456789abcdef';
const DEMO_VERIFIER_DID = 'did:bug:verifier:xyz123456789';

/**
 * Generates a demo DID for a landowner
 * In production, this would create a unique DID per user
 * @returns {string} Demo landowner DID
 */
export function generateDemoDID() {
  return DEMO_LANDOWNER_DID;
}

/**
 * Gets the current user's DID (landowner)
 * @returns {string} User's DID
 */
export function getUserDID() {
  return DEMO_LANDOWNER_DID;
}

/**
 * Generates a demo DID for an issuer
 * @returns {string} Demo issuer DID
 */
export function generateIssuerDID() {
  return DEMO_ISSUER_DID;
}

/**
 * Gets the issuer's DID
 * @returns {string} Issuer's DID
 */
export function getIssuerDID() {
  return DEMO_ISSUER_DID;
}

/**
 * Generates a demo DID for a verifier
 * @returns {string} Demo verifier DID
 */
export function generateVerifierDID() {
  return DEMO_VERIFIER_DID;
}

/**
 * Gets the verifier's DID
 * @returns {string} Verifier's DID
 */
export function getVerifierDID() {
  return DEMO_VERIFIER_DID;
}

/**
 * Generates a random DID for testing
 * @param {string} type - Type of entity (landowner, issuer, verifier)
 * @returns {string} Random DID
 */
export function generateRandomDID(type = 'landowner') {
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `did:bug:${type}:${randomPart}`;
}

/**
 * Validates a DID format (basic check)
 * @param {string} did - DID to validate
 * @returns {boolean} Whether the DID is valid
 */
export function validateDID(did) {
  if (!did || typeof did !== 'string') {
    return false;
  }
  // Basic format check: did:bug:type:identifier
  const didPattern = /^did:bug:[a-z]+:[a-zA-Z0-9]+$/;
  return didPattern.test(did);
}