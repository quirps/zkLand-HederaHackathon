import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SchemaViewer from '../../../components/SchemaViewer';
import StyledButton from '../../../components/StyledButton';
import { colors } from '../../../components/theme/colors';
import { typography } from '../../../components/theme/typography';
import { getCredentials } from '../../../lib/storage';

export default function CredentialDetailScreen() {
  const { id } = useLocalSearchParams();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredential();
  }, [id]);

  const loadCredential = async () => {
    try {
      const credentials = await getCredentials();
      const found = credentials?.find(c => c.id === id);
      setCredential(found || null);
    } catch (error) {
      console.error('Error loading credential:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareProof = () => {
    router.push({
      pathname: '/(landowner)/share',
      params: { credentialId: id }
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.loadingText}>Loading credential...</Text>
      </View>
    );
  }

  if (!credential) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>Credential not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Credential Details</Text>
        
        <SchemaViewer data={credential} />

        <View style={styles.buttonContainer}>
          <StyledButton
            title="Share Proof"
            onPress={handleShareProof}
            variant="accent"
          />
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
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 30,
  },
});