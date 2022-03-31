import { Card, Col, Row, Typography, DatePicker } from "antd";
import { useState, useEffect } from "react";
import AddEntry from "../components/AddEntry";
import AppLayout from "../components/Layout";
import ListEntry from "../components/ListEntry";
const { Title } = Typography;

// https://www.envato.com/blog/color-scheme-trends-in-mobile-app-design/
// https://dribbble.com/shots/2950232-Time-Off-App-Concept/attachments/613156

export default function Home() {

  useEffect(()=>{
    document.title = "Family Expense : Log Entry"
  },[])

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
    tabEntryList: <ListEntry></ListEntry>,
  };

  return (
    <AppLayout page="home" title="Home">
      <Card size="small">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>
            <div>Income</div>
            <div>
              <Title level={4}>1000</Title>
            </div>
          </Col>
          <Col span={8}>
            <div>Expense</div>
            <div>
              <Title level={4}>1000</Title>
            </div>
          </Col>
          <Col span={8}>
            <div>Balance</div>
            <div>
              <Title level={4}>1000</Title>
            </div>
          </Col>
        </Row>
      </Card>

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
    </AppLayout>
  );
}