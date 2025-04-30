// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Dimensions,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import currentImg from "../../../assets/chartImages/3515462.jpg";
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome";

// const MachineCurrentScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const { endPoint } = route.params || {};

//   console.log("endpoint of current is ", endPoint);

//   const [data, setData] = useState([]);
//   const [maxValue, setMaxValue] = useState(null);
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

//   // Calculate chart height based on screen size
//   const chartHeight = Math.min(
//     screenHeight * 0.6, // Take up to 60% of screen height
//     screenWidth < 768 ? 400 : 500 // Minimum heights for mobile/desktop
//   );

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${endPoint}`);
//       if (response.data && response.data.length > 0) {
//         const parsedData = response.data.map((item) => ({
//           ...item,
//           jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
//         }));

//         const sortedData = parsedData.sort(
//           (a, b) => a.jsTimestamp - b.jsTimestamp
//         );
//         const limitedData = sortedData.slice(-100);

//         setData(limitedData);
//         setMaxValue(
//           limitedData.reduce((max, item) =>
//             item.current > max.current
//               ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
//               : max
//           )
//         );
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
//   const seriesData = data.map((item) => item.current);
//   const isMobile = screenWidth < 768;
//   const chartHTML = `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <script src="https://code.highcharts.com/highcharts.js"></script>
//       <style>
//         html, body {
//           margin: 0;
//           padding: 0;
//           background-color: #222;
//           height: 100%;
//         }
//         #chart {
//           height: 100%;
//           width: 100%;
//         }
//       </style>
//     </head>
//     <body>
//       <div id="chart"></div>
//       <script>
//         document.addEventListener("DOMContentLoaded", function () {
//           Highcharts.chart('chart', {
//             chart: {
//               type: 'line',
//               backgroundColor: '#222',
//               height: ${chartHeight},
//               spacingTop: ${isMobile ? 15 : 30},
//               spacingBottom: ${isMobile ? 15 : 30}
//             },
//             title: {
//               text: 'Current Consumption Trend',
//               style: {
//                 color: '#92F1F1',
//                 fontSize: '${isMobile ? "17px" : "25px"}'
//               }
//             },
//             xAxis: {
//               categories: ${JSON.stringify(categories)},
//               title: {
//                 text: 'Timestamp',
//                 style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' }
//               },
//               labels: {
//                 style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' },
//                 rotation: ${isMobile ? -45 : 0},
//                 align: 'right'
//               },
//               tickInterval: ${Math.ceil(categories.length / 10)},
//               lineColor: '#92F1F1',
//               gridLineColor: '#444'
//             },
//             yAxis: {
//               title: {
//                 text: 'Current (A)',
//                 style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' }
//               },
//               labels: { style: { color: '#D7D7D7', fontSize: '${
//                 isMobile ? "8px" : "12px"
//               }' } },
//               min: 0,
//               gridLineColor: '#555'
//             },
//             series: [{
//               name: 'Current',
//               data: ${JSON.stringify(seriesData)},
//               color: '#92F1F1',
//               lineWidth: ${isMobile ? 1 : 2},
//               marker: { enabled: true, radius: ${isMobile ? 2 : 4} }
//             }],
//             tooltip: {
//               backgroundColor: '#333',
//               style: { color: '#92F1F1', fontSize: '${
//                 isMobile ? "8px" : "12px"
//               }' },
//               formatter: function () {
//                 const point = ${JSON.stringify(data)}[this.point.index];
//                 return '<b>Time:</b> ' + point.timestamp + '<br><b>Current:</b> ' + point.current.toFixed(2) + ' A';
//               },
//               useHTML: true
//             },
//             legend: {
//               itemStyle: { color: '#D7D7D7', fontSize: '${
//                 isMobile ? "9px" : "13px"
//               }' }
//             },
//             credits: { enabled: false }
//           });
//         });
//       </script>
//     </body>
//   </html>
// `;

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       style={styles.scrollView}
//       onLayout={(event) => {
//         const { width } = event.nativeEvent.layout;
//         console.log("ScrollView width:", width); // Debug the container width
//       }}
//     >
//       <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
//         <Icon name="arrow-left" style={styles.backIcon} />
//       </TouchableOpacity>
//       <Text style={styles.currentText}>Current Consumption</Text>

//       {/* Updated Image container and style with debug */}
//       <View
//         style={styles.imageContainer}
//         onLayout={(event) => {
//           console.log("Image container width:", event.nativeEvent.layout.width);
//         }}
//       >
//         <Image
//           source={currentImg}
//           style={styles.image}
//           resizeMode="cover" // Changed to cover to force stretch
//         />
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

//       {maxValue && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
//               <Text style={styles.maxValueLabel}>🔹 Max Current: </Text>
//               <Text style={styles.maxValue}>
//                 {maxValue.current.toFixed(1)} A{" "}
//               </Text>
//             </Text>
//             <Text
//               style={[
//                 styles.maxValueTimestamp,
//                 isMobile && styles.maxValueTimestampMobile,
//               ]}
//             >
//               {maxValue.timestamp}
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
//     alignItems: "stretch", // Changed from center to stretch
//     backgroundColor: "#111",
//     width: "100%",
//     minHeight: "100%",
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

//   imageContainer: {
//     width: "100%",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   image: {
//     width: "100%",
//     height: 280,
//     minWidth: "100%", // Fallback to ensure minimum width
//   },
//   maxValueTimestampMobile: {
//     fontSize: 12,
//   },
//   currentText: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 15,
//     marginTop: 30,
//     color: "#92F1F1",
//     textAlign: "center",
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

// export default MachineCurrentScreen;

import { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import currentImg from "../../../assets/chartImages/3515462.jpg";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const MachineCurrentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { endPoint } = route.params || {};

  console.log("endpoint of current is ", endPoint);

  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(null);
  const [averageCurrent, setAverageCurrent] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const handleBackPress = () => {
    navigation.goBack();
  };
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

  // Calculate chart height based on screen size
  const chartHeight = Math.min(
    screenHeight * 0.6, // Take up to 60% of screen height
    screenWidth < 768 ? 400 : 500 // Minimum heights for mobile/desktop
  );
  const [loading, setLoading] = useState(true); // only for first time
  const [refreshing, setRefreshing] = useState(false); // for later fetches

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(`${endPoint}`);
  //     if (response.data && response.data.length > 0) {
  //       const parsedData = response.data.map((item) => ({
  //         ...item,
  //         jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
  //       }));

  //       const sortedData = parsedData.sort(
  //         (a, b) => a.jsTimestamp - b.jsTimestamp
  //       );
  //       const limitedData = sortedData.slice(-100);

  //       // Debug datar
  //       console.log("Fetched data length:", limitedData.length);
  //       console.log("Sample data:", limitedData.slice(0, 2));

  //       setData(limitedData);
  //       setMaxValue(
  //         limitedData.reduce((max, item) =>
  //           item.current > max.current
  //             ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
  //             : max
  //         )
  //       );

  //       // Calculate average current
  //       const totalCurrent = limitedData.reduce(
  //         (sum, item) => sum + item.current,
  //         0
  //       );
  //       const avgCurrent = limitedData.length
  //         ? Number.parseFloat((totalCurrent / limitedData.length).toFixed(1))
  //         : null;
  //       setAverageCurrent(avgCurrent);
  //     } else {
  //       console.log("No data received from API");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchData = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true); // first time loading
    } else {
      setRefreshing(true); // refreshing
    }

    try {
      const response = await axios.get(`${endPoint}`);
      if (response.data && response.data.length > 0) {
        const parsedData = response.data.map((item) => ({
          ...item,
          jsTimestamp: new Date(item.timestamp.replace(" ", "T")).getTime(),
        }));

        const sortedData = parsedData.sort(
          (a, b) => a.jsTimestamp - b.jsTimestamp
        );
        const limitedData = sortedData.slice(-100);

        console.log("Fetched data length:", limitedData.length);
        console.log("Sample data:", limitedData.slice(0, 2));

        setData(limitedData);
        setMaxValue(
          limitedData.reduce((max, item) =>
            item.current > max.current
              ? { ...item, current: Number.parseFloat(item.current.toFixed(1)) }
              : max
          )
        );

        const totalCurrent = limitedData.reduce(
          (sum, item) => sum + item.current,
          0
        );
        const avgCurrent = limitedData.length
          ? Number.parseFloat((totalCurrent / limitedData.length).toFixed(1))
          : null;
        setAverageCurrent(avgCurrent);
      } else {
        console.log("No data received from API");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (isInitial) {
        setLoading(false); // done loading first time
      } else {
        setRefreshing(false); // done refreshing
      }
    }
  };

  useEffect(() => {
    // fetchData();
    fetchData(true);
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [endPoint]);

  const categories = data.map((item) => item.timestamp.split(" ")[1]);
  const seriesData = data.map((item) => item.current);

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
                text: 'Current Consumption Trend',
                style: {
                  color: '#92F1F1',
                  fontSize: '${isMobile ? "17px" : "25px"}'
                }
              },
              xAxis: {
                categories: ${JSON.stringify(categories)},
                title: {
                  text: 'Timestamp',
                  style: { color: '#D7D7D7', fontSize: '${
                    isMobile ? "10px" : "14px"
                  }' }
                },
                labels: {
                  style: { color: '#D7D7D7', fontSize: '${
                    isMobile ? "8px" : "12px"
                  }' },
                  rotation: ${isMobile ? -45 : 0},
                  align: 'right'
                },
                tickInterval: ${Math.ceil(categories.length / 10)},
                lineColor: '#92F1F1',
                gridLineColor: '#444'
              },
              yAxis: {
                title: {
                  text: 'Current (A)',
                  style: { color: '#D7D7D7', fontSize: '${
                    isMobile ? "10px" : "14px"
                  }' }
                },
                labels: { style: { color: '#D7D7D7', fontSize: '${
                  isMobile ? "8px" : "12px"
                }' } },
                min: 0,
                gridLineColor: '#555'
              },
              series: [{
                name: 'Current',
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
                  return '<b>Time:</b> ' + point.timestamp + '<br><b>Current:</b> ' + point.current.toFixed(2) + ' A';
                },
                useHTML: true
              },
              legend: {
                itemStyle: { color: '#D7D7D7', fontSize: '${
                  isMobile ? "9px" : "13px"
                }' }
              },
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
      <Text style={styles.currentText}>Current Consumption</Text>

      <View
        style={styles.imageContainer}
        onLayout={(event) => {
          console.log("Image container width:", event.nativeEvent.layout.width);
        }}
      >
        <Image source={currentImg} style={styles.image} resizeMode="cover" />
      </View>
      {/* 
      <View style={[styles.chartWrapper, { height: chartHeight + 2 }]}>
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

      {maxValue && (
        <View style={styles.maxValueBox}>
          <View style={styles.maxValueContent}>
            <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
              <Text style={styles.maxValueLabel}>🔹 Max Current: </Text>
              <Text style={styles.maxValue}>
                {maxValue.current.toFixed(1)} A{" "}
              </Text>
            </Text>
            <Text
              style={[
                styles.maxValueTimestamp,
                isMobile && styles.maxValueTimestampMobile,
              ]}
            >
              {maxValue.timestamp}
            </Text>
            {averageCurrent !== null && (
              <Text style={[styles.avgText, isMobile && styles.maxTextMobile]}>
                <Text style={styles.maxValueLabel}>➕ Avg Current: </Text>
                <Text style={styles.maxValue}>
                  {averageCurrent.toFixed(1)} A
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
  avgText: {
    color: "#92F1F1",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 15,
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
    marginTop: 5,
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
  maxValueTimestampMobile: {
    fontSize: 12,
  },
  currentText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 30,
    color: "#92F1F1",
    textAlign: "center",
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

export default MachineCurrentScreen;
