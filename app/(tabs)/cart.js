import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can change FontAwesome to another icon set like MaterialIcons, Ionicons, etc.
import styles from "../styles/cartStyles"; // ✅ Import the styles

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const serverIP = "192.168.1.6";
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("cart"); // State to manage the current screen
  const [toReceiveItems, setToReceiveItems] = useState([]); // State for "To Receive" items
  const [loadingToReceive, setLoadingToReceive] = useState(false); // Loading state for "To Receive"

  const fetchCartItems = async () => {
    try {
      const userData = await AsyncStorage.getItem("loggedInUser");
      if (!userData) {
        Alert.alert("Error", "You must be logged in to view your cart.");
        return;
      }
  
      const user = JSON.parse(userData);
  
      // 🟡 Step 1: Fetch cart items
      const response = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/carts?user_id=${user.id}`);
      const data = await response.json();
  
      if (Array.isArray(data.data)) {
        // Filter out items with status "To receive"
        const availableItems = data.data.filter(item => item.status !== "To receive"); // Exclude items with status "To receive"
        
        // Add quantity and update cart items
        const itemsWithQuantity = availableItems.map((item) => ({
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

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
  
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
  
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
  
    return `${formattedDate} at ${formattedTime}`;
  };
  
  const fetchToReceiveItems = async () => {
    setLoadingToReceive(true);
    try {
      const userData = await AsyncStorage.getItem("loggedInUser");
      if (!userData) {
        Alert.alert("Error", "You must be logged in to view your orders.");
        return;
      }
  
      const user = JSON.parse(userData);
  
      // Fetch checkout items for the logged-in user
      const checkoutResponse = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/checkouts?user_id=${user.id}`);
      const checkoutData = await checkoutResponse.json();
  
      if (Array.isArray(checkoutData.data)) {
        const mergedItems = await Promise.all(
          checkoutData.data
            .filter((checkoutItem) => checkoutItem.user_id === user.id) // Only get the logged-in user's items
            .map(async (checkoutItem) => {
              // Fetch the detailed cart item based on cart_id
              const cartResponse = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/cart/${checkoutItem.cart_id}`);
              const cartData = await cartResponse.json();
  
              if (cartData.data) {
                const cartItem = cartData.data;
  
                // Fetch the product details using inventory_id from products API
                const productResponse = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/products`);
                const productData = await productResponse.json();
  
                // Find the product matching inventory_id
                const product = productData.data.find((p) => p.id === cartItem.inventory_id);
  
                return {
                  ...checkoutItem,
                  product_name: product?.name || "Unknown Product",
                  product_price: product?.price || "0.00",
                  product_details: product?.details || "No details available",
                  quantity: cartItem?.quantity || 1,
                  product_image: product?.image || "default.png",
                  pickup_date: formatDateTime(checkoutItem.pickup_date),
                  datetime_received: formatDateTime(checkoutItem.datetime_received),
                };                
              } else {
                console.error(`Cart data not found for cart_id: ${checkoutItem.cart_id}`);
                return null;
              }
            })
        );
  
        // Filter out any null values in case cart data wasn't found
        const validItems = mergedItems.filter(item => item !== null);
  
        // Group items by status + total_amount
        const groupedMap = {};
        validItems.forEach((item) => {
          const key = `${item.status}_${item.total_amount}`;
          if (!groupedMap[key]) {
            groupedMap[key] = {
              status: item.status,
              pickup_date: item.pickup_date,
              datetime_received: item.datetime_received,
              total_amount: item.total_amount,
              items: [],
            };
          }
          groupedMap[key].items.push(item);
        });
  
        const groupedArray = Object.values(groupedMap);
        setToReceiveItems(groupedArray);
      } else {
        console.error("Invalid checkout data format");
      }
    } catch (error) {
      console.error("Error fetching to receive items:", error);
      Alert.alert("Error", "Failed to fetch items to receive.");
    } finally {
      setLoadingToReceive(false);
    }
  };    

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartItems();
    }, [])
  );

  const handleIncreaseQuantity = async (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.cart_id === itemId) {
        const updatedQuantity = Number(item.quantity) + 1; // Ensure it's treated as a number
        updateCartQuantity(item.cart_id, updatedQuantity); // Call API to update
        return { ...item, quantity: updatedQuantity }; // Update the state with the new quantity
      }
      return item;
    });
    setCartItems(updatedItems); // Re-render with updated items
  };
  
  const handleDecreaseQuantity = async (itemId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.cart_id === itemId) {
        const updatedQuantity = Math.max(1, Number(item.quantity) - 1); // Ensure it's treated as a number
        updateCartQuantity(item.cart_id, updatedQuantity); // Call API to update
        return { ...item, quantity: updatedQuantity }; // Update the state with the new quantity
      }
      return item;
    });
    setCartItems(updatedItems); // Re-render with updated items
  };    
  
  const updateCartQuantity = async (cartId, quantity) => {
    try {
      const response = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/cart/edit/${cartId}`, {
        method: 'PUT', // Use PUT for update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }), // Send the updated quantity value
      });
  
      const data = await response.json();
      if (data.success) {
        console.log('Cart updated successfully');
      } else {
        console.error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
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

  const handleNavigateToReceivePage = () => {
    setCurrentScreen("toReceive"); // Switch to the "To Receive" screen
    fetchToReceiveItems(); // Fetch "To Receive" items
  };

  const handleBackToCart = () => {
    setCurrentScreen("cart"); // Switch back to the cart screen
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

  const renderToReceiveItem = ({ item }) => (
    <View style={styles.cartItemGroup}>
      {item.items.map((product, index) => (
        <View key={index} style={styles.cartItemData}>
          <View style={styles.productInfoData}>
            <Image
              source={{ uri: `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/${product.product_image || 'default.png'}` }}
              style={styles.productImage}
              onError={(e) => {
                e.target.src = `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/default.png`;
              }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.nameData}>{product.product_name}</Text>
              <Text style={styles.productData}>{product.product_details}</Text>
              <Text style={styles.productPrice}>₱{product.product_price}</Text>
              <Text style={styles.productData}>Qty: {product.quantity}</Text>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.statusAndTotal}>
        <Text style={styles.status}>
          Status: <Text style={item.status === 'Pending' ? styles.statusPending : styles.statusReceived}>
            {item.status}
          </Text>
        </Text>

        <Text style={styles.Data}>
          Pickup Date: <Text style={styles.subData}>{item.pickup_date}</Text>
        </Text>

        <Text style={styles.Data}>
          Received: <Text style={styles.subData}>{item.datetime_received}</Text>
        </Text>

        <Text style={styles.Data}>
          Total: <Text style={styles.productPrice}>₱{item.total_amount}</Text>
        </Text>
      </View>
    </View>
  ); 

  if (currentScreen === "toReceive") {
    // Render the "To Receive" screen
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleBackToCart} style={styles.backButton}>
          <Text><Icon name="arrow-left" size={25} color="#000" /> Back</Text>
          <View style={styles.hrLine} />
        </TouchableOpacity>
        <View style={styles.statusHeader}>
          <FontAwesome5 name="truck" size={20} color="#333" style={styles.icon} />
          <Text style={styles.receivingTextScreen}>Ordered Item Status</Text>
        </View>
        {loadingToReceive ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : toReceiveItems.length === 0 ? (
          <Text style={styles.emptyCartText}>No items to receive.</Text>
        ) : (
          <FlatList
            data={toReceiveItems}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={renderToReceiveItem}
          />
        )}
      </View>
    );
  }

  const handleCheckout = async () => {
    try {
      const userData = await AsyncStorage.getItem("loggedInUser");
      if (!userData) {
        Alert.alert("Error", "You must be logged in to checkout.");
        return;
      }
  
      const user = JSON.parse(userData);
  
      // Get selected cart items
      const selectedItems = cartItems.filter(item =>
        selectedProductIds.includes(item.cart_id)
      );
  
      if (selectedItems.length === 0) {
        Alert.alert("Error", "Please select at least one item to checkout.");
        return;
      }
  
      const totalAmount = selectedItems
        .reduce((total, item) => total + item.quantity * item.product_price, 0)
        .toFixed(2);
  
      // ✅ Send cart_id as array (not joined string)
      const checkoutData = {
        cart_id: selectedItems.map(item => item.cart_id),
        user_id: user.id,
        status: "Pending",
        pickup_date: null, // You can change this
        datetime_received: null,
        total_amount: totalAmount,
      };
  
      console.log("Sending checkout payload:", checkoutData); // ✅ DEBUG LOG
  
      const response = await fetch(
        `http://${serverIP}/Pharmacy/ACAAPharmacy/api/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutData),
        }
      );
  
      const data = await response.json();
      console.log("API Response:", data); // ✅ DEBUG LOG
  
      if (response.ok && data.message?.includes("Checkout")) {
        Alert.alert("Success", "Checkout successful.");
  
        // 🟡 Step 1: Update the status of checked-out items to "To receive"
        await updateCartItemsStatus(selectedItems.map(item => item.cart_id));
  
        // 🟡 Step 2: Clear the cart and reset selected items
        setCartItems([]);
        setSelectedProductIds([]);
      } else {
        console.error("Failed to complete checkout:", data);
        Alert.alert("Error", "Failed to complete checkout. Check logs for details.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert("Error", "Something went wrong during checkout. Check logs for more info.");
    }
  };
  
  // Function to update the status of cart items to "To receive"
  const updateCartItemsStatus = async (cartIds) => {
    try {
      const response = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/cart/updateStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart_ids: cartIds, // Array of cart IDs to update
          status: "To receive", // New status
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Cart items updated to 'To receive'.");
      } else {
        console.error("Failed to update cart items status:", data);
      }
    } catch (error) {
      console.error("Error updating cart items status:", error);
    }
  };   

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconContainer} onPress={handleNavigateToReceivePage}>
        <Icon name="car" size={25} color="#000" marginLeft="12" />
        <Text style={styles.receivingText}>To Receive</Text>
        <View style={styles.hrLine} />
      </TouchableOpacity>

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
                {cartItems
                  .filter((item) => selectedProductIds.includes(item.cart_id)) // Filter selected items
                  .reduce((total, item) => total + item.quantity * item.product_price, 0)
                  .toFixed(2)}
              </Text>
              <Text style={styles.separator}>  </Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
  
}