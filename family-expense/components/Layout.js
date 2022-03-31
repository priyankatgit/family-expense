import {
  BarChartOutlined,
  GroupOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Avatar, DatePicker, Drawer, Layout, Menu, PageHeader } from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const { Content } = Layout;
const AppLayout = (props) => {
  const { data: session } = useSession();
  const user = session?.user || {};
  let { title } = props;

  let [leftDrawerVisible, setLeftDrawerVisible] = useState(false);

  let onNavigationClick = null;
  const navigationIcon = () => {
    let { page } = props;

    if (page == "home") {
      onNavigationClick = () => setLeftDrawerVisible(true);
      return <MenuOutlined />;
    }

    onNavigationClick = () => window.history.back();
  };

  return (
    <Layout>
      <PageHeader
        className="site-page-header"
        title={title}
        backIcon={navigationIcon()}
        onBack={onNavigationClick}
        extra={[
          <DatePicker
            key="1"
            picker="month"
            defaultValue={moment(new Date(), "MMM, YYYY")}
            format={"MMM, YYYY"}
          />,
        ]}
      />

      <Drawer
        title={`Hi, ${user.name}`}
        placement="left"
        visible={leftDrawerVisible}
        onClose={() => setLeftDrawerVisible(false)}
      >
        <div style={{ textAlign: "center" }}>
          <Avatar size={64} src={user.image} />
        </div>
        <div style={{ marginTop: 24 }}>
          <Menu>
            <Menu.Item key="1" icon={<GroupOutlined />}>
              <Link prefetch={false} href="/categories">
                Categories
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BarChartOutlined />}>
              Analysis
            </Menu.Item>
            <Menu.Item key="3" danger={true} icon={<LogoutOutlined />}>
              Sing out
            </Menu.Item>
          </Menu>
        </div>
      </Drawer>

      <Content
        style={{
          padding: 24,
          height: "90vh",
        }}
      >
        {props.children}
      </Content>
    </Layout>
  );
};

export default AppLayout;