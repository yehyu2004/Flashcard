import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const fetchFlashcards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'flashcards'));
      const cardsData: Flashcard[] = [];
      querySnapshot.forEach((docItem) => {
        cardsData.push({
          id: docItem.id,
          front: docItem.data().front,
          back: docItem.data().back,
        });
      });
      setFlashcards(cardsData);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this flashcard?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'flashcards', id));
              fetchFlashcards();
            } catch (error) {
              console.error('Error deleting flashcard:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (isFocused) {
      fetchFlashcards();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <Button
        title="Add Flashcard"
        onPress={() => navigation.navigate('AddCard' as never)}
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
              onPress={() => handleDeleteCard(item.id)}
              color="#ff4f4f"
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
  cardFront: { fontSize: 18, fontWeight: 'bold' },
  cardBack: { marginTop: 8, fontSize: 16, color: '#555' },
});