import { StyleSheet, Text, View } from 'react-native';
import { colors } from './theme/colors';
import { typography } from './theme/typography';

export default function SchemaViewer({ data }) {
  if (!data || typeof data !== 'object') {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No data to display</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.keys(data).map((key, index) => (
        <View
          key={key}
          style={[
            styles.row,
            index < Object.keys(data).length - 1 && styles.rowBorder,
          ]}
        >
          <Text style={styles.label}>{key}</Text>
          <Text style={styles.value}>
            {typeof data[key] === 'object'
              ? JSON.stringify(data[key])
              : String(data[key])}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  value: {
    fontSize: typography.sizes.md,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    opacity: 0.8,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.6,
  },
});