import { Stack } from 'expo-router';
import { colors } from '../../components/theme/colors';

export default function IssuerLayout() {
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
          title: 'Issuer Dashboard',
        }} 
      />
      <Stack.Screen 
        name="issue" 
        options={{ 
          title: 'Issue New Credential',
        }} 
      />
      <Stack.Screen 
        name="records" 
        options={{ 
          title: 'Issued Records',
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'Authority Profile',
        }} 
      />
    </Stack>
  );
}