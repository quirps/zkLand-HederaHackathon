import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';

export default function IssuerDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Buganda Land Board</Text>
        <Text style={styles.subheader}>Authority Portal</Text>

        <View style={styles.buttonGroup}>
          <StyledButton
            title="Issue New Credential"
            onPress={() => router.push('/(issuer)/issue')}
            variant="primary"
          />
          
          <StyledButton
            title="View Issued Records"
            onPress={() => router.push('/(issuer)/records')}
            variant="secondary"
          />
          
          <StyledButton
            title="Authority Profile"
            onPress={() => router.push('/(issuer)/profile')}
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
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 10,
  },
  subheader: {
    fontSize: typography.sizes.lg,
    color: colors.text,
    marginBottom: 40,
  },
  buttonGroup: {
    gap: 15,
  },
});