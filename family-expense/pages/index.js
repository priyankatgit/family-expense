import { Card } from "antd";
import moment from "moment";
import { useState } from "react";
import AddEntry from "../components/AddEntry";
import BalanceCount from "../components/BalanceCount";
// import ExpenseChart from "../components/ExpenseChart";
import ExpenseChartNew from "../components/ExpenseChartNew";
import AppLayout from "../components/Layout";
import ListEntry from "../components/ListEntry";

// https://www.envato.com/blog/color-scheme-trends-in-mobile-app-design/
// https://dribbble.com/shots/2950232-Time-Off-App-Concept/attachments/613156

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const handleChangeMonth = (value) => {
    setSelectedMonth(value);
  };

  const tabList = [
    {
      key: "tabEntry",
      tab: "Register Entry",
    },
    {
      key: "tabEntryList",
      tab: "Entries",
    },
  ];

  const [activeTabKey, setActiveTabKey] = useState("tabEntry");
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  const tabContentList = {
    tabEntry: <AddEntry></AddEntry>,
    tabEntryList: <ListEntry selectedMonth={selectedMonth}></ListEntry>,
  };

  return (
    <AppLayout page="home" title="Home" onChangeMonth={handleChangeMonth}>
      <BalanceCount selectedMonth={selectedMonth}></BalanceCount>

      <Card
        style={{ marginTop: 10 }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
        {tabContentList[activeTabKey]}
      </Card>

      {/* <ExpenseChart
        selectedMonth={selectedMonth}
        style={{ marginTop: 10 }}
      ></ExpenseChart> */}
      <ExpenseChartNew
        selectedMonth={selectedMonth}
        style={{ marginTop: 10 }}
      ></ExpenseChartNew>
    </AppLayout>
  );
}