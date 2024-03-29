import React from "react";
import styles from "../product.module.css";

function DynamicTable({
    headers,
    data,
    onInputChange,
    onInputBlur,
    selectedRows,
    toggleRowSelection,
    currActive,
    currActivePos,
}) {
    const renderCell = (cell, rowIndex, cellIndex) => {
        if (cellIndex !== 2) {
            return (
                <input
                    disabled={cellIndex === 1}
                    className={`${styles.input} ${
                        currActive.startsWith("c") &&
                        currActivePos !== rowIndex &&
                        styles.disabled
                    }`}
                    type="text"
                    value={cell}
                    onChange={(e) =>
                        onInputChange(e.target.value, rowIndex, cellIndex)
                    }
                    onBlur={(e) =>
                        onInputBlur(e.target.value, rowIndex, cellIndex)
                    }
                />
            );
        } else {
            return (
                <select
                    className={`${styles.drop} ${
                        currActive.startsWith("c") &&
                        currActivePos !== rowIndex &&
                        styles.disabled
                    }`}
                    value={cell}
                    onChange={(e) =>
                        onInputChange(e.target.value, rowIndex, cellIndex)
                    }
                >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            );
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
                    <tr
                        key={rowIndex}
                        style={{
                            backgroundColor: selectedRows.includes(rowIndex)
                                ? "lightgray"
                                : "white",
                        }}
                        onClick={() =>
                            !currActive.startsWith("c") &&
                            toggleRowSelection(rowIndex)
                        }
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
