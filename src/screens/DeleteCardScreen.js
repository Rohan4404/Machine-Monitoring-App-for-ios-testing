import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getCardData } from "../apis/service";
import { apiURL } from "../apis/client";

const DeleteCard = () => {
  const [cardId, setCardId] = useState("");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      try {
        const data = await getCardData();
        const userCards =
          data?.data?.filter((card) => card.userId.toString() === userId) || [];
        setCardData(userCards);
      } catch (error) {
        console.error("Error fetching card data:", error);
        setCardData([]);
      }
    };
    fetchData();
  }, []);

  const deleteCardData = async (title) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${apiURL}/deletecardData/${title}`);
      if (response.data) {
        Alert.alert("Success", "Card deleted successfully!");
        setCardId("");
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!cardId) {
      Alert.alert("Error", "Please select a valid card.");
      return;
    }
    deleteCardData(cardId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={{ fontSize: 20, color: "#aaa" }}>×</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Delete Card</Text>

        <Text style={styles.label}>Select Machine to Delete</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={cardId}
            style={styles.picker}
            onValueChange={(itemValue) => setCardId(itemValue)}
          >
            <Picker.Item label="Select a Machine" value="" />
            {cardData.map((card) => (
              <Picker.Item
                label={card.title}
                value={card.title}
                key={card.title}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Delete Card</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteCard;

const styles = StyleSheet.create({
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
    backgroundColor: "#161B22",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    marginBottom: 10,
    fontSize: 14,
  },
  pickerContainer: {
    backgroundColor: "#2A2F36",
    borderRadius: 8,
    marginBottom: 20,
    borderColor: "#666",
    borderWidth: 1,
  },
  picker: {
    color: "#fff",
    height: 50,
    width: "100%",
  },
  submitBtn: {
    backgroundColor: "#00E6E6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitText: {
    fontWeight: "bold",
    color: "#000",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
});
