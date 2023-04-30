import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet, TextInput } from "react-native";

import { Text, View } from "../components/Themed";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function Modal() {
  const [choosenLabel, setChoosenLabel] = useState("Native");
  const [choosenIndex, setChoosenIndex] = useState(2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a transaction</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Text>govno</Text>
        <View style={styles.container}>
          {/*Picker with multiple chose to choose*/}
          {/*selectedValue to set the preselected value if any*/}
          {/*onValueChange will help to handle the changes*/}
          <Picker
            selectedValue={choosenLabel}
            onValueChange={(itemValue, itemIndex) => {
              setChoosenLabel(itemValue);
              setChoosenIndex(itemIndex);
            }}
          >
            <Picker.Item label="Hello" value="Hello" />
            <Picker.Item label="React" value="React" />
            <Picker.Item label="Native" value="Native" />
            <Picker.Item label="How" value="How" />
            <Picker.Item label="are" value="are" />
            <Picker.Item label="you" value="you" />
          </Picker>
          {/*Text to show selected picker value*/}
          <Text style={styles.text}>Selected Value: {choosenLabel}</Text>
          {/*Text to show selected index */}
          <Text style={styles.text}>Selected Index: {choosenIndex}</Text>
        </View>
      </SafeAreaView>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  title: {
    // fontSize: 20,
    // fontWeight: "bold",
  },
  separator: {
    // marginVertical: 20,
    // height: 1,
    // width: "80%",
  },
  text: {
    // fontSize: 20,
    // alignSelf: 'center',
  },
});
