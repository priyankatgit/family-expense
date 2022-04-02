import { useEffect, useState } from "react";
import { Button, Col, Card, Form, Input, Row, Select, List, Tag } from "antd";
import { CheckCircleFilled, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  const getCategories = async () => {
    const response = await fetch("/api/category");
    const categories = await response.json();
    if (categories.error) {
      alert(categories.message);
      return;
    }
    setCategories(categories.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (values) => {
    let expense = values;

    // save the post
    let response = await fetch("/api/category", {
      method: "POST",
      body: JSON.stringify(expense),
    });

    // get the data
    let data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    form.resetFields();
    getCategories();
  };

  const deleteCategory = async (_id) => {
    let response = await fetch("/api/category", {
      method: "DELETE",
      body: JSON.stringify({ _id }),
    });

    // get the data
    let data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    getCategories();
  };

  return (
    <>
      <Card title="Add new category">
        <Form form={form} onFinish={onSubmit}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Please select category!" }]}
              >
                <Input placeholder="Enter category" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                rules={[{ required: true, message: "Please input amount!" }]}
              >
                <Select showSearch placeholder="Select type">
                  <Option value="expense">
                    Expense
                  </Option>
                  <Option value="income">
                    Income
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Form.Item shouldUpdate>
                {() => (
                  <Button
                    size="large"
                    shape="circle"
                    icon={<CheckCircleFilled />}
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  ></Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: 10 }} title="Categories">
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={categories}
          renderItem={(category) => (
            <List.Item
              actions={[
                category.type == "expense" ? (
                  <Tag key={1} color="magenta">
                    Expense
                  </Tag>
                ) : (
                  <Tag key={2} color="green">
                    Income
                  </Tag>
                ),
                <DeleteOutlined key={3} />,
              ]}
            >
              <List.Item.Meta title={category.name} />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
}
