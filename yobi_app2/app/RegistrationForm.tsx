import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Firebase config

const InputField = ({ icon, placeholder, isPassword, value, onChangeText }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Image source={{ uri: icon }} style={styles.inputIcon} />
      <TextInput
        placeholder={placeholder}
        secureTextEntry={isPassword && !showPassword}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={{ uri: showPassword ? "https://cdn.builder.io/api/v1/image/assets/TEMP/visible-icon" : "https://cdn.builder.io/api/v1/image/assets/TEMP/invisible-icon" }}
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const CheckboxWithLabel = ({ label, isChecked, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
    <View
      style={[styles.checkbox, isChecked ? styles.checkboxChecked : styles.checkboxUnchecked]}
    />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const RegistrationForm: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const router = useRouter(); // Use the router to navigate

  // Function to handle input change
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // Function to handle form validation and registration
  const handleRegister = async () => {
    if (!form.firstName || !form.lastName) {
      Alert.alert("Invalid Name", "Please enter your full name.");
      return;
    }
    if (!form.email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      Alert.alert("Password Too Short", "Password must be at least 6 characters.");
      return;
    }
    if (!isChecked) {
      Alert.alert("Terms Not Accepted", "You need to accept the Privacy Policy and Terms of Use.");
      return;
    }

    setLoading(true);
    try {
      // Create user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Get the current user ID from auth
      const user = userCredential.user;

      // Save the user profile data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        profileComplete: false, // Set this to false initially
      });

      setLoading(false);
      Alert.alert("Registration Successful", "Welcome!");

      // Navigate to ProfileCompletion page
      router.push("/ProfileCompletion");
    } catch (error) {
      setLoading(false);
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registreer je nu!</Text>

        {/* First Name */}
        <InputField
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/37ec02af-icon"
          placeholder="Voornaam"
          value={form.firstName}
          onChangeText={(value) => handleInputChange("firstName", value)}
        />

        {/* Last Name */}
        <InputField
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/fa427d78-icon"
          placeholder="Achternaam"
          value={form.lastName}
          onChangeText={(value) => handleInputChange("lastName", value)}
        />

        {/* Email */}
        <InputField
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/05b64796-icon"
          placeholder="Email"
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />

        {/* Password */}
        <InputField
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/c0dd4eef-icon"
          placeholder="Wachtwoord"
          isPassword
          value={form.password}
          onChangeText={(value) => handleInputChange("password", value)}
        />

        {/* Terms and Conditions */}
        <CheckboxWithLabel
          label="By continuing, you accept our Privacy Policy and Terms of Use"
          isChecked={isChecked}
          onPress={() => setIsChecked(!isChecked)}
        />

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.registerButton}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Registreer</Text>
          )}
        </TouchableOpacity>

        {/* Redirect to Login */}
        <TouchableOpacity onPress={() => router.push("/LoginScreen")} style={styles.loginRedirect}>
          <Text style={styles.loginRedirectText}>Heb je al een account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for Registration Form
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },
  formContainer: {
    width: "90%",
    maxWidth: 480,
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1d1617",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  toggleIcon: {
    width: 18,
    height: 18,
    marginLeft: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkboxUnchecked: {
    backgroundColor: "#fff",
    borderColor: "#e5e5e5",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#555",
  },
  registerButton: {
    width: "100%", // Full width button, same as Send button in ForgetPasswordScreen
    backgroundColor: "#4CAF50",
    borderRadius: 20, // Slightly rounded corners
    paddingVertical: 18, // Taller button to make text submerge
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loginRedirect: {
    marginTop: 36,
  },
  loginRedirectText: {
    fontSize: 14,
    color: "#4CAF50",
    textDecorationLine: "underline",
  },
});

export default RegistrationForm;
