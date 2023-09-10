import { Platform } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    surface: string;
    background: string;
    typography: {
      primary: string;
      secondary: string;
      inverted: string;
    };
  };
  borderRadius: number;
  layout: {
    plates: number;
  };
}

// TODO: make dynamic
const themes: Record<"light" | "dark", Theme> = {
  light: {
    colors: {
      primary: "#5a56cf",
      surface: "#F0F0F6",
      background: "#FFFFFF",
      typography: {
        primary: "#0F1323",
        secondary: "#C1C1D6",
        inverted: "white",
      },
    },
    borderRadius: 10,
    layout: {
      plates: Platform.OS === "web" ? 4 : 2,
    },
  },
  dark: {
    // TODO
    colors: {
      primary: "#6E85E3",
      surface: "#F0F0F6",
      background: "#FFFFFF",
      typography: {
        primary: "#0F1323",
        secondary: "#C1C1D6",
        inverted: "white",
      },
    },
    borderRadius: 10,
    layout: {
      plates: Platform.OS === "web" ? 4 : 2,
    },
  },
};

export default themes;
