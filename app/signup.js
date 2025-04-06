import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles/signup"; // Import external styles

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !username || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.1.6/Pharmacy/ACAAPharmacy/api/users/add", {
      // const response = await fetch("http://172.16.238.123/Pharmacy/ACAAPharmacy/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/login");
      } else {
        Alert.alert("Error", result.message || "Failed to create account.");
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
        <Text style={styles.subTitle}>SIGN UP</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

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

        {/* Sign Up button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing Up..." : "SIGN UP"}</Text>
        </TouchableOpacity>

        {/* Navigate back to Login */}
        <Text style={styles.registerText}>
          Already have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.registerLink}>Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}
