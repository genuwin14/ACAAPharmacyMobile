import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage
import styles from "./styles/login"; // Import external styles

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      // const response = await fetch("http://192.168.1.6/Pharmacy/ACAAPharmacy/api/users");
      const response = await fetch("http://172.16.238.123/Pharmacy/ACAAPharmacy/api/users");
      const users = await response.json();

      if (!Array.isArray(users)) {
        throw new Error("Invalid API response");
      }

      const user = users.find((u) => u.username === username && u.password === password);

      if (user) {
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(user)); // ✅ Save user data
        Alert.alert("Success", "Login successful!");
        router.replace("/profile"); // ✅ Redirect to profile page
      } else {
        Alert.alert("Error", "Invalid username or password.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>ACAA</Text>

      <View style={styles.innerContainer}>
        <Text style={styles.subTitle}>LOGIN</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Logging in..." : "LOGIN"}</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

