import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';
import { getCredentials } from '../../lib/storage';

export default function ShareProofScreen() {
  const { credentialId } = useLocalSearchParams();
  const [credential, setCredential] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredentialForSharing();
  }, [credentialId]);

  const loadCredentialForSharing = async () => {
    try {
      if (!credentialId) {
        setLoading(false);
        return;
      }

      const credentials = await getCredentials();
      const found = credentials?.find(c => c.id === credentialId);
      
      if (found) {
        setCredential(found);
        // Generate QR code data
        const proofData = JSON.stringify({
          id: found.id,
          type: found.type,
          issuer: found.issuer,
          issuedAt: found.issuedAt,
          data: found.data,
        });
        setQrData(proofData);
      } else {
        Alert.alert('Error', 'Credential not found');
      }
    } catch (error) {
      console.error('Error loading credential:', error);
      Alert.alert('Error', 'Failed to load credential');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!credentialId) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.promptText}>Please select a credential first</Text>
        <Text style={styles.promptSubtext}>
          Go to My Credentials and select a credential to share
        </Text>
      </View>
    );
  }

  if (!credential || !qrData) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>Unable to load credential</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Share Proof</Text>
        
        <View style={styles.credentialInfo}>
          <Text style={styles.infoLabel}>Credential Type:</Text>
          <Text style={styles.infoValue}>{credential.type}</Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={250}
              color={colors.primary}
              backgroundColor={colors.background}
            />
          </View>
          <Text style={styles.qrInstruction}>
            Scan this QR code to verify the credential
          </Text>
        </View>

        <View style={styles.dataPreview}>
          <Text style={styles.dataLabel}>Proof Data:</Text>
          <ScrollView horizontal style={styles.dataScroll}>
            <Text style={styles.dataText}>{qrData}</Text>
          </ScrollView>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  promptText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  promptSubtext: {
    fontSize: typography.sizes.md,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  credentialInfo: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.accent,
    marginBottom: 15,
  },
  qrInstruction: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  dataPreview: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
  },
  dataLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 10,
  },
  dataScroll: {
    maxHeight: 100,
  },
  dataText: {
    fontSize: typography.sizes.xs,
    color: colors.text,
    fontFamily: 'monospace',
  },
});