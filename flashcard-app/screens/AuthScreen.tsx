// screens/AuthScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If logged in, navigate to MySetsScreen
        navigation.navigate('MySets' as never);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleAnonLogin = async () => {
    try {
      await signInAnonymously(auth);
      // onAuthStateChanged will handle navigation
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome! Please sign in.</Text>
      <Button title="Sign In Anonymously" onPress={handleAnonLogin} />
    </View>
  );
}