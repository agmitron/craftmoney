import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";
import { View } from "react-native";

import { Screens } from "./_layout";
import { accounts } from "../store";

import Select from "~/components/Select";
import {
  $type,
  TransactionType,
  incomeExpenseForm,
  transferForm,
} from "~/store/form";
import { Account } from "~/store/types";

interface Props {
  onChange: (account: Account) => void;
}

const Accounts: React.FC<Props> = ({
  onChange = incomeExpenseForm.selectAccount,
}) => {
  const navigation = useNavigation();
  const _accounts = useStoreMap(accounts.$accounts, (accounts) =>
    Object.values(accounts)
  );

  const onPress = (account: Account) => {
    onChange(account);
    navigation.navigate(Screens.Modal as never);
  };

  return (
    <View>
      {Object.values(_accounts).map((account) => (
        <Select
          key={account.id}
          title={account.name}
          onPress={() => onPress(account)}
          emoji="👀"
        />
      ))}
    </View>
  );
};

export default Accounts;
