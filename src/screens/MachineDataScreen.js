// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import MachineLocationScreen from "../screens/MachineDataInfo/MachineLocationScreen";
// import { GraphData } from "../utlity/utlity"; // Adjust the import path as needed

// const MachineDataScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { lat, lon, endPoint } = route.params || {};

//   console.log("endpoint of this is ", endPoint); // getting lat, lon from route params

//   const handleContainerPress = (link) => {
//     navigation.navigate(link, { endPoint, lat, lon });
//   };

//   return (
//     <ScrollView style={styles.wrapper}>
//       <View style={styles.container}>
//         <Text style={styles.helloText}>Track Location of Machine</Text>
//         <View style={styles.fullBox}>
//           <MachineLocationScreen lat={lat} lon={lon} />
//         </View>

//         <View style={styles.gridContainer}>
//           {GraphData.map((item) => (
//             <TouchableOpacity
//               key={item.id}
//               style={styles.gridItem}
//               onPress={() => handleContainerPress(item.link)}
//             >
//               <Image source={item.icon} style={styles.icon} />
//               <Text style={styles.gridItemText}>{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     backgroundColor: "#121212",
//   },
//   container: {
//     padding: 5,
//     paddingBottom: 20,
//   },
//   fullBox: {
//     marginVertical: 5,
//     backgroundColor: "#2a2a2a",
//     borderColor: "#679797",
//     borderRadius: 10,
//     padding: 5,
//     elevation: 5,
//     marginBottom: 0,
//     height: 320, // Adjust based on your map size requirements
//   },
//   helloText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 8,

//     marginTop: 30,
//     color: "#92F1F1",
//     textAlign: "center",
//   },
//   gridContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   gridItem: {
//     width: "47%",
//     backgroundColor: "#2a2a2a",
//     borderRadius: 10,
//     padding: 15,
//     // marginBottom: 10,
//     margin: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     height: 200,
//     borderWidth: 1,
//     borderColor: "#679797",
//   },
//   icon: {
//     width: 60,
//     height: 60,
//     marginBottom: 15,
//     tintColor: "#00e6e6", // Teal/cyan color as shown in the image
//   },
//   gridItemText: {
//     color: "white",
//     textAlign: "center",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default MachineDataScreen;

import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MachineLocationScreen from "../screens/MachineDataInfo/MachineLocationScreen";
import { GraphData } from "../utlity/utlity"; // Adjust the import path as needed
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome Icon


const MachineDataScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { lat, lon, endPoint } = route.params || {};

  console.log("endpoint of this is ", endPoint); // getting lat, lon from route params

  const handleContainerPress = (link) => {
    navigation.navigate(link, { endPoint, lat, lon });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-left" style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.helloText}>Track Location of Machine</Text>
        <View style={styles.fullBox}>
          <MachineLocationScreen lat={lat} lon={lon} />
        </View>

        <View style={styles.gridContainer}>
          {GraphData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => handleContainerPress(item.link)}
            >
              <Image source={item.icon} style={styles.icon} />
              <Text style={styles.gridItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    padding: 5,
    paddingBottom: 20,
    position: "relative", // Ensure positioning context for absolute back button
  },
  backButton: {
    position: "absolute",
    top: 5,
    left: 10,
    zIndex: 1, // Ensure it stays above other content
  },
  backIcon: {
    fontSize: 25,
    // Adjust size as needed
    // color: "#92F1F1", // Match the theme color

    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    tintColor: "#92F1F1",
    color: "#92F1F1", // Match the theme color
  },
  fullBox: {
    marginVertical: 5,
    backgroundColor: "#2a2a2a",
    borderColor: "#679797",
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    marginBottom: 0,
    height: 320, // Adjust based on your map size requirements
  },
  helloText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 30,
    color: "#92F1F1",
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  gridItem: {
    width: "47%",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderWidth: 1,
    borderColor: "#679797",
  },
  icon: {
    width: 60,
    height: 40,
    marginBottom: 15,
    tintColor: "#00e6e6", // Teal/cyan color as shown in the image
  },
  gridItemText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MachineDataScreen;
