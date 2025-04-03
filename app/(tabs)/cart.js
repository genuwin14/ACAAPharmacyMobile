import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import styles from "../styles/cartStyles"; // ✅ Import the styles

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverIP = "172.16.238.123";
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
        const itemsWithQuantity = data.data.map((item) => ({
          ...item,
          quantity: item.quantity || 1, // Default to 1 if quantity is missing
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartItems();
    }, [])
  );

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

  const handleProductSelect = (productId) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all products
      setSelectedProductIds([]);
    } else {
      // Select all products
      setSelectedProductIds(cartItems.map((item) => item.cart_id)); // Use `cart_id` for selection
    }
    setSelectAll(!selectAll); // Toggle the `selectAll` state
  };

  const handleDeleteItem = async (cartId) => {
    if (!cartId) {
      console.error("Cart ID is undefined.");
      Alert.alert("Error", "Invalid cart item.");
      return;
    }
  
    try {
      const response = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/cart/delete/${cartId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Item removed from cart.");
        fetchCartItems(); // Refresh the cart content
      } else {
        Alert.alert("Error", data.message || "Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Could not remove item from cart.");
    }
  };
  
  const renderCartItem = ({ item }) => {
    return (
      <View style={styles.cartItem}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedProductIds.includes(item.cart_id) && styles.radioButtonSelected,
          ]}
          onPress={() => handleProductSelect(item.cart_id)}
        >
          {selectedProductIds.includes(item.cart_id) && <View style={styles.radioButtonInner} />}
        </TouchableOpacity>
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
            onPress={() => handleDecreaseQuantity(item.cart_id)}
            disabled={item.quantity <= 1}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleIncreaseQuantity(item.cart_id)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.trashIconContainer}
          onPress={() => handleDeleteItem(item.cart_id)}
        >
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/1214/1214428.png" }}
            style={styles.trashIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

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