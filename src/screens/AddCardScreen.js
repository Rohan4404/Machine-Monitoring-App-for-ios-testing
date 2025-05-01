import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeCardData } from "../apis/service";

const { width } = Dimensions.get("window");

const AddCard = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: "",
    endPoint: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const borderAngle = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const rotate = () => {
      Animated.loop(
        Animated.timing(borderAngle, {
          toValue: 360,
          duration: 6000,
          useNativeDriver: false,
        })
      ).start();
    };
    rotate();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getLatLonFromAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`,
        {
          headers: {
            "User-Agent": "ReactNativeApp/1.0 (rohansharma99anc@gmail.com)",
          },
        }
      );
      const data = await response.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    setLoading(true);
    const geoData = await getLatLonFromAddress(formData.address);
    if (!geoData) {
      Alert.alert("Invalid Address", "Unable to fetch coordinates.");
      setLoading(false);
      return;
    }

    const cardData = {
      userId,
      title: formData.title,
      endPoint: formData.endPoint,
      lat: geoData.lat,
      lon: geoData.lon,
    };

    try {
      const response = await storeCardData(cardData);
      if (response.error) {
        Alert.alert("Error", response.error);
      } else {
        Alert.alert("Success", "Card added successfully!");
        navigation.navigate("Dashboard");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            borderColor: borderAngle.interpolate({
              inputRange: [0, 360],
              outputRange: ["#00D1D1", "#00D1D1"],
            }),
          },
        ]}
      >
        <Text style={styles.title}>Add Machine</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Enter title"
          value={formData.title}
          onChangeText={(text) => handleInputChange("title", text)}
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TextInput
          placeholder="Enter endpoint URL"
          value={formData.endPoint}
          onChangeText={(text) => handleInputChange("endPoint", text)}
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TextInput
          placeholder="Enter address"
          value={formData.address}
          onChangeText={(text) => handleInputChange("address", text)}
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    // backgroundColor: "#2A2F36",
    borderRadius: 20,
    padding: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    backgroundColor: "rgba(13,17,23,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#13171D",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2A2F36",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: "#00E6E6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    fontWeight: "bold",
    color: "#000",
  },
});
