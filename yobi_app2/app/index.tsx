// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter } from 'expo-router';
import * as Font from 'expo-font'; // Import expo-font for custom fonts
import * as SplashScreen from 'expo-splash-screen'; // Import expo-splash-screen

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Index: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial fade animation state
  const router = useRouter();

  // Load the custom fonts
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'), // Load regular font
          'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'), // Load bold font
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    };
    loadFonts();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide splash screen and start fade-in animation once fonts are loaded
      SplashScreen.hideAsync();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, fontsLoaded]);

  if (!fontsLoaded) {
    // Keep the splash screen visible while fonts are loading
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Hero Image with Fade-in Animation */}
      <Animated.View style={{ ...styles.heroImageContainer, opacity: fadeAnim }}>
        <Image
          resizeMode="contain"
          source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/c73af7a9a92e6e951b4caabe481c5cbcd535e1ff72723ddb5801cadfc4c2704c?placeholderIfAbsent=true&apiKey=7d135af2469340adb0e016bb065416d7" }}
          style={styles.heroImage}
          accessibilityLabel="Hero image"
        />
      </Animated.View>

      {/* Main Title */}
      <Animated.Text style={{ ...styles.title, opacity: fadeAnim }}>
        Welcome to My App
      </Animated.Text>

      {/* Subtitle/Description */}
      <Animated.Text style={{ ...styles.subtitle, opacity: fadeAnim }}>
        Get started with your journey. Tap the button below to proceed.
      </Animated.Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.push('/LoginScreen')}  // Navigate to LoginScreen
        accessibilityRole="button"
        accessibilityLabel="Get started"
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#51BCCE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroImageContainer: {
    width: '80%',
    height: undefined,
    aspectRatio: 1,  // Maintain aspect ratio
    marginBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',  // Custom font (bold)
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',  // Custom font (regular)
  },
  getStartedButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,  // Shadow for Android
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',  // Custom font (bold)
  },
});

export default Index;
