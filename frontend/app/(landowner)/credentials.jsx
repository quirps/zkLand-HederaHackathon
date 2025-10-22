import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CredentialCard from '../../components/CredentialCard';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';
import { getCredentials } from '../../lib/storage';

export default function MyCredentialsScreen() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const data = await getCredentials();
      setCredentials(data || []);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (item) => {
    router.push({
      pathname: '/(landowner)/detail/[id]',
      params: { id: item.id }
    });
  };

  const renderCredential = ({ item }) => (
    <CredentialCard
      credential={item}
      onPress={() => handleCardPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading credentials...</Text>
        </View>
      ) : credentials.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No credentials yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first credential to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={credentials}
          renderItem={renderCredential}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: typography.sizes.md,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
});