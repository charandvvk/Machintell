import React from "react";
import styles from "../product.module.css";

function DynamicTable({
    headers,
    data,
    onInputChange,
    selectedRows,
    toggleRowSelection,
}) {
    const renderCell = (cell, rowIndex, cellIndex) => {
        // console.log(cell);
        // if (cell.type === "input") {
        return (
            <input
                className={styles.input}
                type="text"
                value={cell}
                onChange={(e) =>
                    onInputChange(e.target.value, rowIndex, cellIndex)
                }
            />
        );
        // } else {
        // return cell[headers[cellIndex]];
        // }
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
                    <tr
                        key={rowIndex}
                        style={{
                            backgroundColor: selectedRows.includes(rowIndex)
                                ? "lightgray"
                                : "white",
                        }}
                        onClick={() => toggleRowSelection(rowIndex)}
                    >
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
