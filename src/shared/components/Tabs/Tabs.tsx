import React from "react";
import { View, StyleSheet } from "react-native";

import Tab from "./Tab";

export interface Page {
  title: string;
  content: React.ReactNode;
}

interface Props {
  activeTab: number;
  pages: Page[];
  select: (index: number) => void;
}

const Tabs: React.FC<Props> = ({ activeTab, pages, select }) => {
  return (
    <View style={styles.root}>
      <View style={styles.tabs}>
        {pages.map((page, index) => (
          <Tab
            isActive={activeTab === index}
            title={page.title}
            Content={page.content}
            onPress={() => select(index)}
          />
        ))}
      </View>
      <View style={styles.content}>{pages[activeTab].content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderBottomColor: "#f2f4f8",
    borderBottomWidth: 1,
  },
  root: {
    width: "100%",
    alignItems: "center",
  },
  content: {
    padding: 12,
  },
});

export default Tabs;
