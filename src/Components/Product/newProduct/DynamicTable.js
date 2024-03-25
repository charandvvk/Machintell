import React from "react";
import styles from "../product.module.css";

function DynamicTable({ headers, data, onInputChange }) {
    const renderCell = (cell, rowIndex, cellIndex) => {
        // console.log(cell);
        if (cell.type === "input") {
          return (
            <input className={styles.input}
              type="text"
              value={cell.value}
              onChange={(e) => onInputChange(e, rowIndex, cellIndex)}
            />
          );
        } else {
          return cell[headers[cellIndex]];
        }
      };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th className={styles.th} key={header}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td className={styles.td} key={cellIndex}>
                {renderCell(cell, rowIndex, cellIndex)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DynamicTable;