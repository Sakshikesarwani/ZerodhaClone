import "./Positions.css";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Positions() {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    async function getData() {
      let response = await axios.get("https://zerodhaclone-1-y2ot.onrender.com/allPositions");
      setPositions(response.data);
    }
    getData();
  }, []);

  return (
    <div className="positions-wrapper">
      <h3 className="title">Positions ({positions.length})</h3>

      <table className="positions-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg.</th>
            <th>LTP</th>
            <th>P&amp;L</th>
            <th>Chg.</th>
          </tr>
        </thead>

        <tbody>
          {positions.map((position) => {
            let pAndl = (position.price - position.avg) * position.qty;

            return (
              <tr key={uuidv4()}>
                <td>{position.product}</td>
                <td>{position.name}</td>
                <td>{position.qty}</td>
                <td>{position.avg}</td>
                <td>{position.price}</td>

                <td className={pAndl > 0 ? "green" : pAndl < 0 ? "red" : ""}>
                  {pAndl.toFixed(2)}
                </td>

                <td
                  className={
                    parseFloat(position.net) > 0
                      ? "green"
                      : parseFloat(position.net) < 0
                      ? "red"
                      : ""
                  }
                >
                  {position.net}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
