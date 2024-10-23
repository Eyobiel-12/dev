import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, Auth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; // Firebase config

const authInstance: Auth = auth as Auth; // Explicitly typing `auth`

// Define types for InputField props
interface InputFieldProps {
  icon: string;
  placeholder: string;
  type: string;
  showToggle?: boolean;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  showPassword?: boolean;
  setShowPassword?: Dispatch<SetStateAction<boolean>>;
  error?: boolean;
}

// Reusable InputField Component
const InputField: React.FC<InputFieldProps> = ({
  icon,
  placeholder,
  type,
  showToggle,
  value,
  onChangeText,
  showPassword = false,
  setShowPassword,
  error = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Image source={{ uri: icon }} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        secureTextEntry={type === "password" && !showPassword}
        keyboardType={type === "email" ? "email-address" : "default"}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#A0A0A0"
      />
      {showToggle && setShowPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#A0A0A0"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Define types for LoginButton props
interface LoginButtonProps {
  onPress: () => void;
  loading: boolean;
  buttonScale: Animated.Value;
}

// Reusable LoginButton Component with animation and loading state
const LoginButton: React.FC<LoginButtonProps> = ({ onPress, loading, buttonScale }) => {
  return (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const buttonScale = useState(new Animated.Value(1))[0];
  const router = useRouter();

  // Email Validation
  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Input validation logic
  const validateInputs = (): boolean => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    return valid;
  };

  // Function to handle login
  const handleLogin = async () => {
    if (!validateInputs()) {
      setErrorMessage("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      if (user) {
        // Check if profile data exists in Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const { firstName, lastName, age, email, gender, height, weight, profileComplete } = userData;

          // Check if all the fields are available and profileComplete is true
          if (
            firstName &&
            lastName &&
            age &&
            email &&
            gender &&
            typeof height !== "undefined" &&
            typeof weight !== "undefined" &&
            profileComplete === true
          ) {
            // All required data exists, navigate to WelcomeScreen
            router.push("/WelcomeScreen");
          } else {
            // Data is incomplete or profileComplete is false, navigate to ProfileCompletion screen
            router.push("/ProfileCompletion");
          }
        } else {
          // No profile data, navigate to ProfileCompletion
          router.push("/ProfileCompletion");
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage((error as Error).message || "An unknown error occurred.");

      setLoginAttempts((prevAttempts) => prevAttempts + 1);
      if (loginAttempts + 1 >= 3) {
        Alert.alert("Too Many Attempts", "You will be redirected to reset your password.");
        router.push("/ForgetPasswordScreen");
      }
    }
  };

  // Animate button press
  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Navigate to Register Screen
  const handleRegister = () => {
    router.push("/RegistrationForm");
  };

  // Navigate to Forgot Password Screen
  const handleForgotPassword = () => {
    router.push("/ForgetPasswordScreen");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.loginPage}>
        <Text style={styles.title}>Welkom terug</Text>

        <InputField
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/c485f6f709c2175c5a2f5941dc5a070f81ca6d9bad564a260d62625341bcd3b8?placeholderIfAbsent=true&apiKey=7d135af2469340adb0e016bb065416d7"
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        {emailError && <Text style={styles.errorText}>Invalid email format.</Text>}

        <InputField
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/da4267761c7c75834d3d52bc0cbbe3b8a8622856ef0c8a0fd27b74f973d2773a?placeholderIfAbsent=true&apiKey=7d135af2469340adb0e016bb065416d7"
          placeholder="Wachtwoord"
          type="password"
          showToggle
          value={password}
          onChangeText={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={passwordError}
        />
        {passwordError && <Text style={styles.errorText}>Password must be at least 6 characters.</Text>}

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Wachtwoord vergeten?</Text>
        </TouchableOpacity>

        <Image
          source={require("./assets/img/vector.png")}
          style={styles.vectorImage}
          accessibilityLabel="Vector illustration"
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <LoginButton
          onPress={() => {
            animateButtonPress();
            handleLogin();
          }}
          loading={loading}
          buttonScale={buttonScale}
        />

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerText}>
            <Text style={styles.registerTextRegular}>Heb je geen account?</Text>{" "}
            <Text style={styles.registerTextGradient}>Registreer</Text>
          </Text>
        </TouchableOpacity>
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
  },
  loginPage: {
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
  inputError: {
    borderColor: "red",
  },
  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  forgotPassword: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#51BCCE", // Updated color
    textDecorationLine: "underline",
  },
  vectorImage: {
    width: 270, // Increased width for bigger image
    height: 140, // Increased height for bigger image
    resizeMode: "contain",
    marginTop: 20,
  },
  loginButton: {
    width: 315,
    height: 60,
    flexShrink: 0,
    backgroundColor: "#51BCCE", // Updated color
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  registerText: {
    marginTop: 36,
    textAlign: "center",
    fontSize: 14,
  },
  registerTextRegular: {
    color: "#1d1617",
  },
  registerTextGradient: {
    color: "#51BCCE", // Updated color
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
