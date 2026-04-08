import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [profit, setProfit] = useState(0);
  const chartData = [
  {
    name: "Investment",
    value: total
  },
  {
    name: "Current",
    value: currentValue
  }
];

  const [fundName, setFundName] = useState("");
  const [amount, setAmount] = useState("");
  const [units, setUnits] = useState("");
  const [schemeCode, setSchemeCode] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  // ✅ CHANGE ONLY THIS IF PORT CHANGES
  const BASE_URL = "http://127.0.0.1:8085/api";

  // ✅ Fetch all + total
  const fetchData = async () => {
  try {
    setLoading(true);
    setError("");
    

    const res = await axios.get(`${BASE_URL}/all`);
    setData(res.data);

    const totalRes = await axios.get(`${BASE_URL}/total`);
    setTotal(totalRes.data.totalInvestment);

    const currentRes = await axios.get(`${BASE_URL}/current-value`);
    setCurrentValue(currentRes.data);

    const profitRes = await axios.get(`${BASE_URL}/profit`);
    setProfit(profitRes.data);

  } catch (err) {
    setError("Failed to load data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Add data
  const addData = async () => {
    try {
      await axios.post(`${BASE_URL}/add`, {
  fundName,
  amount: Number(amount),
  units: Number(units),
  schemeCode
});

      setFundName("");
      setAmount("");
      setUnits("");
      setSchemeCode("");

      fetchData();
    } catch (error) {
      console.error("ADD ERROR:", error);
      alert("Error adding data");
    }
  };

  // ✅ Delete data
  const deleteData = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  const updateData = async (id) => {
  try {
    await axios.put(`${BASE_URL}/update/${id}`, {
      fundName,
      amount: Number(amount),
      units: Number(units),
    });

    setFundName("");
    setAmount("");
    setUnits("");

    fetchData();
  } catch (error) {
    console.error("UPDATE ERROR:", error);
  }
};

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📊 Portfolio Tracker</h1>

      {loading ? (
  <p>⏳ Loading portfolio...</p>
) : (
  <>
    {/* 📊 CARDS */}
    <div style={{
      display: "flex",
      gap: "20px",
      marginBottom: "30px"
    }}>
      <div style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1
      }}>
        <h3>Total Investment</h3>
        <h2>₹ {total}</h2>
      </div>

      <div style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1
      }}>
        <h3>Current Value</h3>
        <h2>₹ {currentValue}</h2>
      </div>

      <div style={{
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1
      }}>
        <h3>Profit / Loss</h3>
        <h2 style={{ color: profit >= 0 ? "green" : "red" }}>
          ₹ {profit}
        </h2>
      </div>
    </div>

    <h3>Add / Update Fund</h3>

<div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
    alignItems: "center"
  }}
>
  <input
    placeholder="Fund Name"
    value={fundName}
    onChange={(e) => setFundName(e.target.value)}
    style={{
      padding: "10px",
      width: "180px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <input
    placeholder="Scheme Code"
    value={schemeCode}
    onChange={(e) => setSchemeCode(e.target.value)}
    style={{
      padding: "10px",
      width: "180px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    style={{
      padding: "10px",
      width: "180px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <input
    type="number"
    placeholder="Units"
    value={units}
    onChange={(e) => setUnits(e.target.value)}
    style={{
      padding: "10px",
      width: "180px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <button
    onClick={() => {
      if (editId) {
        updateData(editId);
        setEditId(null);
      } else {
        addData();
      }
    }}
    style={{
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    {editId ? "Update" : "Add"}
  </button>
</div>

    {/* 📈 CHART (ADD HERE) */}
    <div style={{
      width: "100%",
      height: "300px",
      marginBottom: "30px",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h3>Portfolio Growth</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* 👇 YOUR FORM CONTINUES HERE */}
  </>
)}

     
      <br />
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📊 TABLE */}
      <table style={{
  width: "100%",
  borderCollapse: "collapse",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}}>
  <thead style={{ backgroundColor: "#f5f5f5" }}>
    <tr>
      <th style={{ padding: "10px" }}>Fund</th>
<th style={{ padding: "10px" }}>Amount</th>
<th style={{ padding: "10px" }}>Units</th>
<th style={{ padding: "10px" }}>NAV</th>
<th style={{ padding: "10px" }}>Current Value</th>
<th style={{ padding: "10px" }}>Profit/Loss</th>
<th style={{ padding: "10px" }}>Actions</th>

    </tr>
  </thead>

  <tbody>
    {data.map((item) => (
      <tr key={item.id} style={{ textAlign: "center" }}>
        <td style={{ padding: "10px" }}>{item.fundName}</td>

<td style={{ padding: "10px" }}>{item.amount}</td>

<td style={{ padding: "10px" }}>{item.units}</td>

<td style={{ padding: "10px" }}>
  ₹ {item.nav}
</td>

<td style={{ padding: "10px" }}>
  ₹ {item.currentValue}
</td>

<td
  style={{
    padding: "10px",
    color: item.profit >= 0 ? "green" : "red"
  }}
>
  {item.profit > 0 ? "+" : ""} ₹ {item.profit}
</td>

<td style={{ padding: "10px" }}>
  <button onClick={() => deleteData(item.id)}>Delete</button>
  <button
    onClick={() => {
      setFundName(item.fundName);
      setAmount(item.amount);
      setUnits(item.units);
      setEditId(item.id);
    }}
  >
    Edit
  </button>
</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default App;