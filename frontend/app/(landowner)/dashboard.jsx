import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import StyledButton from '../../components/StyledButton';
import { colors } from '../../components/theme/colors';
import { typography } from '../../components/theme/typography';
import { getUserDID } from '../../lib/did';

export default function LandownerDashboard() {
  const userDID = getUserDID();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome, Landowner</Text>
        
        <View style={styles.didContainer}>
          <Text style={styles.didLabel}>Your DID:</Text>
          <Text style={styles.didText}>{userDID}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <StyledButton
            title="My Credentials"
            onPress={() => router.push('/(landowner)/credentials')}
            variant="primary"
          />
          
          <StyledButton
            title="Add New"
            onPress={() => router.push('/(landowner)/add')}
            variant="secondary"
          />
          
          <StyledButton
            title="Share Proof"
            onPress={() => router.push('/(landowner)/share')}
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
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 30,
  },
  didContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  didLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 8,
  },
  didText: {
    fontSize: typography.sizes.xs,
    color: colors.text,
    fontFamily: 'monospace',
  },
  buttonGroup: {
    gap: 15,
  },
});