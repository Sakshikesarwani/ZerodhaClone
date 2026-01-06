import "./Holdings.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  const loadHoldings = async () => {
    const res = await axios.get("http://localhost:3002/allHoldings");
    setAllHoldings(res.data);
  };

  useEffect(() => {
    loadHoldings();
  }, []);

  const totalInvestment = allHoldings.reduce(
    (sum, s) => sum + s.avg * s.qty,
    0
  );

  const currentValue = allHoldings.reduce((sum, s) => sum + s.price * s.qty, 0);

  const totalPnL = currentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

  const labels = allHoldings.map((item) => item.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255,99,132,0.5)",
      },
    ],
  };

  return (
    <div className="holdings-wrapper">
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <table className="holdings-table">
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&amp;L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>
        </thead>

        <tbody>
          {allHoldings.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const pnl = curValue - stock.avg * stock.qty;

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>

                <td className={pnl >= 0 ? "green" : "red"}>{pnl.toFixed(2)}</td>

                <td className={stock.net.includes("+") ? "green" : "red"}>
                  {stock.net}
                </td>

                <td className={stock.day.includes("+") ? "green" : "red"}>
                  {stock.day}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="summary-row">
        <div className="box">
          <h5>{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>

        <div className="box">
          <h5>{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>

        <div className="box">
          <h5 className={totalPnL >= 0 ? "green" : "red"}>
            {totalPnL.toFixed(2)} ({pnlPercent.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </div>
  );
};

export default Holdings;
