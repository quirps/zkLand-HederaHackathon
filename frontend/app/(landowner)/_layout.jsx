import { Stack } from 'expo-router';
import { colors } from '../../components/theme/colors';

export default function LandownerLayout() {
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
          title: 'My Dashboard',
        }} 
      />
      <Stack.Screen 
        name="credentials" 
        options={{ 
          title: 'My Credentials',
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: 'Add New Credential',
        }} 
      />
      <Stack.Screen 
        name="detail/[id]" 
        options={{ 
          title: 'Credential Details',
        }} 
      />
      <Stack.Screen 
        name="share" 
        options={{ 
          title: 'Share Proof',
        }} 
      />
    </Stack>
  );
}