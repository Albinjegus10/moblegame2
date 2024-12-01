import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl,TouchableOpacity  
} from 'react-native';
import { apiService } from '../services/api';

const LeaderboardScreen = ({ navigation }) => {
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTopScores();
  }, []);

  const fetchTopScores = async () => {
    try {
      const scores = await apiService.getTopScores();
      setTopScores(scores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTopScores();
  };

  const renderScoreItem = ({ item, index }) => (
    <View 
      style={[
        styles.scoreItem, 
        { backgroundColor: getBackgroundColor(index) }
      ]}
    >
      <Text style={styles.rank}>{index + 1}.</Text>
      <Text style={styles.name}>{item.username}</Text>
      <Text style={styles.score}>
        {item.moves} moves in {item.time_taken} seconds
      </Text>
    </View>
  );

  const getBackgroundColor = (index) => {
    if (index === 0) return '#ffd700'; // Gold for 1st place
    if (index === 1) return '#c0c0c0'; // Silver for 2nd place
    if (index === 2) return '#cd7f32'; // Bronze for 3rd place
    return '#bdf308'; // White for others
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading scores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.myScoreButton}
        onPress={() => navigation.navigate('MyScore')}
      >
        <Text style={styles.myScoreButtonText}>My Scores</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Top Scores</Text>
      <FlatList
        data={topScores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9e1b7', // Light blue background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff', // Same background color as main screen
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // More subtle shadow for Android
  },
  rank: {
    fontWeight: 'bold',
    marginRight: 15,
    fontSize: 20,
    color: '#4CAF50',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  score: {
    fontSize: 14,
    color: '#666',
  },
  myScoreButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  myScoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LeaderboardScreen;
