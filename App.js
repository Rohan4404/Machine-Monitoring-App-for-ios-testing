import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import SplashScreen from "./src/screens/SplashScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import SignupScreen from "./src/screens/SignupScreen";
import Toast from "react-native-toast-message";
import AddCardScreen from "./src/screens/AddCardScreen";
import DeleteCardScreen from "./src/screens/DeleteCardScreen";
import MachineDataScreen from "./src/screens/MachineDataScreen";
import MachineCurrentScreen from "./src/screens/MachineDataInfo/MachineCurrentScreen";
import MachinePowerScreen from "./src/screens/MachineDataInfo/MachinePowerScreen";
import MachinePeakPowerScreen from "./src/screens/MachineDataInfo/MachinePeakPowerScreen";
import MachineUnitScreen from "./src/screens/MachineDataInfo/MachineUnitScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCard"
          component={AddCardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeleteCard"
          component={DeleteCardScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MachineDataCard"
          component={MachineDataScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="currentConsumption"
          component={MachineCurrentScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="powerConsumptions"
          component={MachinePowerScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="peakpowerconsumption"
          component={MachinePeakPowerScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="unitconsumption"
          component={MachineUnitScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

      <Toast />
    </NavigationContainer>
  );
}
