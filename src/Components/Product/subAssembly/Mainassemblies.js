import React, { useState } from "react";
import styles from "../product.module.css";

function Mainassemblies({}) {
  const [SubAssembly, setSubAssemblyName] = useState("");
  const [secondaryFunctions, setSecondaryFunctions] = useState([]); // State to store secondary functions
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected row indices
  const [form, setForm] = useState("");

  const handleSubAssemblyNameChange = (event) => {
    setSubAssemblyName(event.target.value);
  };

  const handleAddSecondary = () => {
    setSecondaryFunctions([...secondaryFunctions, ""]); // Add a new empty secondary function to the state
  };

  const handleSecondaryFunctionChange = (index, value) => {
    const updatedSecondaryFunctions = [...secondaryFunctions];
    updatedSecondaryFunctions[index] = value;
    setSecondaryFunctions(updatedSecondaryFunctions);
  };

  const handleSave = () => {
    console.log(SubAssembly, secondaryFunctions);
    setForm("MainFunction");
  };

  const handleDelete = () => {
    const updatedSecondaryFunctions = secondaryFunctions.filter(
      (_, index) => !selectedRows.includes(index)
    );
    setSecondaryFunctions(updatedSecondaryFunctions);
    setSelectedRows([]);
  };

  const toggleRowSelection = (index) => {
    const selectedIndex = selectedRows.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedRows([...selectedRows, index]);
    } else {
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };

  const isRowSelected = (index) => {
    return selectedRows.includes(index);
  };

  return (
    <div aria-label="SubAssemblyAdded" className={styles.form}>
      {form === "MainFunction" ? (
        <Mainassemblies />
      ) : (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Name of sub-assembly</th>
                <td className={styles.td}>Front_wheel</td>
              </tr>
              <tr>
                <th className={styles.th}>sub-assembly ID</th>
                <td className={styles.td}>BI1xxxxABC</td>
              </tr>
              <tr>
                <th className={styles.th}>File location</th>
                <td className={styles.td}>BI1xxxxABC</td>
              </tr>
              <tr>
                <th className={styles.th}>Is it completely bought up</th>
                <td className={styles.td}>No</td>
              </tr>
              <tr>
                <th className={styles.th}>
                  Do you wish to add its subassemblies/components information?
                </th>
                <td className={styles.td}>Yes</td>
              </tr>
              <tr>
                <th className={styles.th}>Main Functions </th>
                <td className={styles.td}>
                  <input
                    type="text"
                    value={SubAssembly}
                    onChange={handleSubAssemblyNameChange}
                  />
                </td>
              </tr>
              <tr>
                <th className={styles.th}>Add secondary function</th>
              </tr>
            </thead>
            <tbody>
              {secondaryFunctions.map((secondaryFunction, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: isRowSelected(index)
                      ? "lightgray"
                      : "white",
                  }}
                  onClick={() => toggleRowSelection(index)}
                >
                  <th className={styles.th}>Secondary function {index + 1}</th>
                  <td className={styles.td}>
                    <input
                      type="text"
                      value={secondaryFunction}
                      onChange={(event) =>
                        handleSecondaryFunctionChange(index, event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className={styles.btn2} onClick={handleAddSecondary}>
              Add Secondary Function
            </button>
          </div>
          <div>
            <button className={styles.btn2} onClick={handleDelete}>
              Delete Secondary Function
            </button>
          </div>
          <div>
            <button className={styles.btn2} type="button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mainassemblies;
