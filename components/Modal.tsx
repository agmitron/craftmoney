import { View } from "react-native";
import Typography from './Typography';
import { useTheme } from './Themed';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 18,
      }}
    >
      <Typography color="#0F1323" align="center">
        Add operation
      </Typography>
    </View>
  );
};
