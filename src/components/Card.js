import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Card = ({ symbol, isFlipped, onPress, matched }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isFlipped && styles.flippedCard,
        matched && styles.matchedCard
      ]}
      onPress={onPress}
      disabled={isFlipped || matched}
    >
      <Text style={styles.cardText}>
        {isFlipped || matched ? symbol : '?'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 80,
    height: 80,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  flippedCard: {
    backgroundColor: '#2ecc71',
  },
  matchedCard: {
    backgroundColor: '#95a5a6',
    opacity: 0.5,
  },
  cardText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Card;