import { persist } from "@effector-storage/react-native-async-storage";
import { createEvent, createStore } from "effector";
import _ from "lodash";

export namespace Emoji {
  export enum Section {
    Accounts = "accounts",
    Categories = "categories",
  }

  export interface SetEmoji {
    path: string;
    emoji: string;
  }

  export type EmojiStore = {
    [section in Section]: {
      [key: string]: string;
    };
  };

  export const $emoji = createStore<EmojiStore>({
    accounts: {},
    categories: {},
  });

  persist({ key: "$appearance.emoji", store: $emoji });

  export const setEmoji = createEvent<SetEmoji>();

  $emoji.on(setEmoji, (previous, { path, emoji }) =>
    _.set(previous, path, emoji),
  );
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
