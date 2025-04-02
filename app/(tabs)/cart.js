import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverIP = "192.168.1.6";

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userData = await AsyncStorage.getItem("loggedInUser");
        if (!userData) {
          Alert.alert("Error", "You must be logged in to view your cart.");
          return;
        }

        const user = JSON.parse(userData);
        const response = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/carts?user_id=${user.id}`);
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setCartItems(data.data);
        } else {
          console.error("Invalid cart data format:", data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Alert.alert("Error", "Failed to fetch cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (itemId, action) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: action === "increase" ? item.quantity + 1 : item.quantity - 1,
            }
          : item
      )
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/${item.product_image || 'default.png'}` }}
        style={styles.productImage}
        onError={(e) => { e.target.src = `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/default.png`; }}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name || 'Product Name'}</Text>
        <Text style={styles.productDetails}>{item.product_details || 'No Details'}</Text>
        <Text style={styles.productStock}>Stock: {item.product_stock || 'No stock'}</Text>
        <Text style={styles.productPrice}>₱{item.product_price || '0.00'}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleQuantityChange(item.id, "decrease")}
          disabled={item.quantity <= 1}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity || 1}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleQuantityChange(item.id, "increase")}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderCartItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  emptyCartText: { fontSize: 18, textAlign: "center", color: "#777" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: { width: 80, height: 80, marginRight: 10, borderRadius: 5 },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productDetails: { fontSize: 14, color: "#555", marginBottom: 0, textAlign: "left" },
  productStock: { fontSize: 14, color: "#777", marginBottom: 0 },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    // paddingHorizontal: 10,
    // paddingVertical: 5,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 15,
    padding: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007bff",
  },
});
