import {
  CheckCircleFilled,
  DollarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Select, Tag } from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const { Option } = Select;

export default function AddEntry() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [entryDetail, setEntryDetail] = useState("");
  const [amount, setAmount] = useState(undefined);
  const [categoryId, setCategoryId] = useState(undefined);

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

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
    console.log("Finish:", values);

    if (!categoryId) {
      alert("Select expense");
      return;
    }

    let entry = {
      entryDetail: entryDetail,
      categoryId,
      amount,
      userId: session.user.userId,
    };

    // save the post
    let response = await fetch("/api/entry", {
      method: "POST",
      body: JSON.stringify(entry),
    });

    // get the data
    let data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Clear fields
    setEntryDetail("");
    setAmount("");
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Form.Item
            name="category"
            rules={[{ required: true, message: "Please select category!" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Select category"
              optionLabelProp="label"
            >
              {categories.map((category) => (
                <Option
                  key={category._id}
                  value={category._id}
                  label={category.name}
                >
                  <div>
                    {category.name}
                    <span style={{ marginLeft: 5 }}>
                      {category.type == "expense" ? (
                        <Tag color="magenta">exp</Tag>
                      ) : (
                        <Tag color="green">inc</Tag>
                      )}
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="amount"
            rules={[{ required: true, message: "Please input amount!" }]}
          >
            <Input
              prefix={<DollarOutlined />}
              type="number"
              placeholder="Amount"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Form.Item name="entryDetail">
            <Input prefix={<EditOutlined />} placeholder="Memo" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name=""
            rules={[{ required: true, message: "Please select date!" }]}
          >
            <DatePicker
              bordered={false}
              defaultValue={moment(new Date(), "MMM Do")}
              format={"MMM Do"}
            />
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
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              ></Button>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
    // <div>
    //   <input
    //     type="text"
    //     placeholder="Entry detail"
    //     value={entryDetail}
    //     onChange={(e) => setEntryDetail(e.target.value)}
    //   ></input>
    //   <input
    //     type="text"
    //     placeholder="Amount"
    //     value={amount}
    //     onChange={(e) => setAmount(parseFloat(e.target.value))}
    //   ></input>
    //   <select onChange={(e) => setCategoryId(e.target.value)}>
    //     <option></option>
    //     {categories.map((category) => (
    //       <option key={category._id} value={category._id}>
    //         {category.name}
    //       </option>
    //     ))}
    //   </select>
    //   <button onClick={addEntry}>Add</button>
    // </div>
  );
}
