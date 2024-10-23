import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig'; // Firebase config
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from React Navigation

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const WelcomeScreen: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Initialize navigation hook

  // Fetch user's firstName from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData?.firstName || 'User');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#51BCCE" />
      </View>
    );
  }

  // Function to handle navigation to ActivityTracker
  const goToActivityTracker = () => {
    navigation.navigate('ActivityTracker'); // Navigate to ActivityTracker screen
  };

  return (
    <View style={styles.container}>
      {/* Background for the images */}
      <ImageBackground
        source={require('./assets/img/welcome.png')} // Background image acting as a color or shape
        style={styles.background}
        resizeMode="contain"
      >
        {/* Man and lady images standing next to each other */}
        <View style={styles.imageContainer}>
          <Image
            source={require('./assets/img/man_2_.png')} // First image (man)
            style={styles.image1}
            resizeMode="contain"
          />
          <Image
            source={require('./assets/img/lady_2_.png')} // Second image (lady)
            style={styles.image2}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* Welcome text */}
      <Text style={styles.welcomeText}>Welkom, {firstName}!</Text>

      {/* Subtitle text */}
      <Text style={styles.subtitleText}>Laten we beginnen</Text>

      {/* Next button */}
      <TouchableOpacity style={styles.button} onPress={goToActivityTracker}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: screenWidth * 0.85, // Adjusted size for the background shape
    height: screenHeight * 0.45,
    justifyContent: 'center', // Center the images
    alignItems: 'center',
    marginBottom: 20, // Space between the background and text
  },
  imageContainer: {
    flexDirection: 'row', // Align the images horizontally next to each other
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative', // Keep images within the background
    bottom: 20, // Slightly lower the images
  },
  image1: {
    width: 100, // Adjusted width for the man
    height: 200, // Adjusted height for the man
    marginRight: -20, // Slight negative margin to bring the images closer
  },
  image2: {
    width: 100, // Adjusted width for the lady
    height: 200, // Adjusted height for the lady
    marginLeft: -20, // Slight negative margin to bring the images closer
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10, // Adjust margin to place the text properly
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40, // Space between subtitle and the button
  },
  button: {
    backgroundColor: '#51BCCE',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default WelcomeScreen;
