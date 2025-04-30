import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getCardData } from "../apis/service";
import icon1 from "../../assets/icons-cards yellow/Frame-15.png";
import icon2 from "../../assets/icons-cards black/Frame-16.png";
import Sidebar from "../components/Sidebar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView, StatusBar, Platform } from "react-native";

const Dashboard = () => {
  const navigation = useNavigation();
  const [hoverId, setHoverId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [currentIcon, setCurrentIcon] = useState(icon1);
  const [cardData, setCardData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchCardAndUser = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);

        const data = await getCardData();
        setCardData(data?.data || []);
      } catch (error) {
        console.error("Error fetching card data:", error);
        setCardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCardAndUser();

    const timer = setTimeout(() => {
      setCurrentIcon(icon2);
    }, 3600000); // 1 hour

    return () => clearTimeout(timer);
  }, []);

  const filteredCardData = cardData.filter(
    (card) => card.userId?.toString() === userId
  );

  const handleCardPress = (id, endPoint, lat, lon) => {
    setActiveId(id);
    setTimeout(() => {
      navigation.navigate("MachineDataCard", {
        endPoint,
        lat,
        lon,
      });
    }, 500);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, activeId === item.id && styles.activeCard]}
      onPress={() =>
        handleCardPress(item.id, item.endPoint, item.lat, item.lon)
      }
      onPressIn={() => setHoverId(item.id)}
      onPressOut={() => setHoverId(null)}
    >
      <View style={styles.cardContent}>
        <Image
          source={hoverId === item.id ? icon2 : currentIcon}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Sidebar should always be mounted to handle animation */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#00E6E6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Current & Power Monitoring</Text>
      </View>

      <View style={styles.cardsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00E6E6" />
        ) : filteredCardData.length === 0 ? (
          <Text style={styles.noDataText}>No card data inserted yet</Text>
        ) : (
          <FlatList
            data={filteredCardData}
            renderItem={renderCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cardList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#1b1b1b",
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 15,
  },
  card: {
    backgroundColor: "#2a2a2a",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#00E6E6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  activeCard: {
    borderColor: "#00E6E6",
    borderWidth: 2,
    backgroundColor: "#333",
  },

  container: {
    flex: 1,
    backgroundColor: "#121212",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  noDataText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
  },
  cardList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  activeCard: {
    borderColor: "#00E6E6",
    borderWidth: 2,
  },
  cardContent: {
    alignItems: "center",
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
