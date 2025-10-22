import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../components/theme/colors';
import { typography } from '../components/theme/typography';

export default function ModalScreen() {
  const { title, content } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || 'Modal'}</Text>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.content}>{content || 'No content provided'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 24,
  },
});