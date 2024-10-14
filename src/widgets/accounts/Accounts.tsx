import Views from "./views";

import { Account } from "~/entities/account";

const fakeAccount: Account = {
  balance: 1000,
  currency: "USD",
  id: "1",
  name: "Main account",
  operations: [],
  addOperation: () => {
    console.log("Transact");
  },
};

interface Props {
  accounts?: Account[];
}

const Accounts: React.FC<Props> = ({ accounts = [fakeAccount] }) => {
  return <Views.Card accounts={accounts} />;
};

export default Accounts;
