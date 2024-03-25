import React, { useState } from "react";
import styles from "../product.module.css";

function MainAssemblies({ SubAssembly,handleInputChange }) {
  const [secondaryFunctions, setSecondaryFunctions] = useState(['']);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleAddSecondary = () => {
    setSecondaryFunctions([...secondaryFunctions, ""]);
  };

  const handleSecondaryFunctionChange = (index, value) => {
    const updatedSecondaryFunctions = [...secondaryFunctions];
    updatedSecondaryFunctions[index] = value;
    setSecondaryFunctions(updatedSecondaryFunctions);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete selected secondary functions?")) {
      const updatedSecondaryFunctions = secondaryFunctions.filter(
        (_, index) => !selectedRows.includes(index)
      );
      setSecondaryFunctions(updatedSecondaryFunctions);
      setSelectedRows([]);
    }
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

  const handleSave = () => {
    SubAssembly.secondaryFunction=secondaryFunctions
    console.log(SubAssembly)
  };

  return (
    <div aria-label="SubAssemblyAdded" className={styles.form}>
      <div>
        <table className={styles.table}>
        <thead>
            <tr>
              <th className={styles.th}>Name of sub-assembly</th>
              <td className={styles.td}>{SubAssembly.SubAssemblyName}</td>
            </tr>
            <tr>
              <th className={styles.th}>sub-assembly ID</th>
              <td className={styles.td}>BI1xxxxABC</td>
            </tr>
            <tr>
              <th className={styles.th}>File location</th>
              <td className={styles.td}>{SubAssembly.fileLocation}</td>
            </tr>
            <tr>
              <th className={styles.th}>Is it completely bought up</th>
              <td className={styles.td}>{SubAssembly.isBoughtUp}</td>
            </tr>
            <tr>
              <th className={styles.th}>
                Do you wish to add its subassemblies/components information?
              </th>
              <td className={styles.td}>{SubAssembly.isSubAssemblyComponentsNeeded}</td>
            </tr>
            <tr>
              <th className={styles.th}>Main Functions </th>
              <td className={styles.td}>
                <input type="text" name="mainFunction" value={SubAssembly.mainFunctions} onChange={(event)=>{handleInputChange(event)}}/>
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
                  backgroundColor: isRowSelected(index) ? "lightgray" : "white",
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
          <button className={styles.btn2} onClick={handleDelete}>
            Delete Selected Secondary Functions
          </button>
          <button className={styles.btn2} type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainAssemblies;
