import React from "react";
import { View } from "react-native";

import Tab from "./Tab";

interface Props {
  activeTabIndex: number;
  pages: React.ReactNode[];
}

const Tabs: React.FC<Props> = ({ activeTabIndex, pages }) => {
  return (
    <View>
      <View>
        <Tab isActive={activeTabIndex === 0} title="Tab 0" Content={pages[0]} />
        <Tab isActive={activeTabIndex === 1} title="Tab 1" Content={pages[1]} />
        <Tab isActive={activeTabIndex === 2} title="Tab 2" Content={pages[2]} />
      </View>
    </View>
  );
};

export default Tabs;
