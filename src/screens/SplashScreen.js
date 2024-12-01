import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Simulate initial app loading and token check
    const checkLoginStatus = async () => {
      try {
        // Simulate a loading delay (optional, but provides a more natural splash experience)
        await new Promise(resolve => setTimeout(resolve, 200));

        // Check if user token exists
        const userToken = await AsyncStorage.getItem('userToken');

        // Navigate based on token status
        if (userToken) {
          navigation.replace('Home'); // Replace prevents going back to splash
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Splash screen error:', error);
        // Fallback navigation if something goes wrong
        navigation.replace('Login');
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/asd_processed.png')} // Replace with your actual logo path
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eea126', // Match your app's color scheme
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6, // 60% of screen width
    height: height * 0.3, // 30% of screen height
  }
});

export default SplashScreen;