import "./Orders.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/allOrders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="orders">
      {/* --------- No Orders Case ---------- */}
      {orders.length === 0 && (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      )}

      {/* --------- Orders Available ---------- */}
      {orders.length > 0 && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Type</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => (
              <tr key={i}>
                <td>{o.name}</td>
                <td>{o.qty}</td>
                <td>{o.price}</td>

                <td
                  style={{
                    color: o.mode === "BUY" ? "#00c853" : "#ff5252",
                    fontWeight: 600,
                  }}
                >
                  {o.mode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
