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
}

const themes: Record<"light" | "dark", Theme> = {
  light: {
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
  },
};

export default themes;
