import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { registerUser } from "../apis/service"; // same API call as web
import bgimg from "../../assets/chartImages/7744161-removebg-preview.png";

const Signup = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Please fill in all fields.",
      });
      return;
    }

    setLoading(true);
    const userData = {
      username,
      name,
      email,
      password,
    };

    try {
      const response = await registerUser(userData);
      setLoading(false);

      if (response?.error) {
        Toast.show({
          type: "error",
          text1: "Signup failed. Please try again.",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Signup successful! You can now log in.",
        });

        navigation.navigate("Login");
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={bgimg} style={styles.image} resizeMode="contain" />
      <View style={styles.formBox}>
        <Text style={styles.title}>
          Power <Text style={styles.sense}>Sense</Text>
        </Text>
        <Text style={styles.subTitle}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email ID"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.signup}>
          Already have an account?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0f0f0f",
  },
  image: {
    width: 500, // Matched reference width
    height: 300, // Matched reference height
    marginBottom: 10,
    resizeMode: "contain",
  },

  formBox: {
    width: "100%",
    backgroundColor: "#1a1a1a", // Matched reference form background
    padding: 24,
    borderRadius: 12,
    elevation: 6,
    borderWidth: 1.5, // Matched reference border
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00e6e6",
    marginBottom: 10,
    textAlign: "center",
  },
  sense: {
    color: "#ffffff",
  },
  subTitle: {
    fontSize: 22,
    marginVertical: 10,
    textAlign: "center",
    color: "#ccc",
  },
  input: {
    height: 48,
    backgroundColor: "#2c2c2c", // Matched reference input background
    color: "#fff", // Matched reference text color
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    placeholderTextColor: "#ccc", // Added from reference
  },
  loginButton: {
    backgroundColor: "#00e6e6", // Matched reference button color
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  loginText: {
    color: "#000", // Matched reference button text color
    fontWeight: "bold",
    fontSize: 16,
  },
  signup: {
    color: "#ccc", // Matched reference text color
    textAlign: "center",
  },
  signupLink: {
    color: "#00e6e6", // Matched reference link color
    fontWeight: "bold",
  },
});
