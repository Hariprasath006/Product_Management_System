import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { FaMoon, FaSun, FaFileExcel, FaFilePdf } from "react-icons/fa";

const API = "https://product-management-system-dtzj.onrender.com/api/products";
const COLORS = ["#00ffd5", "#00c3ff", "#ffbb28", "#ff8042"];

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const [sortType, setSortType] = useState("none");

  // ✅ Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (!auth) {
      window.location.href = "/";
    } else {
      loadProducts();
    }
  }, []);

  const getAuth = () => JSON.parse(localStorage.getItem("auth"));

  const loadProducts = async () => {
    setLoading(true);
    const auth = getAuth();

    const res = await axios.get(API, { auth });
    setProducts(res.data);

    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.quantity) {
      toast.error("Fill all fields ");
      return;
    }

    const auth = getAuth();

    if (editingId) {
      await axios.put(`${API}/${editingId}`, form, { auth });
      toast.success("Product Updated ");
      setEditingId(null);
    } else {
      await axios.post(API, form, { auth });
      toast.success("Product Added");
    }

    setForm({ name: "", price: "", quantity: "" });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const auth = getAuth();
    await axios.delete(`${API}/${id}`, { auth });

    toast.success("Product Deleted");
    loadProducts();
  };

  const editProduct = (p) => {
    setForm(p);
    setEditingId(p.id);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/";
  };

  // ✅ Search
  let filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Sorting
  if (sortType === "price") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === "stock") {
    filteredProducts.sort((a, b) => a.quantity - b.quantity);
  }

  // ✅ Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const formatCurrency = (value) => value.toLocaleString("en-IN");

  // ✅ Charts Data
  const chartData = products.map(p => ({
    name: p.name,
    value: p.quantity
  }));

  // ✅ Pagination Logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    XLSX.writeFile(workbook, "products.xlsx");
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Products Report", 20, 20);

    products.forEach((p, i) => {
      doc.text(`${p.name} | ₹${p.price} | Qty:${p.quantity}`, 20, 40 + i * 10);
    });

    doc.save("products.pdf");
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>

      {/* ✅ SIDEBAR */}
      <div className="sidebar">
        <h2>MENU</h2>
        <button onClick={() => setSortType("none")}>All Products</button>
        <button onClick={() => setSortType("price")}>Sort by Price</button>
        <button onClick={() => setSortType("stock")}>Sort by Stock</button>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="main">

        <div className="topbar">
          <h1>Product Management System</h1>

          <div className="top-actions">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button onClick={exportExcel}><FaFileExcel /></button>
            <button onClick={exportPDF}><FaFilePdf /></button>

            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* ✅ Stats */}
        <div className="stats">
          <div className="card-stat">
            <h2>{totalProducts}</h2>
            <p>Products</p>
          </div>

          <div className="card-stat">
            <h2>{totalStock}</h2>
            <p>Total Stock</p>
          </div>

          <div className="card-stat">
            <h2>₹ {formatCurrency(totalValue)}</h2>
            <p>Total Value</p>
          </div>
        </div>

        {/* ✅ Charts */}
        <div className="charts">
          <PieChart width={250} height={250}>
            <Pie data={chartData} dataKey="value">
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>

          <BarChart width={400} height={250} data={products}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#00c3ff" />
          </BarChart>
        </div>

        {/* ✅ Form */}
        <div className="form">
          <input placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <button onClick={handleSubmit}>
            {editingId ? "Update " : "Add "}
          </button>
        </div>

        <h2>Products List 📦</h2>

        <input className="search"
          placeholder="Search "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ Loading */}
        {loading ? (
          <p className="loading">Loading...</p>
        ) : paginatedProducts.length === 0 ? (
          <p className="empty">No products found 😢</p>
        ) : (
          paginatedProducts.map(p => (
            <div key={p.id} className="product-card">
              <div>
                <b>{p.name}</b>
                <p>₹ {p.price}</p>
                <p>Qty: {p.quantity}</p>
              </div>

              <div className="actions">
                <button onClick={() => editProduct(p)}>Edit ✏️</button>
                <button onClick={() => deleteProduct(p.id)}>Delete 🗑️</button>
              </div>
            </div>
          ))
        )}

        {/* ✅ Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Dashboard;
