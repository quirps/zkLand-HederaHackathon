import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from './theme/colors';
import { typography } from './theme/typography';

export default function CredentialCard({ credential, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>
        {credential.data?.parcel_id || credential.parcelId || 'Mailo Land - [District]'}
      </Text>
      
      <Text style={styles.subtitle}>
        Area: {credential.data?.area_sqm || credential.area || 'N/A'} m²
      </Text>
      
      <Text style={styles.issuer}>
        Issuer: {credential.issuer_name || credential.issuer || 'Unknown Issuer'}
      </Text>
      
      {credential.status && (
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            credential.status === 'issued' && styles.statusIssued,
            credential.status === 'draft' && styles.statusDraft,
          ]}>
            <Text style={styles.statusText}>{credential.status}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: 6,
  },
  issuer: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    opacity: 0.7,
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.secondary,
  },
  statusIssued: {
    backgroundColor: colors.accent,
  },
  statusDraft: {
    backgroundColor: colors.secondary,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    textTransform: 'uppercase',
  },
});