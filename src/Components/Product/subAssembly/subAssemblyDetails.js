import React, { useState } from "react";
import styles from "../product.module.css";

function SubAssemblyDetails({ handleInputChange }) {
    const [secondaryFunctions, setSecondaryFunctions] = useState([""]);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleAddSecondary = () => {
        setSecondaryFunctions((prevState) => [...prevState, ""]); // Add a new empty secondary function to the state
    };

    const handleSecondaryFunctionsChange = (value, index) => {
        setSecondaryFunctions((prevState) => {
            const updatedSecondaryFunctionsState = [...prevState];
            updatedSecondaryFunctionsState[index] = value;
            return updatedSecondaryFunctionsState;
        });
    };

    const handleDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to delete selected secondary functions?"
            )
        ) {
            setSecondaryFunctions((prevState) => {
                return selectedRows.length
                    ? prevState.filter(
                          (_, index) => !selectedRows.includes(index)
                      )
                    : prevState.slice(0, -1);
            });
            setSelectedRows([]);
        }
    };

    const toggleRowSelection = (selectedIndex) => {
        setSelectedRows((prevState) => {
            return prevState.includes(selectedIndex)
                ? prevState.filter((index) => index != selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    const handleSave = () => {};

    return (
        <div aria-label="SubAssemblyAdded" className={styles.form}>
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Name of sub-assembly</th>
                            <td className={styles.td}>{}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>sub-assembly ID</th>
                            <td className={styles.td}>{}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>File location</th>
                            <td className={styles.td}>{}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>
                                Is it completely bought up
                            </th>
                            <td className={styles.td}>{}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>
                                Do you wish to add its subassemblies/components
                                information?
                            </th>
                            <td className={styles.td}>{}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>Main Functions </th>
                            <td className={styles.td}>
                                <input
                                    type="text"
                                    name="mainFunction"
                                    onChange={(event) => {
                                        handleInputChange(event);
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.th}>
                                Add secondary function
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {secondaryFunctions.map((secondaryFunction, index) => (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor: selectedRows.includes(
                                        index
                                    )
                                        ? "lightgray"
                                        : "white",
                                }}
                                onClick={() => toggleRowSelection(index)}
                            >
                                <th className={styles.th}>
                                    Secondary function {index + 1}
                                </th>
                                <td className={styles.td}>
                                    <input
                                        type="text"
                                        value={secondaryFunction}
                                        onChange={(event) =>
                                            handleSecondaryFunctionsChange(
                                                event.target.value,
                                                index
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <button
                        className={styles.btn2}
                        onClick={handleAddSecondary}
                    >
                        Add Secondary Function
                    </button>
                    <button className={styles.btn2} onClick={handleDelete}>
                        Delete Selected Secondary Functions
                    </button>
                    <button
                        className={styles.btn2}
                        type="button"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubAssemblyDetails;
