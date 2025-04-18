import { StyleSheet } from "react-native";

const cartStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  iconContainer: {
    alignItems: 'left',
    marginBottom: 20, // Space between the icon and the FlatList
  },
  receivingText: {
    fontSize: 12, // Adjust the size of the text
    color: "#000", // Color of the text
    marginTop: 2,  // Space between the icon and the text
    fontWeight: "bold", // Bold text for emphasis
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  icon: {
    marginRight: 8,
  },
  receivingTextScreen: {
    fontSize: 24, // Adjust the size of the text
    color: "#000", // Color of the text
    marginTop: 2,  // Space between the icon and the text
    fontWeight: "bold", // Bold text for emphasis
  },
  hrLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
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
  productPrice: { fontSize: 16, color: "#007bff" },
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
  trashIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: "#ff0000", // Red color for the trash icon
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  // separator: {
  //   marginHorizontal: 10,
  //   fontSize: 18,
  //   color: "#000",
  // },
  checkoutButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cartItemGroup: {
    marginVertical: 10,
    padding: 10,
    margin: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    elevation: 2,
  },
  statusAndTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 10,
    paddingTop: 5,
    flexDirection: 'column', // Changed to column to display each item in a new line
    justifyContent: 'flex-start', // Ensures items are aligned vertically at the start
    paddingLeft: 10, // Optional: Add padding for better spacing
    paddingRight: 10, // Optional: Add padding for better spacing
  },

  cartItemData: {
    marginBottom: 10,
  },
  
  productInfoData: {
    flexDirection: 'row-reverse', // Places image on the right and text on the left
    alignItems: 'center',
    gap: 10,
  },
  
  productImageData: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 10,
  },
  
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
  },
  
  nameData: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  
  productData: {
    color: '#000',
    marginBottom: 2,
  },

  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  statusPending: {
    color: 'red',
    fontWeight: 'bold',
  },
  
  statusReceived: {
    color: 'green',
    fontWeight: 'bold',
  },

  Data: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  subData: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'normal',
  },
  
});

export default cartStyles;
