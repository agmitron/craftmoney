import { View } from "react-native";
import _ from "lodash";
import { categories } from "../store";
import Select from "~/components/Select";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreMap } from "effector-react";
import { selectCategory } from "~/store/form";
import { Screens } from './_layout';

const Categories: React.FC = () => {
  const route = useRoute();;

  const _categories = useStoreMap(categories.$categories, (categories) => {
    if (route.name) {
      if (route.name === "categories") {
        return categories;
      }

      const path = route.name.replaceAll("/", ".").replace("categories.", "");

      const result = _.get(categories, path);

      return result ?? {};
    }

    return categories;
  });

  const onPress = (category: string) => {
    const nested = _categories[category];

    if (nested !== null) {
      return navigation.navigate(`${route.name}/${category}` as never);
    }

    selectCategory(category);
    return navigation.navigate(Screens.Modal as never)
  };

  const navigation = useNavigation();

  return (
    <View>
      {Object.keys(_categories).map((c) => (
        <Select key={c} title={c} onPress={() => onPress(c)} emoji={"👀"} />
      ))}
    </View>
  );
};

export default Categories;
