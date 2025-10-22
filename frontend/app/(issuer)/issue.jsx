import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import StyledInput from '../../components/StyledInput';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';
import { generateCommitment } from '../../lib/commitment';
import { saveIssuedRecord } from '../../lib/storage';

export default function IssueCredentialScreen() {
  const [landownerDid, setLandownerDid] = useState('');
  const [parcelId, setParcelId] = useState('');
  const [landType, setLandType] = useState('Mailo');
  const [area, setArea] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleIssue = async () => {
    if (!landownerDid || !parcelId || !area) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const formData = {
      parcelId,
      landType,
      area,
    };

    const commitmentHash = generateCommitment(formData);
    const issuerDid = 'did:issuer:buganda_land_board_001';

    const newCredential = {
      id: `issued_${Date.now()}`,
      owner_did: landownerDid,
      issuer_did: issuerDid,
      type: 'Land Ownership Certificate',
      issuedAt: new Date().toISOString(),
      data: {
        parcel_id: parcelId,
        land_type: landType,
        area_sqm: area,
        commitment_hash: commitmentHash,
      },
      status: 'issued',
    };

    const success = await saveIssuedRecord(newCredential);

    if (success) {
      setModalVisible(true);
    } else {
      Alert.alert('Error', 'Failed to issue credential');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Issue New Credential</Text>
        <Text style={styles.subtitle}>
          Officially issue a land ownership credential
        </Text>

        <StyledInput
          label="Landowner DID"
          placeholder="Enter landowner DID"
          value={landownerDid}
          onChangeText={setLandownerDid}
        />

        <StyledInput
          label="Parcel ID / Reference"
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

        <StyledButton
          title="Sign & Issue Credential"
          onPress={handleIssue}
          variant="primary"
          style={styles.buttonSpacing}
        />
      </View>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitle}>Credential Issued</Text>
            <Text style={styles.modalText}>
              The credential has been successfully issued and saved.
            </Text>
            <StyledButton
              title="OK"
              onPress={handleModalClose}
              variant="primary"
            />
          </View>
        </View>
      </Modal>
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
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 15,
  },
  modalText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 25,
  },
});