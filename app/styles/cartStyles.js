import { StyleSheet } from "react-native";

const cartStyles = StyleSheet.create({
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
});

export default cartStyles;