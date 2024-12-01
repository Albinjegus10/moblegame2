import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TouchableOpacity,
  Modal,
  TextInput 
} from 'react-native';
import Card from '../components/Card';
import { apiService } from '../services/api';
import jwt_decode from 'jwt-decode'; 

const SYMBOLS = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍍', '🥝', '🍑'];

const GameScreen = ({ navigation }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');
  
  const timerRef = useRef(null);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); 
      }
    };
  }, [isGameOver]);

  const startGame = () => {
    clearInterval(timerRef.current); 

    const shuffledCards = shuffle([...SYMBOLS, ...SYMBOLS])
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        matched: false
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTime(0);
    setIsGameOver(false);
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleCardPress = (card) => {
    if (
      flippedCards.length === 2 || 
      card.isFlipped || 
      card.matched
    ) return;

    const newCards = cards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);
    setMoves(prevMoves => prevMoves + 1);

    if (newFlippedCards.length === 2) {
      setTimeout(() => checkMatch(newFlippedCards), 1000);
    }
  };

  const checkMatch = (flipped) => {
    const [first, second] = flipped;

    if (first.symbol === second.symbol) {
      const newMatchedCards = [...matchedCards, first.symbol];
      setMatchedCards(newMatchedCards);

      const newCards = cards.map(card => 
        card.symbol === first.symbol ? { ...card, matched: true } : card
      );
      setCards(newCards);

      if (newMatchedCards.length === SYMBOLS.length) {
        gameOver();
      }
    } else {
      const newCards = cards.map(card => 
        card.isFlipped && !card.matched ? { ...card, isFlipped: false } : card
      );
      setCards(newCards);
    }

    setFlippedCards([]);
  };

  const gameOver = () => {
    setIsGameOver(true);
    setIsModalVisible(true);
  };

  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedToken = jwt_decode(token);
        console.log("Decoded Token:", decodedToken); 
  
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          console.log("Token expired");
          throw new Error('Token has expired, please log in again');
        }
  
        return decodedToken.user_id; 
      }
  
      throw new Error('Token not found');
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  const submitScore = async () => {
    try {
      const userId = await getUserIdFromToken();
      if (userId) {
        const response = await apiService.submitScore({
          user: userId,
          moves: moves,
          time_taken: time,
        });
  
        setIsModalVisible(false);
        navigation.navigate('Leaderboard');
      } else {
        Alert.alert('Error', 'Failed to retrieve user information');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', error.message || 'Could not submit score');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text>Moves: {moves}</Text>
        <Text>Time: {time}s</Text>
      </View>
      
      <View style={styles.gameBoard}>
        {cards.map(card => (
          <Card
            key={card.id}
            symbol={card.symbol}
            isFlipped={card.isFlipped}
            matched={card.matched}
            onPress={() => handleCardPress(card)}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={startGame}
      >
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.leaderboardButton} 
        onPress={() => navigation.navigate('Leaderboard')}
      >
        <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Game Over!</Text>
          <Text>Moves: {moves}</Text>
          <Text>Time: {time}s</Text>
          <TextInput
            placeholder="Enter your name"
            value={playerName}
            onChangeText={setPlayerName}
            style={styles.nameInput}
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={submitScore}
          >
            <Text style={styles.submitButtonText}>Submit Score</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dismissButton} 
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9e1b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  leaderboardButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  leaderboardButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    width: 200,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dismissButton: {
    marginTop: 10,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  dismissButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GameScreen;
