import { useStore, useStoreMap } from "effector-react";

import Views from "./views";

import { accounts, appearance } from "~/entities";

const AccountsWidget: React.FC = () => {
  const _view = useStore(appearance.Accounts.$view);
  const _accounts = useStore(accounts.$accounts);
  const _balances = useStore(accounts.$balances);
  const _emoji = useStoreMap(
    appearance.Emoji.$emoji,
    ({ accounts }) => accounts,
  );

  const create = () => {};
  const edit = () => {};

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
