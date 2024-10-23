import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig"; // Firebase config
import { useNavigation } from "@react-navigation/native"; // Use navigation for routing
import { Picker } from "@react-native-picker/picker"; // Picker for dropdown menus
import Slider from "@react-native-community/slider"; // Import Slider

// Define the DropdownButton component
const DropdownButton = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.dropdownButton} onPress={onPress}>
    <Text style={styles.dropdownButtonText}>
      {value ? value : label}
    </Text>
  </TouchableOpacity>
);

const Button = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const ProfileCompletion = () => {
  const [gender, setGender] = useState(""); // Dropdown for gender
  const [age, setAge] = useState(""); // Dropdown for age
  const [weight, setWeight] = useState(70); // Slider for weight
  const [height, setHeight] = useState(170); // Slider for height
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showAgePicker, setShowAgePicker] = useState(false);

  const navigation = useNavigation();

  const ageOptions = Array.from({ length: 85 }, (_, i) => (i + 16).toString()); // Dropdown for age: from 16 to 100

  const handleSaveProfile = async () => {
    // Validate Gender
    if (gender === "") {
      return Alert.alert("Error", "Please select your gender.");
    }

    // Validate Age
    if (age === "") {
      return Alert.alert("Error", "Please select your age.");
    }

    // Validate Weight
    if (weight < 30 || weight > 300) {
      return Alert.alert("Error", "Please enter a valid weight between 30 kg and 300 kg.");
    }

    // Validate Height
    if (height < 50 || height > 300) {
      return Alert.alert("Error", "Please enter a valid height between 50 cm and 300 cm.");
    }

    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Update the existing document by merging new profile data
          await updateDoc(userDocRef, {
            gender,
            age,
            weight,
            height,
          });
        } else {
          Alert.alert("Error", "User registration data is missing.");
        }

        // Navigate to GoalSelection
        navigation.navigate("GoalSelection");
      } catch (error) {
        Alert.alert("Error", `Error saving profile: ${error.message}`);
      }
    } else {
      Alert.alert("Error", "User is not authenticated.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* New background image behind mask */}
        <Image
          source={require("./assets/img/welcome.png")} // Background image
          style={styles.backgroundImage}
        />
        
        {/* Display Mask.png on top of the background */}
        <Image
          accessibilityLabel="Mask illustration"
          source={require("./assets/img/Mask.png")} // Mask image inside the background
          style={styles.maskImage}
        />

        <Text style={styles.title}>Laten we je profiel voltooien.</Text>

        {/* Gender Dropdown Button */}
        <DropdownButton
          label="Kies je Gender"
          value={gender}
          onPress={() => setShowGenderPicker(true)}
        />
        {/* Gender Picker Modal */}
        <Modal
          visible={showGenderPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGenderPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => {
                  setGender(itemValue);
                  setShowGenderPicker(false); // Close the picker after selection
                }}
              >
                <Picker.Item label="Man" value="Man" />
                <Picker.Item label="Vrouw" value="Vrouw" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
          </View>
        </Modal>

        {/* Age Dropdown Button */}
        <DropdownButton
          label="Selecteer je Leeftijd"
          value={age}
          onPress={() => setShowAgePicker(true)}
        />
        {/* Age Picker Modal */}
        <Modal
          visible={showAgePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAgePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerModal}>
              <Picker
                selectedValue={age}
                onValueChange={(itemValue) => {
                  setAge(itemValue);
                  setShowAgePicker(false); // Close the picker after selection
                }}
              >
                {ageOptions.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        </Modal>

        {/* Weight Slider */}
        <Text style={styles.label}>Gewicht: {weight} kg</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={30}
          maximumValue={300}
          step={1}
          value={weight}
          onValueChange={setWeight}
          minimumTrackTintColor="#51BCCE"
          maximumTrackTintColor="#000000"
          thumbTintColor="#51BCCE"
        />

        {/* Height Slider */}
        <Text style={styles.label}>Lengte: {height} cm</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={50}
          maximumValue={250}
          step={1}
          value={height}
          onValueChange={setHeight}
          minimumTrackTintColor="#51BCCE"
          maximumTrackTintColor="#000000"
          thumbTintColor="#51BCCE"
        />

        <Button label="Doorgaan" onPress={handleSaveProfile} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: 200, // Adjust height as needed
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  maskImage: {
    width: "100%", // Full width
    height: 150, // Adjust height as needed
    resizeMode: "contain",
    marginBottom: 30, // Increase the margin for better spacing
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d1617",
    marginBottom: 24, // Adjust the margin for spacing
    textAlign: "center",
  },
  dropdownButton: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    padding: 16,
    marginBottom: 16,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pickerModal: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    margin: 20,
    padding: 16,
    elevation: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#51BCCE",
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default ProfileCompletion;
