import { useNavigation } from "@react-navigation/native";
import { useStore, useStoreMap } from "effector-react";

import Views from "./views";

import { Screens } from "~/app/navigation";
import { accounts, appearance } from "~/entities";
import { Account } from "~/entities/types";

// TODO: FSD
const AccountsWidget: React.FC = () => {
  const _view = useStore(appearance.Accounts.$view);
  const _accounts = useStore(accounts.$accounts);
  const _balances = useStore(accounts.$balances);
  const _emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ accounts }) => accounts,
  );

  const { navigate } = useNavigation();

  const create = () => navigate(Screens.AccountsCreate as never); // TODO: Types
  const edit = (account: Account) =>
    navigate(...([Screens.AccountsEdit, { id: account.id }] as never));

  const props = {
    accounts: _accounts,
    balances: _balances,
    emoji: _emoji,
    create,
    edit,
  };

  switch (_view) {
    case appearance.Accounts.View.Card:
      return <Views.Card {...props} />;
  }
};

export default AccountsWidget;
