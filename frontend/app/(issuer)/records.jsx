import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';
import { getIssuedRecords } from '../../lib/storage';

export default function IssuedRecordsScreen() {
  const [issuedRecords, setIssuedRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssuedRecords();
  }, []);

  const loadIssuedRecords = async () => {
    try {
      const records = await getIssuedRecords();
      setIssuedRecords(records || []);
    } catch (error) {
      console.error('Error loading issued records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPress = (item) => {
    router.push({
      pathname: '/modal',
      params: {
        title: 'Raw Credential Data',
        content: JSON.stringify(item, null, 2),
      },
    });
  };

  const renderRecord = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleRecordPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          Parcel: {item.data?.parcel_id || 'N/A'}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.cardDetail}>
        Issued to: {item.owner_did}
      </Text>
      
      <Text style={styles.cardDetail}>
        Land Type: {item.data?.land_type || 'N/A'}
      </Text>
      
      <Text style={styles.cardDetail}>
        Area: {item.data?.area_sqm || 'N/A'} m²
      </Text>
      
      <Text style={styles.cardDate}>
        Issued: {new Date(item.issuedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading records...</Text>
        </View>
      ) : issuedRecords.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No records yet</Text>
          <Text style={styles.emptySubtext}>
            Issued credentials will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={issuedRecords}
          renderItem={renderRecord}
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
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textTransform: 'uppercase',
  },
  cardDetail: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    marginBottom: 6,
  },
  cardDate: {
    fontSize: typography.sizes.xs,
    color: colors.text,
    opacity: 0.6,
    marginTop: 8,
  },
});