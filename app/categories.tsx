import { View } from "react-native";
import _ from "lodash";
import { $categories } from "../store";
import Select from "../components/Select";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreMap } from "effector-react";
import { useEffect } from "react";

const Categories: React.FC = () => {
  const route = useRoute();
  const categories = useStoreMap($categories, (categories) => {
    if (route.name) {
      const result = _.get(categories, route.name.replaceAll("/", ".").replace("categories.", ""));
      return result ?? categories;
    }

    return categories;
  });
  const navigation = useNavigation();

  return (
    <View>
      {Object.keys(categories).map((c) => (
        <Select
          title={c}
          onPress={() => navigation.navigate(`${route.name}/${c}` as never)}
          emoji={"👀"}
        />
      ))}
    </View>
  );
};

export default Categories;
