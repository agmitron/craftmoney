import { Text, View } from "react-native";
import Card from "../components/Card";
import _ from "lodash";
import { $categories } from "../store";
import Select from "../components/Select";
import { useNavigation } from "@react-navigation/native";
import { useStore } from 'effector-react';

const Categories: React.FC = () => {
  const categories = useStore($categories);
  const navigation = useNavigation();

  return (
    <View>
      {/* {Object.keys(categories).map((c) => (
        <Select title={c} onPress={() => navigation.navigate(c as never)} />
      ))} */}
    </View>
  );
};

export default Categories;
