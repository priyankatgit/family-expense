import { useEffect, useState } from "react";

export default function Category() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [monthlyReoccurs, setMonthlyReoccurs] = useState(false);
  const [amount, setAmount] = useState(0);

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

  const addCategory = async () => {
    let expense = {
      name: categoryName,
      type: categoryType,
      monthlyReoccurs,
      amount,
    };

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

    getCategories();
    setCategoryName("");
    setMonthlyReoccurs(false);
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
    <div>
      <h4>Category</h4>
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      ></input>
      <select onChange={(e) => setCategoryType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      Monthly recurring?{" "}
      <input
        type="checkbox"
        onChange={(e) => setMonthlyReoccurs(e.target.checked)}
      />
      {monthlyReoccurs && (
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        ></input>
      )}
      <button onClick={addCategory}>Add Category</button>
      <div style={{ margintTop: "10px" }}>
        {categories.map((category) => {
          return (
            <div key={category._id}>
              {category.name} - {category.type} - MonthlyReoccurs :
              {category.monthlyReoccurs ? "Yes" : "No"}
              <span
                onClick={() => deleteCategory(category._id)}
                style={{ paddingLeft: "10px", color: "lightpink" }}
              >
                Remove
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}