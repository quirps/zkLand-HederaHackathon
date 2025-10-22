import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const CREDENTIALS_KEY = '@zkland_credentials';
const ISSUED_RECORDS_KEY = '@zkland_issued_records';
const USER_DATA_KEY = '@zkland_user_data';

// Credential management
export const saveCredential = async (credential) => {
  try {
    const existing = await getCredentials();
    const updated = [...existing, credential];
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving credential:', error);
    return false;
  }
};

export const getCredentials = async () => {
  try {
    const data = await AsyncStorage.getItem(CREDENTIALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting credentials:', error);
    return [];
  }
};

export const deleteCredential = async (credentialId) => {
  try {
    const existing = await getCredentials();
    const filtered = existing.filter(c => c.id !== credentialId);
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting credential:', error);
    return false;
  }
};

export const updateCredential = async (credentialId, updates) => {
  try {
    const existing = await getCredentials();
    const updated = existing.map(c => 
      c.id === credentialId ? { ...c, ...updates } : c
    );
    await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error updating credential:', error);
    return false;
  }
};

// Issued records management (for issuers)
export const saveIssuedRecord = async (record) => {
  try {
    const existing = await getIssuedRecords();
    const updated = [...existing, record];
    await AsyncStorage.setItem(ISSUED_RECORDS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving issued record:', error);
    return false;
  }
};

export const getIssuedRecords = async () => {
  try {
    const data = await AsyncStorage.getItem(ISSUED_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting issued records:', error);
    return [];
  }
};

// User data management
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      CREDENTIALS_KEY,
      ISSUED_RECORDS_KEY,
      USER_DATA_KEY
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};