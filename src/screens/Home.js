import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleLetsGoClick = async () => {
    setLoading(true);
    try {
      // Check if the user token is saved in AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken) {
        // If user is logged in, navigate to the GameScreen
        navigation.navigate('Game');
      } else {
        // If user is not logged in, navigate to LoginScreen
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/aa.png')} 
      style={{ 
        flex: 1, 
        width: '99%', 
        height: '99%',
        backgroundColor: '#1A237E'
      }}
      resizeMode="cover"
    >
      {/* Semi-transparent Overlay */}
      <View style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }} />

      {/* Button Container */}
      <View style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 99
      }}>
        {/* Let's Go Button */}
        <TouchableOpacity 
          style={{
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            borderRadius: 15,
            paddingVertical: 15,
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5
          }}
          onPress={handleLetsGoClick} // Use the function for button click
          disabled={loading} // Disable the button while loading
        >
          <Text style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            marginRight: 10
          }}>
            {loading ? 'Checking...' : "Let's Go"} {/* Change text when loading */}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;