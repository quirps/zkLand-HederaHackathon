import { Alert, StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';

export default function AuthorityProfileScreen() {
  const handleExportKeys = () => {
    Alert.alert('Placeholder', 'Key export simulation.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Authority Profile</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Issuer DID</Text>
          <View style={styles.valueBox}>
            <Text style={styles.value}>did:bug:issuer:123...abc</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Public Key</Text>
          <View style={styles.valueBox}>
            <Text style={styles.value}>0x04a3...789</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <View style={styles.disabledButton}>
            <Text style={styles.disabledText}>
              Update Info (Coming Soon)
            </Text>
          </View>

          <StyledButton
            title="Export Keys"
            onPress={handleExportKeys}
            variant="secondary"
          />
        </View>
      </View>
    </View>
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
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 10,
  },
  valueBox: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
  },
  value: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontFamily: 'monospace',
  },
  buttonGroup: {
    marginTop: 30,
    gap: 15,
  },
  disabledButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    opacity: 0.5,
  },
  disabledText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
});