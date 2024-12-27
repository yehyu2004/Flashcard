// screens/SetDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  fetchFlashcardsForSet,
  deleteFlashcard,
} from '../utils/firebaseHelpers';

export default function SetDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>(); // or <StackNavigationProp<any>>

  const { setId, setName } = route.params as { setId: string; setName: string };

  const [flashcards, setFlashcards] = useState<any[]>([]);

  const loadFlashcards = async () => {
    if (!setId) return;
    const cards = await fetchFlashcardsForSet(setId);
    setFlashcards(cards);
  };

  useEffect(() => {
    loadFlashcards();
  }, [setId]);

  const handleDeleteFlashcard = async (cardId: string) => {
    await deleteFlashcard(setId, cardId);
    loadFlashcards();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{setName}</Text>

      <Button
        title="Add Flashcard"
        onPress={() => navigation.navigate('AddCard' as never, { setId })}
      />

      <FlatList
        data={flashcards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardFront}>{item.front}</Text>
            <Text style={styles.cardBack}>{item.back}</Text>
            <Button
              title="Delete"
              color="#ff5555"
              onPress={() => handleDeleteFlashcard(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 16, fontWeight: 'bold' },
  card: {
    backgroundColor: '#efefef',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  cardFront: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardBack: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
});