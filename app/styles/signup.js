import { StyleSheet } from "react-native";

export default StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "900", // Bolder font weight
    marginBottom: 20,
    color: "#0f11a8",
    fontFamily: "Oswald",
    textShadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow position
    textShadowRadius: 4, // Blurriness of shadow
  },
  innerContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff", // Different background color
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    alignItems: "center",
  },
  subTitle: {
    color: "#0f11a8",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0f11a8",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1, // Border width for shadow effect
    borderColor: "rgba(0, 0, 0, 0.2)", // Light border for shadow effect
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 4,
    elevation: 5, // For Android shadow effect
  },
  button: {
    width: "100%",
    backgroundColor: "#ffc928",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  registerLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
