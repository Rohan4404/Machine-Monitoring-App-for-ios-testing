import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../apis/service";
import bgimg from "../../assets/chartImages/7744161-removebg-preview.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    console.log("Logging in with:", email, password);
    setLoading(true);

    try {
      const userData = { email, password };
      const response = await loginUser(userData);

      console.log("API response:", response);

      if (response.token) {
        await AsyncStorage.setItem("token", response.token);
        if (response.id) {
          await AsyncStorage.setItem("userId", response.id.toString());
        }
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        Alert.alert("Error", response.error || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#0f0f0f" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <StatusBar
            backgroundColor="#0f0f0f"
            barStyle="light-content"
            translucent={false}
          />
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Image source={bgimg} style={styles.image} />
            <Text style={styles.title}>
              Power <Text style={styles.sense}>Sense</Text>
            </Text>

            <View style={styles.formBox}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
                style={styles.forgotLink}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Login</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.signup}>
                Don’t have an account?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("Signup")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#0f0f0f",
  },
  image: {
    width: 500,
    height: 300,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00e6e6",
    marginBottom: 10,
  },
  sense: {
    color: "#ffffff",
  },
  formBox: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    padding: 24,
    borderRadius: 12,
    elevation: 6,
    borderWidth: 1.5,
  },
  input: {
    height: 48,
    backgroundColor: "#2c2c2c",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  forgotLink: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#00e6e6",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#00e6e6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  loginText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  signup: {
    color: "#ccc",
    textAlign: "center",
  },
  signupLink: {
    color: "#00e6e6",
    fontWeight: "bold",
  },
});
