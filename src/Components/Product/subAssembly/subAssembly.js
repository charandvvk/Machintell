import React, { useState } from "react";
import styles from "../product.module.css";
import Mainassemblies from "./Mainassemblies";

const SubAssembly = () => {
  const [subAssembly, setSubAssembly] = useState({
    SubAssemblyName: '',
    fileLocation: '',
    isBoughtUp:'No',
    isSubAssemblyComponentsNeeded:'No',
    mainFunction:'',
    secondaryFunction:[], 
  });
  const [form, setForm] = useState("");
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // console.log(event)
    setSubAssembly((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (validation()) {
      // console.log("Saving data...", subAssembly);
      setForm("subAssemblyAdded");
    } else {
      console.log("Please enter subAssembly name");
    }
  };

  const validation = () => {
    if (subAssembly.SubAssemblyName.trim() === "") {
      console.log("SubAssembly name is empty");
      return false;
    }
    return true;
  };

  return (
    <>
      <div aria-label="MainFunction" className={styles.form}>
        {form === "subAssemblyAdded" ? (
          <Mainassemblies
            SubAssembly={subAssembly}
            setSubAssembly={setSubAssembly}
            handleInputChange={handleInputChange}
          />
        ) : (
          <form>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name of sub-assembly</th>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      type="text"
                      name="SubAssemblyName"
                      value={subAssembly.SubAssemblyName}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className={styles.th}>File location</th>
                  <td className={styles.td}>
                    <input
                      className={styles.input}
                      type="text"
                      name="fileLocation"
                      value={subAssembly.fileLocation}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={styles.th}>Is it completely bought up</th>
                  <td className={styles.td}>
                    <select
                      className={styles.dropdown}
                      value={subAssembly.isBoughtUp}
                      onChange={handleInputChange}
                      name="isBoughtUp"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th className={styles.th}>
                    Do you wish to add its subassemblies/components information?
                  </th>
                  <td className={styles.td}>
                    <select
                      className={styles.dropdown}
                      value={subAssembly.isSubAssemblyComponentsNeeded}
                      onChange={handleInputChange}
                      name="isSubAssemblyComponentsNeeded"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles.buttonGroup}>
              <button type="button" className={styles.btn} onClick={handleSave}>
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default SubAssembly;
