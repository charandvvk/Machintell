import React from "react";
import styles from "../product.module.css";

function DynamicTable({
    headers,
    specifications,
    onInputChange,
    selectedRows,
    toggleRowSelection,
    id,
    saveBtnClick,
    setSavebtnClick,
    makeDataIterable,
    typeProduct,
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
                    <th className={styles.th} colSpan={4}>
                        Specifications of {id}
                    </th>
                    <td>
                        {saveBtnClick && (
                            <button
                                className={styles.btn}
                                onClick={() => setSavebtnClick(false)}
                            >
                                +
                            </button>
                        )}
                    </td>
                </tr>
                {!saveBtnClick && (
                    <tr>
                        {headers.map((header) => (
                            <th className={styles.th} key={header}>
                                {header}
                            </th>
                        ))}
                    </tr>
                )}
            </thead>
            {!saveBtnClick && (
                <tbody>
                    {makeDataIterable(specifications).map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            style={{
                                backgroundColor: selectedRows.includes(rowIndex)
                                    ? "lightgray"
                                    : "white",
                            }}
                        >
                            <th
                                className={styles.th}
                                onClick={() => toggleRowSelection(rowIndex)}
                            >
                                Specification {rowIndex + 1}
                            </th>
                            {row.map((cell, cellIndex) => (
                                <td className={styles.td} key={cellIndex}>
                                    {renderCell(cell, rowIndex, cellIndex)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            )}
        </table>
    );
}

export default DynamicTable;
