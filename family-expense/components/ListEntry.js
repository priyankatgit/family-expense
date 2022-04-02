import { DollarOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import { useEffect, useState } from "react";

export default function ListEntry({ selectedMonth }) {
  const [entries, setEntry] = useState([]);

  const getEntries = async () => {
    const response = await fetch(`/api/entry/?month=${selectedMonth}`);
    const entries = await response.json();
    if (entries.error) {
      alert(entries.error);
      return;
    }
    setEntry(entries.data);
  };

  useEffect(() => {
    getEntries();
  }, [selectedMonth]);

  const deleteEntry = async (_id) => {
    let response = await fetch("/api/entry", {
      method: "DELETE",
      body: JSON.stringify({ _id }),
    });

    let data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    getEntries();
  };

  const listPrimaryItem = (item) => {
    return (
      <div>
        <div>
          <span>{item.entryCategory}</span>
          {item.entryDetail && (
            <span style={{ fontWeight: "400", color: "#9b9b9b" }}>
              {" "}
              - {item.entryDetail}
            </span>
          )}
        </div>
        <div style={{ float: "right" }}>
          <DollarOutlined style={{ marginRight: 5 }} />
          {item.amount}
        </div>
      </div>
    );
  };

  return (
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={entries}
      renderItem={(entry) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={entry.userImage} size={32} />}
            title={listPrimaryItem(entry)}
          />
        </List.Item>
      )}
    />
    // <div>
    //   {entries.map((entry) => {
    //     return (
    //       <div key={entry._id}>
    //         <img src={entry.userImage} height="32" />
    //         {entry.entryDetail} - {entry.amount} - {entry.entryCategory} -
    //         {entry.entryCategoryType}
    //         <span
    //           onClick={() => deleteEntry(entry._id)}
    //           style={{ paddingLeft: "10px", color: "lightpink" }}
    //         >
    //           Remove
    //         </span>
    //       </div>
    //     );
    //   })}
    // </div>
  );
}