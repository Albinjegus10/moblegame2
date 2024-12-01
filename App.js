import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Explicitly import screens
import HomeScreen from './src/screens/Home';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import GameScreen from './src/screens/GameScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import MyScoreScreen from './src/screens/MyScoreScreen';
import SplashScreen from './src/screens/SplashScreen';
// Create Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ 
          headerStyle: { backgroundColor: '#1A237E' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ 
            title: 'Login',
            headerShown: false // Remove this if you want the default header
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ 
            title: 'Create Account',
            headerShown: false // Remove this if you want the default header
          }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Memory Game' }}
        />
        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{ title: 'Top Scores' }}
        />
        <Stack.Screen
          name="MyScore"
          component={MyScoreScreen}
          options={{ title: 'My Scores' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


