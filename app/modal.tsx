import { useStore } from "effector-react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { IncomeExpenseForm, TransferForm } from "./forms";

import { $type, TransactionType } from "~/store/forms/transaction";

// TODO: move to a separate component
export default function Modal() {
  const type = useStore($type);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          {type === TransactionType.Transfer ? (
            <TransferForm />
          ) : (
            <IncomeExpenseForm />
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
