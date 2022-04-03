import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function BalanceCount({ selectedMonth, invalidateReload }) {
  const [balance, setBalance] = useState({});

  useEffect(() => {
    getBalace();
  }, [selectedMonth, invalidateReload]);

  const getBalace = async () => {
    const response = await fetch(`/api/balance/?month=${selectedMonth}`);
    const balance = await response.json();
    if (balance.error) {
      alert(balance.error);
      return;
    }

    setBalance(balance);
  };

  return (
    <Card size="small">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={8}>
          <div>Income</div>
          <div>
            <Title level={4}>{balance.totalIncome}</Title>
          </div>
        </Col>
        <Col span={8}>
          <div>Expense</div>
          <div>
            <Title level={4}>{balance.totalExpense}</Title>
          </div>
        </Col>
        <Col span={8}>
          <div>Balance</div>
          <div>
            <Title level={4}>{balance.balance}</Title>
          </div>
        </Col>
      </Row>
    </Card>
  );
}