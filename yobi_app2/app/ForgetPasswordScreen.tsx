import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router"; // Import router for navigation
import { sendPasswordResetEmail } from "firebase/auth"; // Firebase function to send password reset email
import { auth } from "./firebaseConfig"; // Firebase config

const ForgetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Router for navigation

  // Function to handle sending password reset email
  const handleSend = async () => {
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      Alert.alert("Password Reset", "Instructions have been sent to your email.");
      router.push("/LoginScreen"); // Navigate back to login after success
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.description}>
          Enter your email, and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Send Button */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Button */}
        <TouchableOpacity onPress={() => router.push("/LoginScreen")} style={styles.backToLoginButton}>
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles for Forget Password Screen
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f9fc",
  },
  container: {
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
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#51BCCE", // Updated button color
    borderRadius: 20, // Rounded corners for the button
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  backToLoginButton: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  backToLoginText: {
    fontSize: 16,
    color: "#51BCCE", // Updated text color to match the new theme
    textDecorationLine: "underline",
  },
});

export default ForgetPasswordScreen;
