// "use client";

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { useRoute } from "@react-navigation/native";

// const VOLTAGE = 220;

// const MachinePeakPowerScreen = () => {
//   // const route = useRoute();
//   // const endPoint = route.params?.endPoint;

//   const route = useRoute();
//   const { endPoint } = route.params || {};

//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );

//   // Update screen width on dimension change
//   useEffect(() => {
//     const updateLayout = () => {
//       setScreenWidth(Dimensions.get("window").width);
//     };

//     Dimensions.addEventListener("change", updateLayout);
//     return () => {
//       // Clean up event listener
//       const dimensionsHandler = Dimensions.addEventListener("change", () => {});
//       dimensionsHandler.remove();
//     };
//   }, []);

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`${endPoint}`);
//         console.log(endPoint, "endPoint of peak power");
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const apiData = await response.json();
//         const processedData = processDataByHour(apiData, selectedDate);
//         setData([...processedData]);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (endPoint) {
//       fetchData();
//     }
//   }, [selectedDate, endPoint]);

//   const processDataByHour = (apiData, selectedDate) => {
//     const groupedData = {};
//     const selectedYear = selectedDate.getFullYear();
//     const selectedMonth = selectedDate.getMonth();
//     const selectedDay = selectedDate.getDate();

//     apiData.forEach((entry) => {
//       const entryDate = new Date(entry.timestamp);
//       if (
//         entryDate.getFullYear() === selectedYear &&
//         entryDate.getMonth() === selectedMonth &&
//         entryDate.getDate() === selectedDay
//       ) {
//         const hour = entryDate.getHours();
//         const power = ((entry.current * VOLTAGE) / 1000).toFixed(2);
//         if (!groupedData[hour] || power > groupedData[hour].power) {
//           groupedData[hour] = {
//             power: Number.parseFloat(power),
//             timestamp: entry.timestamp,
//           };
//         }
//       }
//     });

//     return Object.keys(groupedData).map((hour) => [
//       Date.UTC(selectedYear, selectedMonth, selectedDay, hour),
//       groupedData[hour].power,
//       groupedData[hour].timestamp,
//     ]);
//   };

//   // Handle date picker
//   const handleConfirm = (date) => {
//     setSelectedDate(date);
//     setShowDatePicker(false);
//   };

//   // Responsive sizes
//   const isMobile = true; // Always true for React Native
//   const chartHeight = 300;

//   // Format date for display
//   const formatDate = (date) => {
//     return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
//   };

//   // Prepare data for chart
//   const categories = data.map(([timestamp]) => {
//     const date = new Date(timestamp);
//     return `${date.getHours()}:00`;
//   });

//   const seriesData = data.map(([_, power]) => power);

//   // Generate HTML for Highcharts
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
//               type: 'column',
//               backgroundColor: '#222',
//               height: ${chartHeight},
//               spacingTop: 15,
//               spacingBottom: 15
//             },
//             title: {
//               text: 'Power Peak Per Hour',
//               style: {
//                 color: '#92F1F1',
//                 fontSize: '14px'
//               }
//             },
//             xAxis: {
//               categories: ${JSON.stringify(categories)},
//               title: {
//                 text: 'Time',
//                 style: { color: '#D7D7D7', fontSize: '10px' }
//               },
//               labels: {
//                 style: { color: '#D7D7D7', fontSize: '8px' },
//                 rotation: -45,
//                 align: 'right'
//               },
//               tickInterval: ${Math.ceil(categories.length / 10)},
//               lineColor: '#92F1F1',
//               gridLineColor: '#444'
//             },
//             yAxis: {
//               title: {
//                 text: 'Power (kW)',
//                 style: { color: '#D7D7D7', fontSize: '10px' }
//               },
//               labels: { style: { color: '#D7D7D7', fontSize: '8px' } },
//               min: 0,
//               gridLineColor: '#555'
//             },
//             series: [{
//               name: 'Max Power',
//               data: ${JSON.stringify(seriesData)},
//               color: '#92F1F1',
//               pointWidth: 5,
//               borderRadius: 5,
//               borderWidth: 0
//             }],
//             tooltip: {
//               backgroundColor: '#333',
//               style: { color: '#92F1F1', fontSize: '8px' },
//               formatter: function () {
//                 const point = ${JSON.stringify(data)}[this.point.index];
//                 return '<b>TimeStamp:</b> ' + point[2] + '<br><b>Power:</b> ' + this.y.toFixed(2) + ' kW';
//               },
//               useHTML: true
//             },
//             legend: {
//               itemStyle: { color: '#92F1F1', fontSize: '9px' }
//             },
//             credits: { enabled: false }
//           });
//         });
//       </script>
//     </body>
//   </html>
// `;

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#92F1F1" />
//         <Text style={styles.loadingText}>Loading data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Power Peak Per Hour</Text>
//         <TouchableOpacity
//           style={styles.dateButton}
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text style={styles.dateButtonText}>{formatDate(selectedDate)}</Text>
//         </TouchableOpacity>
//       </View>

//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={() => setShowDatePicker(false)}
//         date={selectedDate}
//       />

//       <View style={styles.chartContainer}>
//         {data.length > 0 ? (
//           <WebView
//             originWhitelist={["*"]}
//             source={{ html: chartHTML }}
//             style={styles.webview}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             scrollEnabled={false}
//           />
//         ) : (
//           <View style={styles.noDataContainer}>
//             <Text style={styles.noDataText}>
//               No data available for selected date
//             </Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     height: 350,
//     flex: 1,
//     backgroundColor: "#222",

//     padding: 8,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//   },
//   title: {
//     color: "#92F1F1",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   dateButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   dateButtonText: {
//     color: "#000",
//     fontSize: 12,
//   },
//   chartContainer: {
//     flex: 1,
//     backgroundColor: "#222",
//     borderRadius: 5,
//     overflow: "hidden",
//     borderWidth: 1,
//     // borderColor: "#444",
//     borderColor: "#92F1F1",
//   },
//   webview: {
//     backgroundColor: "#222",
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//   },
//   loadingText: {
//     color: "#fff",
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//     padding: 20,
//   },
//   errorText: {
//     color: "#ff5252",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noDataText: {
//     color: "#D7D7D7",
//     fontSize: 14,
//   },
// });

// export default MachinePeakPowerScreen;

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ActivityIndicator,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { useRoute } from "@react-navigation/native";
// import peakPowerImg from "../../../assets/chartImages/3515462.jpg"; // Use a peak power-related image

// const VOLTAGE = 220;

// const MachinePeakPowerScreen = () => {
//   const route = useRoute();
//   const { endPoint } = route.params || {};

//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(
//     Dimensions.get("window").width
//   );
//   const [screenHeight, setScreenHeight] = useState(
//     Dimensions.get("window").height
//   );

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
//   );

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${endPoint}`);
//       console.log(endPoint, "endPoint of peak power");
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const apiData = await response.json();
//       const processedData = processDataByHour(apiData, selectedDate);
//       setData([...processedData]);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (endPoint) {
//       fetchData();
//     }
//   }, [selectedDate, endPoint]);

//   const processDataByHour = (apiData, selectedDate) => {
//     const groupedData = {};
//     const selectedYear = selectedDate.getFullYear();
//     const selectedMonth = selectedDate.getMonth();
//     const selectedDay = selectedDate.getDate();

//     apiData.forEach((entry) => {
//       const entryDate = new Date(entry.timestamp);
//       if (
//         entryDate.getFullYear() === selectedYear &&
//         entryDate.getMonth() === selectedMonth &&
//         entryDate.getDate() === selectedDay
//       ) {
//         const hour = entryDate.getHours();
//         const power = ((entry.current * VOLTAGE) / 1000).toFixed(2);
//         if (!groupedData[hour] || power > groupedData[hour].power) {
//           groupedData[hour] = {
//             power: Number.parseFloat(power),
//             timestamp: entry.timestamp,
//           };
//         }
//       }
//     });

//     return Object.keys(groupedData).map((hour) => [
//       Date.UTC(selectedYear, selectedMonth, selectedDay, hour),
//       groupedData[hour].power,
//       groupedData[hour].timestamp,
//     ]);
//   };

//   const handleConfirm = (date) => {
//     setSelectedDate(date);
//     setShowDatePicker(false);
//   };

//   const isMobile = screenWidth < 768;
//   const formatDate = (date) =>
//     `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

//   const categories = data.map(([timestamp]) => {
//     const date = new Date(timestamp);
//     return `${date.getHours()}:00`;
//   });

//   const seriesData = data.map(([_, power]) => power);
//   const maxPower = data.length > 0 ? Math.max(...seriesData) : 0;
//   const maxPowerTimestamp =
//     data.find(([_, power]) => power === maxPower)?.[2] || "";

//   const chartHTML = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <script src="https://code.highcharts.com/highcharts.js"></script>
//         <style>
//           html, body { margin: 0; padding: 0; background-color: #222; height: 100%; }
//           #chart { height: 100%; width: 100%; }
//         </style>
//       </head>
//       <body>
//         <div id="chart"></div>
//         <script>
//           document.addEventListener("DOMContentLoaded", function () {
//             Highcharts.chart('chart', {
//               chart: { type: 'column', backgroundColor: '#222', height: ${chartHeight}, spacingTop: ${
//     isMobile ? 15 : 30
//   }, spacingBottom: ${isMobile ? 15 : 30} },
//               title: { text: 'Power Peak Per Hour', style: { color: '#92F1F1', fontSize: '${
//                 isMobile ? "14px" : "25px"
//               }' } },
//               xAxis: {
//                 categories: ${JSON.stringify(categories)},
//                 title: { text: 'Time', style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "10px" : "14px"
//                 }' } },
//                 labels: { style: { color: '#D7D7D7', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' }, rotation: ${isMobile ? -45 : 0}, align: 'right' },
//                 tickInterval: ${Math.ceil(categories.length / 10)},
//                 lineColor: '#92F1F1',
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
//               series: [{ name: 'Max Power', data: ${JSON.stringify(
//                 seriesData
//               )}, color: '#92F1F1', pointWidth: 5, borderRadius: 5, borderWidth: 0 }],
//               tooltip: {
//                 backgroundColor: '#333',
//                 style: { color: '#92F1F1', fontSize: '${
//                   isMobile ? "8px" : "12px"
//                 }' },
//                 formatter: function () {
//                   const point = ${JSON.stringify(data)}[this.point.index];
//                   return '<b>TimeStamp:</b> ' + point[2] + '<br><b>Power:</b> ' + this.y.toFixed(2) + ' kW';
//                 },
//                 useHTML: true
//               },
//               legend: { itemStyle: { color: '#92F1F1', fontSize: '${
//                 isMobile ? "9px" : "13px"
//               }' } },
//               credits: { enabled: false }
//             });
//           });
//         </script>
//       </body>
//     </html>
//   `;

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#92F1F1" />
//         <Text style={styles.loadingText}>Loading data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       style={styles.scrollView}
//       onLayout={(event) => {
//         console.log("ScrollView width:", event.nativeEvent.layout.width);
//       }}
//     >
//       <Text style={styles.currentText}>Power Peak Per Hour</Text>

//       <View
//         style={styles.imageContainer}
//         onLayout={(event) => {
//           console.log("Image container width:", event.nativeEvent.layout.width);
//         }}
//       >
//         <Image source={peakPowerImg} style={styles.image} resizeMode="cover" />
//       </View>

//       <View style={styles.header}>
//         <Text style={styles.title}>
//           Selected Date: {formatDate(selectedDate)}
//         </Text>
//         <TouchableOpacity
//           style={styles.dateButton}
//           onPress={() => setShowDatePicker(true)}
//         >
//           <Text style={styles.dateButtonText}>Change Date</Text>
//         </TouchableOpacity>
//       </View>

//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={() => setShowDatePicker(false)}
//         date={selectedDate}
//       />

//       <View style={[styles.chartWrapper, { height: chartHeight + 2 }]}>
//         <WebView
//           originWhitelist={["*"]}
//           source={{ html: chartHTML }}
//           style={{ flex: 1 }}
//           javaScriptEnabled={true}
//           domStorageEnabled={true}
//           scrollEnabled={false}
//         />
//       </View>

//       {maxPower > 0 && (
//         <View style={styles.maxValueBox}>
//           <View style={styles.maxValueContent}>
//             <Text style={[styles.maxText, isMobile && styles.maxTextMobile]}>
//               <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
//               <Text style={styles.maxValue}>{maxPower.toFixed(2)} kW </Text>
//             </Text>
//             <Text
//               style={[
//                 styles.maxValueTimestamp,
//                 isMobile && styles.maxValueTimestampMobile,
//               ]}
//             >
//               {maxPowerTimestamp}
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
//     minHeight: "100%",
//   },
//   scrollView: {
//     backgroundColor: "black",
//   },
//   imageContainer: {
//     width: "100%",
//     alignItems: "stretch",
//     justifyContent: "center",
//   },
//   image: {
//     width: "100%",
//     height: 250,
//     minWidth: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 1,
//     paddingHorizontal: 5,
//     marginTop: 20,
//   },
//   title: {
//     color: "#92F1F1",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   dateButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   dateButtonText: {
//     color: "#000",
//     fontSize: 12,
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
//     marginTop: 0,
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
//     fontSize: 35,
//     fontWeight: "bold",
//     marginBottom: 8,
//     marginTop: 10,
//     color: "white",
//     textAlign: "center",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//   },
//   loadingText: {
//     color: "#fff",
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#222",
//     padding: 20,
//   },
//   errorText: {
//     color: "#ff5252",
//     fontSize: 16,
//     textAlign: "center",
//   },
// });

// export default MachinePeakPowerScreen;

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import peakPowerImg from "../../../assets/chartImages/Rectangle 3.png";
import Icon from "react-native-vector-icons/FontAwesome"; // Use a peak power-related image

const VOLTAGE = 220;

const MachinePeakPowerScreen = () => {
  const route = useRoute();
  const { endPoint } = route.params || {};
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Start with null, will set to latest date later
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${endPoint}`);
      console.log(endPoint, "endPoint of peak power");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const apiData = await response.json();

      // Process data and set selectedDate to the latest date in the data
      const latestDate = getLatestDate(apiData);
      if (!selectedDate) {
        setSelectedDate(latestDate); // Set default date if not set
      }

      const processedData = processDataByHour(
        apiData,
        selectedDate || latestDate
      );
      setData([...processedData]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestDate = (apiData) => {
    const latestDate = apiData.reduce((latest, entry) => {
      const entryDate = new Date(entry.timestamp);
      return entryDate > latest ? entryDate : latest;
    }, new Date(0)); // Start with the oldest possible date
    return latestDate;
  };

  useEffect(() => {
    if (endPoint) {
      fetchData();
    }
  }, [selectedDate, endPoint]);

  const processDataByHour = (apiData, selectedDate) => {
    const groupedData = {};
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    apiData.forEach((entry) => {
      const entryDate = new Date(entry.timestamp);
      if (
        entryDate.getFullYear() === selectedYear &&
        entryDate.getMonth() === selectedMonth &&
        entryDate.getDate() === selectedDay
      ) {
        const hour = entryDate.getHours();
        const power = ((entry.current * VOLTAGE) / 1000).toFixed(2);
        if (!groupedData[hour] || power > groupedData[hour].power) {
          groupedData[hour] = {
            power: Number.parseFloat(power),
            timestamp: entry.timestamp,
          };
        }
      }
    });

    return Object.keys(groupedData).map((hour) => [
      Date.UTC(selectedYear, selectedMonth, selectedDay, hour),
      groupedData[hour].power,
      groupedData[hour].timestamp,
    ]);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const isMobile = screenWidth < 768;
  const formatDate = (date) =>
    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  const categories = data.map(([timestamp]) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:00`;
  });

  const seriesData = data.map(([_, power]) => power);
  const maxPower = data.length > 0 ? Math.max(...seriesData) : 0;
  const maxPowerTimestamp =
    data.find(([_, power]) => power === maxPower)?.[2] || "";

  const chartHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <style>
          html, body { margin: 0; padding: 0; background-color: #222; height: 100%; }
          #chart { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="chart"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            Highcharts.chart('chart', {
              chart: { type: 'column', backgroundColor: '#222', height: ${chartHeight}, spacingTop: ${
    isMobile ? 15 : 30
  }, spacingBottom: ${isMobile ? 15 : 30} },
              title: { text: 'Power Peak Per Hour', style: { color: '#92F1F1', fontSize: '${
                isMobile ? "17px" : "25px"
              }' } },
              xAxis: {
                categories: ${JSON.stringify(categories)},
                title: { text: 'Time', style: { color: '#D7D7D7', fontSize: '${
                  isMobile ? "10px" : "14px"
                }' } },
                labels: { style: { color: '#D7D7D7', fontSize: '${
                  isMobile ? "8px" : "12px"
                }' }, rotation: ${isMobile ? -45 : 0}, align: 'right' },
                tickInterval: ${Math.ceil(categories.length / 10)},
                lineColor: '#92F1F1',
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
              series: [{ name: 'Max Power', data: ${JSON.stringify(
                seriesData
              )}, color: '#92F1F1', pointWidth: 5, borderRadius: 5, borderWidth: 0 }],
              tooltip: {
                backgroundColor: '#333',
                style: { color: '#92F1F1', fontSize: '${
                  isMobile ? "8px" : "12px"
                }' },
                formatter: function () {
                  const point = ${JSON.stringify(data)}[this.point.index];
                  return '<b>TimeStamp:</b> ' + point[2] + '<br><b>Power:</b> ' + this.y.toFixed(2) + ' kW';
                },
                useHTML: true
              },
              legend: { itemStyle: { color: '#92F1F1', fontSize: '${
                isMobile ? "9px" : "13px"
              }' } },
              credits: { enabled: false }
            });
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-left" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.currentText}>Peak Power Per Hour</Text>
      <View style={styles.imageContainer}>
        <Image source={peakPowerImg} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>
          Selected Date:{" "}
          {selectedDate ? formatDate(selectedDate) : "Loading..."}
        </Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>Change Date</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setShowDatePicker(false)}
        date={selectedDate}
      />

      <View
        style={[
          styles.chartWrapper,
          { height: chartHeight + 2, backgroundColor: "#222" },
        ]}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#00ff00" />
            <Text style={{ color: "white", marginTop: 10 }}>
              Loading data...
            </Text>
          </View>
        ) : data.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              No data found for selected date.
            </Text>
          </View>
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{ html: chartHTML }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
          />
        )}
      </View>

      {maxPower > 0 && (
        <View style={styles.maxValueBox}>
          <View style={styles.maxValueContent}>
            <Text style={styles.maxText}>
              <Text style={styles.maxValueLabel}>⚡ Max Power: </Text>
              <Text style={styles.maxValue}>{maxPower.toFixed(2)} kW </Text>
            </Text>
            <Text style={styles.maxValueTimestamp}>{maxPowerTimestamp}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "stretch",
    backgroundColor: "#111",
    width: "100%",
    minHeight: "100%", // Ensure it takes full screen height
  },
  imageContainer: {
    width: "100%",
    alignItems: "stretch",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 270,
    minWidth: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginTop: 20,
  },
  title: {
    color: "#92F1F1",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dateButtonText: {
    color: "#000",
    fontSize: 12,
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
    padding: 15,
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
  maxValueTimestampMobile: {
    fontSize: 12,
  },
  currentText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 20,
    color: "#92F1F1",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 20,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1, // Ensure it stays above other content
  },
  backIcon: {
    fontSize: 25, // Adjust size as needed
    tintColor: "#92F1F1",
    color: "#92F1F1", // Match the theme color
  },
});

export default MachinePeakPowerScreen;
