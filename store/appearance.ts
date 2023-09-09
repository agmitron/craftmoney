import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";

export namespace Emoji {
  export enum Section {
    Accounts = "accounts",
    Categories = "categories",
  }

  export type Emoji = {
    [section in Section]: {
      [key: string]: string;
    };
  };

  export const $emoji = createStore<Emoji>({
    accounts: {},
    categories: {},
  });
  persist({ key: "$appearance.emoji", store: $emoji });
}

export namespace Accounts {
  export enum View {
    List,
    Plates,
    Card,
  }

  export const $view = createStore<View>(View.Plates);
  persist({ key: "$appearance.accounts.view", store: $view });

  export const setView = createEvent<View>();
  $view.on(setView, (_, v) => v);
}
