import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator
} from 'react-native';
import { apiService } from '../services/api';

const MyScoreScreen = ({ route }) => {
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserScores();
  }, []);

  const fetchUserScores = async () => {
    try {
      const scores = await apiService.getUserScores();
      setUserScores(scores);
    } catch (error) {
      console.error('Error fetching user scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderScoreItem = ({ item, index }) => (
    <View 
      style={[
        styles.scoreItem, 
        { backgroundColor: getBackgroundColor(index) }
      ]}
    >
      <Text style={styles.rank}>{index + 1}.</Text>
      
      <Text style={styles.score}>
        {item.moves} moves in {item.time_taken} seconds
      </Text>
    </View>
  );

  const getBackgroundColor = (index) => {
    const colors = ['#e6f2ff', '#b3d9ff', '#80c1ff'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your scores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Scores</Text>
      <FlatList
        data={userScores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No scores yet</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9e1b7',
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
    backgroundColor: '#f9e1b7',
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
    elevation: 5,
  },
  rank: {
    fontWeight: 'bold',
    marginRight: 15,
    fontSize: 20,
    color: '#4CAF50',
  },
  date: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  score: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
});

export default MyScoreScreen;