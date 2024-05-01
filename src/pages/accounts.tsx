import { useNavigation } from "@react-navigation/native";
import { useStoreMap } from "effector-react";
import { View } from "react-native";

import { Screens } from "../app/navigation";
import { accounts } from "../entities";

import Select from "~/components/Select";
import { incomeExpenseForm } from "~/entities/forms/transaction";
import { Account } from "~/entities/types";

interface Props {
  onChange: (account: Account) => void;
}

const Accounts: React.FC<Props> = ({
  onChange = incomeExpenseForm.selectAccount,
}) => {
  const navigation = useNavigation();
  const _accounts = useStoreMap(accounts.$accounts, (accounts) =>
    Object.values(accounts),
  );

  const onPress = (account: Account) => {
    onChange(account);
    navigation.navigate(Screens.TransactionsCreate as never);
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
