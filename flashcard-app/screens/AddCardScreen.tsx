// screens/AddCardScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { addFlashcardToSet } from '../utils/firebaseHelpers';

export default function AddCardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setId } = route.params as { setId: string };

  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');

  const user = getAuth().currentUser;

  const handleAddCard = async () => {
    if (!frontText.trim() || !backText.trim()) {
      Alert.alert('Validation', 'Please enter both front and back text.');
      return;
    }

    if (!setId) {
      Alert.alert('Error', 'No set ID provided.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a flashcard.');
      return;
    }

    try {
      await addFlashcardToSet(setId, frontText.trim(), backText.trim(), user.uid);
      Alert.alert('Success', 'Flashcard added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding flashcard:', error);
      Alert.alert('Error', 'Something went wrong while adding the card.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Front text"
        style={styles.input}
        value={frontText}
        onChangeText={setFrontText}
      />
      <TextInput
        placeholder="Back text"
        style={styles.input}
        value={backText}
        onChangeText={setBackText}
      />
      <Button title="Add Card" onPress={handleAddCard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
  },
});