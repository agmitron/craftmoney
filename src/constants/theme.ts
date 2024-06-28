export interface Theme {
  spacing: number;
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
    plates: {
      perPage: number;
      width: number | string;
      height: number | string;
      rows: number;
    };
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
    borderRadius: 15,
    layout: {
      plates: {
        perPage: 4,
        width: "49%",
        height: 100,
        rows: 2,
      },
    },
    spacing: 12,
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
      plates: {
        perPage: 4,
        width: "49%",
        height: 100,
        rows: 2,
      },
    },
    spacing: 12,
  },
};

export default themes;
