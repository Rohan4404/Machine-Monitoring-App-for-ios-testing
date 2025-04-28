// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
// import { sendPasswordReset } from "../apis/service";
// import bgimg from "../../assets/icons/20945567.jpg";

// const ForgotPassword = () => {
//   const navigation = useNavigation();
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);

//   const handleResetRequest = async () => {
//     if (!email) {
//       Toast.show({
//         type: "error",
//         text1: "Please enter your email.",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await sendPasswordReset({ email });

//       if (response?.message) {
//         Toast.show({
//           type: "success",
//           text1: response.message,
//         });
//         setEmailSent(true);
//       } else {
//         Toast.show({
//           type: "error",
//           text1: response?.error || "Failed to send reset email.",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       if (error.response) {
//         if (error.response.status === 404) {
//           Toast.show({
//             type: "error",
//             text1: "User with this email does not exist.",
//           });
//         } else if (error.response.status === 500) {
//           Toast.show({
//             type: "error",
//             text1: "Server error, please try again later.",
//           });
//         } else {
//           Toast.show({
//             type: "error",
//             text1: error.response.data?.error || "Something went wrong.",
//           });
//         }
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Network error. Please check your connection.",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Image source={bgimg} style={styles.image} resizeMode="contain" />

//       <View style={styles.formContainer}>
//         <Text style={styles.title}>
//           Power <Text style={styles.sense}>Sense</Text>
//         </Text>
//         <Text style={styles.subTitle}>Forgot Password</Text>

//         {!emailSent ? (
//           <>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <TouchableOpacity
//               onPress={handleResetRequest}
//               style={styles.button}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Send Reset Link</Text>
//               )}
//             </TouchableOpacity>
//           </>
//         ) : (
//           <Text style={styles.successMsg}>
//             A reset link has been sent to your email. Check your inbox.
//           </Text>
//         )}

//         <Text style={styles.loginPrompt}>
//           Remembered your password?{" "}
//           <Text
//             style={styles.loginLink}
//             onPress={() => navigation.navigate("Login")}
//           >
//             Login
//           </Text>
//         </Text>
//       </View>

//       <Toast />
//     </ScrollView>
//   );
// };

// export default ForgotPassword;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#0f0f0f",
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     marginBottom: 10,
//   },
//   formContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//   },
//   sense: {
//     color: "green",
//   },
//   subTitle: {
//     fontSize: 22,
//     marginVertical: 10,
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#1e90ff",
//     padding: 15,
//     borderRadius: 10,
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   successMsg: {
//     fontSize: 16,
//     color: "green",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   loginPrompt: {
//     fontSize: 14,
//     textAlign: "center",
//   },
//   loginLink: {
//     color: "#1e90ff",
//     fontWeight: "bold",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { sendPasswordReset } from "../apis/service";
import bgimg from "../../assets/chartImages/7744161-removebg-preview.png";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter your email.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await sendPasswordReset({ email });

      if (response?.message) {
        Toast.show({
          type: "success",
          text1: response.message,
        });
        setEmailSent(true);
      } else {
        Toast.show({
          type: "error",
          text1: response?.error || "Failed to send reset email.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 404) {
          Toast.show({
            type: "error",
            text1: "User with this email does not exist.",
          });
        } else if (error.response.status === 500) {
          Toast.show({
            type: "error",
            text1: "Server error, please try again later.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: error.response.data?.error || "Something went wrong.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Network error. Please check your connection.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={bgimg} style={styles.image} resizeMode="contain" />

      <View style={styles.formBox}>
        <Text style={styles.title}>
          Power <Text style={styles.sense}>Sense</Text>
        </Text>
        <Text style={styles.subTitle}>Forgot Password</Text>

        {!emailSent ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={handleResetRequest}
              style={styles.loginButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.successMsg}>
            A reset link has been sent to your email. Check your inbox.
          </Text>
        )}

        <Text style={styles.signup}>
          Remembered your password?{" "}
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

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24, // Increased from 20 to match reference
    backgroundColor: "#0f0f0f",
  },
  image: {
    width: 500, // Matched reference width
    height: 300, // Increased from 200 to match reference
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
    // borderColor: "#679797", // Matched reference border color
  },
  title: {
    fontSize: 32, // Increased from 28 to match reference
    fontWeight: "bold",
    textAlign: "center",
    color: "#00e6e6", // Changed to teal from default
    marginBottom: 10, // Matched reference margin
  },
  sense: {
    color: "#ffffff", // Changed to white from green
  },
  subTitle: {
    fontSize: 22, // Kept as is
    textAlign: "center",
    marginVertical: 10, // Kept as is
    color: "#ccc", // Changed to match reference signup text
  },
  input: {
    height: 48, // Matched reference height
    backgroundColor: "#2c2c2c", // Changed from #ccc border to dark background
    color: "#fff", // Changed text color to white
    borderRadius: 8, // Changed from 10 to 8 to match reference
    paddingHorizontal: 16, // Added from reference
    marginBottom: 16, // Changed from 15 to 16 to match reference
    placeholderTextColor: "#ccc", // Added from reference
  },
  loginButton: {
    backgroundColor: "#00e6e6", // Changed to teal from #1e90ff
    paddingVertical: 14, // Changed from 15 to 14 to match reference
    borderRadius: 8, // Changed from 10 to 8 to match reference
    alignItems: "center",
    marginBottom: 16, // Changed from 15 to 16 to match reference
    width: "100%", // Added to match button behavior
  },
  loginText: {
    color: "#000", // Changed to black from #fff to match reference
    fontWeight: "bold",
    fontSize: 16, // Increased from default to match reference
  },
  successMsg: {
    fontSize: 16,
    color: "#00e6e6", // Changed to teal from green for consistency
    textAlign: "center",
    marginBottom: 20,
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
