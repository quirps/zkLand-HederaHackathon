import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';
import { generateCommitment } from '../../lib/commitment';
import { saveCredential } from '../../lib/storage';

export default function AddCredentialScreen() {
  const [parcelId, setParcelId] = useState('');
  const [landType, setLandType] = useState('Mailo');
  const [area, setArea] = useState('');
  const [issuer, setIssuer] = useState('Buganda Land Board');
  const [commitmentHash, setCommitmentHash] = useState('');

  const handleGenerateCommitment = () => {
    const formData = {
      parcelId,
      landType,
      area,
      issuer,
    };
    
    const hash = generateCommitment(formData);
    setCommitmentHash(hash);
    Alert.alert('Success', 'Commitment hash generated');
  };

  const handleAttachDocument = () => {
    Alert.alert('Placeholder', 'File picker coming soon.');
  };

  const handleSaveLocally = async () => {
    if (!parcelId || !area) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newCredential = {
      id: `cred_${Date.now()}`,
      type: 'Land Ownership',
      parcelId,
      landType,
      area,
      issuer,
      commitmentHash: commitmentHash || 'pending',
      status: 'draft',
      createdAt: new Date().toISOString(),
      data: {
        parcel_id: parcelId,
        land_type: landType,
        area_sqm: area,
        issuer,
      },
    };

    const success = await saveCredential(newCredential);
    
    if (success) {
      Alert.alert('Success', 'Credential saved locally', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', 'Failed to save credential');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Credential</Text>
        <Text style={styles.subtitle}>
          Fill in the details for your land credential
        </Text>

        <StyledInput
          label="Parcel ID"
          placeholder="Enter parcel ID"
          value={parcelId}
          onChangeText={setParcelId}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Land Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={landType}
              onValueChange={setLandType}
              style={styles.picker}
            >
              <Picker.Item label="Mailo" value="Mailo" />
              <Picker.Item label="Customary" value="Customary" />
            </Picker>
          </View>
        </View>

        <StyledInput
          label="Area (in m²)"
          placeholder="Enter area"
          value={area}
          onChangeText={setArea}
          keyboardType="numeric"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Issuer</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={issuer}
              onValueChange={setIssuer}
              style={styles.picker}
            >
              <Picker.Item label="Buganda Land Board" value="Buganda Land Board" />
              <Picker.Item label="Chief's Office" value="Chief's Office" />
            </Picker>
          </View>
        </View>

        <StyledButton
          title="Attach Scanned Document"
          onPress={handleAttachDocument}
          variant="secondary"
        />

        <StyledButton
          title="Generate Commitment"
          onPress={handleGenerateCommitment}
          variant="secondary"
          style={styles.buttonSpacing}
        />

        {commitmentHash && (
          <View style={styles.hashContainer}>
            <Text style={styles.hashLabel}>Commitment:</Text>
            <Text style={styles.hashText}>{commitmentHash}</Text>
          </View>
        )}

        <StyledButton
          title="Save Locally"
          onPress={handleSaveLocally}
          variant="primary"
          style={styles.buttonSpacing}
        />

        <View style={styles.disabledButton}>
          <Text style={styles.disabledText}>
            Submit to Issuer (Coming Soon)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 30,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
  },
  buttonSpacing: {
    marginTop: 15,
  },
  hashContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  hashLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 8,
  },
  hashText: {
    fontSize: typography.sizes.xs,
    color: colors.text,
    fontFamily: 'monospace',
  },
  disabledButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    opacity: 0.5,
  },
  disabledText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
});