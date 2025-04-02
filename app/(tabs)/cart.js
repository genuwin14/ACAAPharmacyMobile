import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverIP = "192.168.1.6";
  const [selectedProductIds, setSelectedProductIds] = useState([]); // Track selected product IDs
  const [selectAll, setSelectAll] = useState(false); // Track "All" button state

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
          // Ensure each item has a valid quantity
          const itemsWithQuantity = data.data.map((item) => ({
            ...item,
            quantity: item.quantity || 1, // Default to 1 if quantity is missing or invalid
          }));
          setCartItems(itemsWithQuantity);
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

  // Function to handle quantity increase for a specific product
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  // Function to handle quantity decrease for a specific product
  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        }
        return item;
      })
    );
  };

  // Function to handle product selection
  const handleProductSelect = (productId) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        // Deselect the product
        return prevSelected.filter((id) => id !== productId);
      } else {
        // Select the product
        return [...prevSelected, productId];
      }
    });
  };

  // Function to handle "Select All" toggle
  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all products
      setSelectedProductIds([]);
    } else {
      // Select all products
      setSelectedProductIds(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Function to add a product to the cart
  const addProductToCart = (newProduct) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === newProduct.id);
      if (existingProduct) {
        // If the product already exists, update its quantity
        return prevItems.map((item) =>
          item.id === newProduct.id
            ? { ...item, quantity: item.quantity + newProduct.quantity }
            : item
        );
      } else {
        // If the product doesn't exist, add it to the cart
        return [...prevItems, newProduct];
      }
    });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Radio Button for Selecting Product */}
      <TouchableOpacity
        style={[
          styles.radioButton,
          selectedProductIds.includes(item.id) && styles.radioButtonSelected,
        ]}
        onPress={() => handleProductSelect(item.id)}
      >
        {selectedProductIds.includes(item.id) && <View style={styles.radioButtonInner} />}
      </TouchableOpacity>

      {/* Product Image */}
      <Image
        source={{ uri: `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/${item.product_image || 'default.png'}` }}
        style={styles.productImage}
        onError={(e) => { e.target.src = `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/default.png`; }}
      />

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name || 'Product Name'}</Text>
        <Text style={styles.productDetails}>{item.product_details || 'No Details'}</Text>
        <Text style={styles.productStock}>Stock: {item.product_stock || 'No stock'}</Text>
        <Text style={styles.productPrice}>₱{item.product_price || '0.00'}</Text>
      </View>

      {/* Quantity Controls */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDecreaseQuantity(item.id)}
          disabled={item.quantity <= 1}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleIncreaseQuantity(item.id)}
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
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={renderCartItem}
          />
          {/* Rectangle box at the bottom */}
          <View style={styles.bottomContainer}>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity
                style={[styles.radioButton, selectAll && styles.radioButtonSelected]}
                onPress={handleSelectAll}
              >
                {selectAll && <View style={styles.radioButtonInner} />}
              </TouchableOpacity>
              <Text style={styles.radioText}>All</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total: ₱
                {cartItems.reduce((total, item) => total + item.quantity * item.product_price, 0).toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
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
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 15,
    padding: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffc928",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 10,
    marginBottom: 65, // Adjust for the tab bar
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    marginRight: 5,
  },
  radioText: {
    fontSize: 16,
    color: "#000",
  },
  radioButtonSelected: {
    borderColor: "#007bff",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
});
