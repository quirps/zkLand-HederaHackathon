import { Stack } from 'expo-router';

export default function RootLayout() {
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(landowner)" />
      <Stack.Screen name="(issuer)" />
      <Stack.Screen name="(verifier)" />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}