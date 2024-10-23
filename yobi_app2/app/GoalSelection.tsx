import React, { useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, Animated } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useNavigation } from '@react-navigation/native';
import { db, auth } from './firebaseConfig'; // Firebase config import
import { doc, setDoc } from "firebase/firestore"; 

const { width: screenWidth } = Dimensions.get("window");

type Goal = {
  title: string;
  imageUri: any;
};

const GoalSelection = () => {
  const carouselRef = useRef(null);
  const navigation = useNavigation<any>(); 
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null); 
  const [scaleAnim] = useState(new Animated.Value(1)); 

  const goals: Goal[] = [
    {
      title: "Verbeter je lichaamsvorm",
      imageUri: require('./assets/img/goal_3.png'),
    },
    {
      title: "Verlies gewicht",
      imageUri: require('./assets/img/afvallen.png'),
    },
    {
      title: "Verhoog je kracht",
      imageUri: require('./assets/img/verbeter.png'),
    },
    {
      title: "Verbeter je uithoudingsvermogen",
      imageUri: require('./assets/img/fit.png'),
    },
  ];

  const animateCardPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderGoalCard = ({ item }: { item: Goal }) => {
    const isSelected = selectedGoal?.title === item.title;

    return (
      <Animated.View style={[{ transform: [{ scale: isSelected ? scaleAnim : 1 }] }]}>
        <TouchableOpacity
          style={[
            styles.goalCard,
            isSelected ? styles.selectedCard : {},
          ]}
          onPress={() => {
            setSelectedGoal(item);
            animateCardPress();
          }}
        >
          <Image source={item.imageUri} style={styles.goalImage} />
          <Text style={styles.goalText}>{item.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleConfirm = async () => {
    if (selectedGoal) {
      try {
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, "users", user.uid), { selectedGoal: selectedGoal.title }, { merge: true });

          Alert.alert("Success", "Your goal has been saved!");
        } else {
          Alert.alert("Error", "No user is logged in.");
        }
      } catch (error) {
        Alert.alert("Error", `Failed to save goal: ${error.message}`);
      }
    } else {
      Alert.alert("No Selection", "Please select a goal before proceeding.");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoToLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wat is jouw doel?</Text>
      <Text style={styles.subtitle}>
        Het zal ons helpen om het beste programma voor jou te kiezen.
      </Text>

      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          data={goals}
          renderItem={renderGoalCard}
          sliderWidth={screenWidth}
          itemWidth={screenWidth * 0.75} // Adjusted to make the cards smaller
          loop={true}
          autoplay={true}
          vertical={false}
        />
      </View>

      <TouchableOpacity onPress={handleConfirm} style={styles.button}>
        <Text style={styles.buttonText}>Bevestigen</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Terug naar Profiel</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoToLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Naar Inloggen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  carouselContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  goalCard: {
    width: "100%",
    padding: 20, // Reduced padding to make the card smaller
    backgroundColor: "#51BCCE",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  selectedCard: {
    borderColor: "#4CAF50",
    borderWidth: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  goalImage: {
    width: 120, // Reduced image size to make it smaller
    height: 120,
    marginBottom: 15,
    resizeMode: "contain",
  },
  goalText: {
    fontSize: 18, // Adjusted text size to fit smaller cards
    fontWeight: "700",
    color: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  backButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 15,
  },
  loginButton: {
    backgroundColor: "#51BCCE",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 15,
  },
});

export default GoalSelection;
