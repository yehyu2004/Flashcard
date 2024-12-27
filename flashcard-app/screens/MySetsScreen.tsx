// MySetsScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  Button, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createSet, fetchUserSets, deleteSet } from '../utils/firebaseHelpers';

/**
 * This screen lists all sets for the current user and
 * allows creating a new one.
 */
export default function MySetsScreen() {
  const navigation = useNavigation();

  // Store user object and sets in state
  const [user, setUser] = useState<User | null>(null);
  const [sets, setSets] = useState<any[]>([]);
  const [newSetName, setNewSetName] = useState('');

  // Listen for Firebase Auth state changes so we have a valid user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      if (currentUser) {
        console.log('Auth state changed: user is logged in', currentUser.uid);
        setUser(currentUser);
      } else {
        console.log('Auth state changed: user is null');
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch sets when we have a user
  useEffect(() => {
    if (user) {
      loadSets();
    } else {
      // Clear sets if no user
      setSets([]);
    }
  }, [user]);

  // Helper function to load all sets for the current user
  const loadSets = async () => {
    try {
      if (!user) {
        console.log('loadSets called but user is null');
        return;
      }
      console.log('Fetching sets for user:', user.uid);
      const userSets = await fetchUserSets(user.uid);
      setSets(userSets);
      console.log('Sets fetched:', userSets);
    } catch (error) {
      console.error('Error fetching user sets:', error);
    }
  };

  // Handler for creating a new set
  const handleCreateSet = async () => {
    try {
      // Basic validation
      if (!newSetName.trim()) {
        console.log('No set name provided');
        return;
      }
      if (!user) {
        console.log('Cannot create set because user is null');
        return;
      }

      // Actually create the set in Firestore
      console.log('Creating set with name:', newSetName, 'for user:', user.uid);
      const newSetId = await createSet(newSetName.trim(), user.uid);
      console.log('New set created with ID:', newSetId);

      // Clear input and refresh
      setNewSetName('');
      loadSets();
    } catch (error) {
      console.error('Error creating set:', error);
    }
  };

  // Handler for deleting a set
  const handleDeleteSet = async (setId: string) => {
    try {
      console.log('Deleting set:', setId);
      await deleteSet(setId);
      loadSets();
    } catch (error) {
      console.error('Error deleting set:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Sets</Text>

      {/* CREATE A NEW SET */}
      <TextInput
        style={styles.input}
        placeholder="Enter new set name"
        value={newSetName}
        onChangeText={setNewSetName}
      />
      <Button title="Create Set" onPress={handleCreateSet} />

      {/* LIST OF SETS */}
      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.setItem}
            onPress={() =>
              navigation.navigate('SetDetail' as never, {
                setId: item.id,
                setName: item.name,
              })
            }
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              <Text style={styles.setName}>{item.name}</Text>
              <Button
                title="Del"
                color="#ff5555"
                onPress={() => handleDeleteSet(item.id)}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 16, fontWeight: 'bold' },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5,
    padding: 8, 
    marginBottom: 12,
  },
  setItem: {
    padding: 16,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 5,
  },
  setName: { fontSize: 18, fontWeight: 'bold' },
});