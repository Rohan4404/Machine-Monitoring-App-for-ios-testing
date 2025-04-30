// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import powerImg from "../../../assets/chartImages/Rectangle 1.png"; // Use a power-related image or the same as currentImg
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome";

// const MachinePowerScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { endPoint } = route.params || {};

//   const [data, setData] = useState([]);
//   const [maxPower, setMaxPower] = useState(null);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );
//   const [screenHeight, setScreenHeight] = useState(
//     Dimensions.get("window").height
//   );

//   const handleBackPress = () => {
//     navigation.goBack();
//   };

//   useEffect(() => {
//     const handleDimensionsChange = ({ window }) => {
//       setScreenWidth(window.width);
//       setScreenHeight(window.height);
//     };

//     const subscription = Dimensions.addEventListener(
//       "change",
//       handleDimensionsChange
//     );
//     return () => subscription.remove();
//   }, []);

//   const chartHeight = Math.min(
//     screenHeight * 0.6,
//     screenWidth < 768 ? 400 : 500
//   ); // Match chart height logic

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${endPoint}`);
//       if (response.data && response.data.length > 0) {
//         const parsedData = response.data.map((item) => ({
//           ...item,
//           jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
//           power: item.current ? (item.current * 220) / 1000 : 0, // Convert to kilowatts
//         }));

//         const sortedData = parsedData.sort(
//           (a, b) => a.jsTimestamp - b.jsTimestamp
//         );
//         const limitedData = sortedData.slice(-100);

//         setData(limitedData);

//         if (limitedData.length > 0) {
//           const maxPowerEntry = limitedData.reduce((max, item) =>
//             item.power > max.power ? item : max
//           );
//           setMaxPower({
//             ...maxPowerEntry,
//             power: Number.parseFloat(maxPowerEntry.power.toFixed(2)),
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [endPoint]);

//   const categories = data.map((item) => item.timestamp.split(" ")[1]);
//   const seriesData = data.map((item) =>
//     Number.parseFloat(item.power.toFixed(2))
//   );
//   const isMobile = screenWidth < 768;

//   const chartHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <script src="https://code.highcharts.com/highcharts.js"></script>
//         <style>
//           html, body {
//             margin: 0;
//             padding: 0;
//             background-color: #222;
//             height: 100%;
//           }
//           #chart {
//             height: 100%;
//             width: 100%;
//           }
//         </style>
//       </head>
//       <body>
//         <div id="chart"></div>
//         <script>
//           document.addEventListener("DOMContentLoaded", function () {
//             Highcharts.chart('chart', {
//               chart: {
//                 type: 'line',
//                 backgroundColor: '#222',
//                 height: ${chartHeight},
//                 spacingTop: ${isMobile ? 15 : 30},
//                 spacingBottom: ${isMobile ? 15 : 30}
//               },
//               title: {
//                 text: 'Power Consumption Trend',
//                 style: { color: '#92F1F1', fontSize: '${
//                   isMobile ? "14px" : "25px"
//                 }' }
//               },
//               xAxis: {
//                 categories: ${JSON.stringify(categories)},
//                 title: { text: 'Timestamp', style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' } },
//                 labels: {
//                   style: { color: '#D7D7D7', fontSize: '${
//                     isMobile ? "8px" : "12px"
//                   }' },
//                   rotation: ${isMobile ? -45 : 0},
//                   align: 'right'
//                 },
//                 tickInterval: ${Math.ceil(categories.length / 10)},
//                 lineColor: '#D7D7D7',
//                 gridLineColor: '#444'
//               },
//               yAxis: {
//                 title: { text: 'Power (kW)', style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' } },
//                 labels: { style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' } },
//                 min: 0,
//                 gridLineColor: '#555'
//               },
//               series: [{
//                 name: 'Power (kW)',
//                 data: ${JSON.stringify(seriesData)},
//                 color: '#92F1F1',
//                 lineWidth: ${isMobile ? 1 : 2},
//                 marker: { enabled: true, radius: ${isMobile ? 2 : 4} }
//               }],
//               tooltip: {
//                 backgroundColor: '#333',
//                 style: { color: '#92F1F1', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' },
//                 formatter: function () {
//                   const point = ${JSON.stringify(data)}[this.point.index];
//                   return '<b>Time:</b> ' + point.timestamp + '<br><b>Power:</b> ' + parseFloat(point.power.toFixed(2)) + ' kW';
//                 },
//                 useHTML: true
//               },
//               legend: { itemStyle: { color: '#D7D7D7', fontSize: '${
//                 isMobile ? "9px" : "13px"
//               }' } },
//               credits: { enabled: false }
//             });
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       style={styles.scrollView}
//       onLayout={(event) => {
//         const { width } = event.nativeEvent.layout;
//         console.log("ScrollView width:", width);
//       }}
//     >
//       <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//         <Icon name="arrow-left" style={styles.backIcon} />
//       </TouchableOpacity>
//       <Text style={styles.currentText}>Power Consumption</Text>

//       {/* Image container */}
//       <View
//         style={styles.imageContainer}
//         onLayout={(event) => {
//           console.log("Image container width:", event.nativeEvent.layout.width);
//         }}
//       >
//         <Image source={powerImg} style={styles.image} resizeMode="cover" />
//       </View>

//       <View style={[styles.chartWrapper, { height: chartHeight + 2 }]}>
//         <WebView
//           originWhitelist={["*"]}
//           source={{ html: chartHTML }}
//           style={{ flex: 1 }}
//           javaScriptEnabled
//           domStorageEnabled
//           scrollEnabled={false}
//         />
//       </View>

//       {maxPower && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
//               <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
//               <Text style={styles.maxValue}>{maxPower.power} kW </Text>
//             </Text>
//             <Text
//               style={[
//                 styles.maxValueTimestamp,
//                 isMobile && styles.maxValueTimestampMobile,
//               ]}
//             >
//               {maxPower.timestamp}
//             </Text>
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     alignItems: "stretch",
//     backgroundColor: "#111",
//     width: "100%",
//     minHeight: "100%", // Set container height to 100%
//   },
//   scrollView: {
//     backgroundColor: "black",
//   },
//   chartWrapper: {
//     borderWidth: 1,
//     borderColor: "#92F1F1",
//     borderRadius: 4,
//     overflow: "hidden",
//     width: "100%",
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   maxValueBox: {
//     marginTop: 10,
//     backgroundColor: "#111",
//     padding: 15,
//     alignItems: "center",
//     width: "100%",
//     borderRadius: 8,
//   },
//   maxValueContent: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 1,
//   },
//   maxText: {
//     color: "#92F1F1",
//     fontSize: 16,
//     textAlign: "center",
//     flexShrink: 1,
//   },
//   maxTextMobile: {
//     fontSize: 14,
//     lineHeight: 18,
//   },
//   maxValueLabel: {
//     color: "#92F1F1",
//     fontSize: 16,
//   },
//   maxValue: {
//     color: "#92F1F1",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   maxValueTimestamp: {
//     color: "#92F1F1",
//     fontSize: 14,
//     marginTop: 5,
//     textAlign: "center",
//   },
//   maxValueTimestampMobile: {
//     fontSize: 12,
//   },
//   currentText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 8,
//     marginTop: 30,
//     color: "#92F1F1",
//     textAlign: "center",
//   },
//   imageContainer: {
//     width: "100%",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   image: {
//     width: "100%",
//     height: 280,
//     minWidth: "100%",
//   },
//   backButton: {
//     position: "absolute",
//     top: 10,
//     left: 10,
//     zIndex: 1, // Ensure it stays above other content
//   },
//   backIcon: {
//     fontSize: 25, // Adjust size as needed
//     tintColor: "#92F1F1",
//     color: "#92F1F1", // Match the theme color
//   },
// });

// export default MachinePowerScreen;

import { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import powerImg from "../../../assets/chartImages/Rectangle 1.png";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const MachinePowerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { endPoint } = route.params || {};

  const [data, setData] = useState([]);
  const [maxPower, setMaxPower] = useState(null);
  const [averagePower, setAveragePower] = useState(null); // New state for average power
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const [loading, setLoading] = useState(true); // only for first load
  const [refreshing, setRefreshing] = useState(false); // if you later want pull-to-refresh

  useEffect(() => {
    const handleDimensionsChange = ({ window }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionsChange
    );
    return () => subscription.remove();
  }, []);

  const chartHeight = Math.min(
    screenHeight * 0.6,
    screenWidth < 768 ? 400 : 500
  );

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${endPoint}`);
  //     if (response.data && response.data.length > 0) {
  //       const parsedData = response.data.map((item) => ({
  //         ...item,
  //         jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
  //         power: item.current ? (item.current * 220) / 1000 : 0,
  //       }));

  //       const sortedData = parsedData.sort(
  //         (a, b) => a.jsTimestamp - b.jsTimestamp
  //       );
  //       const limitedData = sortedData.slice(-100);

  //       // Debug data
  //       console.log("Fetched data length:", limitedData.length);
  //       console.log("Sample data:", limitedData.slice(0, 2));

  //       setData(limitedData);

  //       if (limitedData.length > 0) {
  //         const maxPowerEntry = limitedData.reduce((max, item) =>
  //           item.power > max.power ? item : max
  //         );
  //         setMaxPower({
  //           ...maxPowerEntry,
  //           power: Number.parseFloat(maxPowerEntry.power.toFixed(2)),
  //         });

  //         // Calculate average power
  //         const totalPower = limitedData.reduce(
  //           (sum, item) => sum + item.power,
  //           0
  //         );
  //         const avgPower = limitedData.length
  //           ? Number.parseFloat((totalPower / limitedData.length).toFixed(2))
  //           : null;
  //         setAveragePower(avgPower);
  //       }
  //     } else {
  //       console.log("No data received from API");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await axios.get(`${endPoint}`);
      if (response.data && response.data.length > 0) {
        const parsedData = response.data.map((item) => ({
          ...item,
          jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
          power: item.current ? (item.current * 220) / 1000 : 0,
        }));

        const sortedData = parsedData.sort(
          (a, b) => a.jsTimestamp - b.jsTimestamp
        );
        const limitedData = sortedData.slice(-100);

        console.log("Fetched data length:", limitedData.length);
        console.log("Sample data:", limitedData.slice(0, 2));

        setData(limitedData);

        if (limitedData.length > 0) {
          const maxPowerEntry = limitedData.reduce((max, item) =>
            item.power > max.power ? item : max
          );
          setMaxPower({
            ...maxPowerEntry,
            power: Number.parseFloat(maxPowerEntry.power.toFixed(2)),
          });

          const totalPower = limitedData.reduce(
            (sum, item) => sum + item.power,
            0
          );
          const avgPower = limitedData.length
            ? Number.parseFloat((totalPower / limitedData.length).toFixed(2))
            : null;
          setAveragePower(avgPower);
        }
      } else {
        console.log("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [endPoint]);

  const categories = data.map((item) => item.timestamp.split(" ")[1]);
  const seriesData = data.map((item) =>
    Number.parseFloat(item.power.toFixed(2))
  );

  // Debug chart data
  console.log("Categories length:", categories.length);
  console.log("Series data length:", seriesData.length);
  console.log("Sample categories:", categories.slice(0, 2));
  console.log("Sample series data:", seriesData.slice(0, 2));

  const isMobile = screenWidth < 768;

  const chartHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background-color: #222;
            height: 100%;
          }
          #chart {
            height: 100%;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            try {
              Highcharts.chart('chart', {
                chart: {
                  type: 'line',
                  backgroundColor: '#222',
                  height: ${chartHeight},
                  spacingTop: ${isMobile ? 15 : 30},
                  spacingBottom: ${isMobile ? 15 : 30}
                },
                title: {
                  text: 'Power Consumption Trend',
                  style: { color: '#92F1F1', fontSize: '${
                    isMobile ? "14px" : "25px"
                  }' }
                },
                xAxis: {
                  categories: ${JSON.stringify(categories)},
                  title: { text: 'Timestamp', style: { color: '#D7D7D7', fontSize: '${
                    isMobile ? "10px" : "14px"
                  }' } },
                  labels: {
                    style: { color: '#D7D7D7', fontSize: '${
                      isMobile ? "8px" : "12px"
                    }' },
                    rotation: ${isMobile ? -45 : 0},
                    align: 'right'
                  },
                  tickInterval: ${Math.ceil(categories.length / 10)},
                  lineColor: '#D7D7D7',
                  gridLineColor: '#444'
                },
                yAxis: {
                  title: { text: 'Power (kW)', style: { color: '#D7D7D7', fontSize: '${
                    isMobile ? "10px" : "14px"
                  }' } },
                  labels: { style: { color: '#D7D7D7', fontSize: '${
                    isMobile ? "8px" : "12px"
                  }' } },
                  min: 0,
                  gridLineColor: '#555'
                },
                series: [{
                  name: 'Power (kW)',
                  data: ${JSON.stringify(seriesData)},
                  color: '#92F1F1',
                  lineWidth: ${isMobile ? 1 : 2},
                  marker: { enabled: true, radius: ${isMobile ? 2 : 4} }
                }],
                tooltip: {
                  backgroundColor: '#333',
                  style: { color: '#92F1F1', fontSize: '${
                    isMobile ? "8px" : "12px"
                  }' },
                  formatter: function () {
                    const point = ${JSON.stringify(data)}[this.point.index];
                    return '<b>Time:</b> ' + point.timestamp + '<br><b>Power:</b> ' + parseFloat(point.power.toFixed(2)) + ' kW';
                  },
                  useHTML: true
                },
                legend: { itemStyle: { color: '#D7D7D7', fontSize: '${
                  isMobile ? "9px" : "13px"
                }' } },
                credits: { enabled: false }
              });
            } catch (error) {
              console.error('Highcharts error:', error);
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.scrollView}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        console.log("ScrollView width:", width);
      }}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.currentText}>Power Consumption</Text>

      <View
        style={styles.imageContainer}
        onLayout={(event) => {
          console.log("Image container width:", event.nativeEvent.layout.width);
        }}
      >
        <Image source={powerImg} style={styles.image} resizeMode="cover" />
      </View>

      {/* <View style={[styles.chartWrapper, { height: chartHeight + 2 }]}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: chartHTML }}
          style={{ flex: 1, backgroundColor: "#222" }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error: ", nativeEvent);
          }}
          onLoadEnd={() => console.log("WebView loaded")}
        />
      </View> */}

      <View style={[styles.chartWrapper, { height: chartHeight + 2 }]}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#222",
            }}
          >
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={{ color: "white", marginTop: 10 }}>
              Loading data...
            </Text>
          </View>
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{ html: chartHTML }}
            style={{ flex: 1, backgroundColor: "#222" }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView error: ", nativeEvent);
            }}
            onLoadEnd={() => console.log("WebView loaded")}
          />
        )}
      </View>

      {maxPower && (
        <View style={styles.maxValueBox}>
          <View style={styles.maxValueContent}>
            <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
              <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
              <Text style={styles.maxValue}>{maxPower.power} kW </Text>
            </Text>
            <Text
              style={[
                styles.maxValueTimestamp,
                isMobile && styles.maxValueTimestampMobile,
              ]}
            >
              {maxPower.timestamp}
            </Text>
            {averagePower !== null && (
              <Text
                style={[styles.avgPowerText, isMobile && styles.maxTextMobile]}
              >
                <Text style={styles.maxValueLabel}>➕ Avg Power: </Text>
                <Text style={styles.maxValue}>
                  {averagePower.toFixed(2)} kW
                </Text>
              </Text>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "stretch",
    backgroundColor: "#111",
    width: "100%",
    minHeight: "100%",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    backgroundColor: "black",
  },
  chartWrapper: {
    borderWidth: 1,
    borderColor: "#92F1F1",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    marginBottom: 10,
    marginTop: 20,
  },
  maxValueBox: {
    marginTop: 0,
    backgroundColor: "#111",
    padding: 0,
    alignItems: "center",
    width: "100%",
    borderRadius: 8,
  },
  maxValueContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  maxText: {
    color: "#92F1F1",
    fontSize: 16,
    textAlign: "center",
    flexShrink: 1,
  },
  avgPowerText: {
    color: "#92F1F1",
    fontSize: 16,
    paddingTop: 15,
    textAlign: "center",
    flexShrink: 1,
  },
  maxTextMobile: {
    fontSize: 14,
    lineHeight: 18,
  },
  maxValueLabel: {
    color: "#92F1F1",
    fontSize: 16,
  },
  maxValue: {
    color: "#92F1F1",
    fontWeight: "bold",
    fontSize: 16,
  },
  maxValueTimestamp: {
    color: "#92F1F1",
    fontSize: 14,
    marginTop: 0,
    textAlign: "center",
  },
  maxValueTimestampMobile: {
    fontSize: 12,
  },
  currentText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 30,
    color: "#92F1F1",
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 280,
    minWidth: "100%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backIcon: {
    fontSize: 25,
    tintColor: "#92F1F1",
    color: "#92F1F1",
  },
});

export default MachinePowerScreen;
