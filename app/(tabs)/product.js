import { useEffect, useState } from "react";
import { 
  View, Text, FlatList, StyleSheet, ActivityIndicator, 
  Image, TouchableOpacity, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Import AsyncStorage

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null); // ✅ Store logged-in user ID
  const serverIP = "192.168.1.6";
  // const serverIP = "172.16.238.123";

  useEffect(() => {
    const getUserID = async () => {
      try {
        const userData = await AsyncStorage.getItem("loggedInUser");
        if (userData) {
          const user = JSON.parse(userData);
          console.log("Logged-in User ID:", user.id); // Debugging log
          setUserID(user.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
  
    getUserID();

    fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const addToCart = async (inventory_id) => {
    try {
        if (!userID) {
            Alert.alert("Error", "You must be logged in to add items to the cart.");
            return;
        }

        const cartItem = {
            user_id: userID,
            inventory_id: inventory_id
        };

        console.log("Cart Item Payload:", JSON.stringify(cartItem));

        const response = await fetch(`http://${serverIP}/Pharmacy/ACAAPharmacy/api/cart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // ✅ Ensure JSON content type
                "Accept": "application/json"
            },
            body: JSON.stringify(cartItem) // ✅ Convert to JSON string
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok && data.success) {
            Alert.alert("Success", data.message || "Product added to cart successfully.");
        } else {
            Alert.alert("Error", data.message || "Failed to add to cart.");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        Alert.alert("Error", "Could not add product to cart.");
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/${item.image}` }}
        style={styles.productImage}
        onError={(e) => { e.target.src = `http://${serverIP}/Pharmacy/ACAAPharmacy/uploads/default.png`; }}
      />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDetails}>{item.details}</Text>
      <Text style={styles.productCategory}>Category: {item.category}</Text>
      <Text style={styles.productStock}>Stock: {item.stock}</Text>
      <Text style={styles.productPrice}>₱{item.price}</Text>
      <TouchableOpacity 
        style={styles.cartIconContainer} 
        onPress={() => addToCart(item.id)} // Pass the product ID
      >
        <Image 
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png" }} 
          style={styles.cartIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  row: { justifyContent: "space-between" },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "flex-start",
    position: "relative",
  },
  productImage: { width: 130, height: 100, marginBottom: 10, borderRadius: 5, alignSelf: "center" },
  productName: { fontSize: 16, fontWeight: "bold", marginBottom: 0, textAlign: "left" },
  productDetails: { fontSize: 14, color: "#555", marginBottom: 0, textAlign: "left" },
  productCategory: { fontSize: 14, color: "#777", marginBottom: 0 },
  productStock: { fontSize: 14, color: "#777", marginBottom: 0 },
  productPrice: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
  cartIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  cartIcon: { width: 20, height: 20 },
});
