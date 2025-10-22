import { Stack } from 'expo-router';
import { colors } from '../../components/theme/colors';

export default function VerifierLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: 'Verify Credential',
        }} 
      />
    </Stack>
  );
}