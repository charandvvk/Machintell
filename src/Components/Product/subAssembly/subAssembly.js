import React, { useState } from "react";
import styles from "../product.module.css";
import Mainassemblies from "./Mainassemblies";

const SubAssembly = () => {
  const [SubAssemblyName, setsubAssemblyName] = useState("");
  const [fileLocation, setFileLocation] = useState("");
  const [form, setForm] = useState("");

  const handlesubAssemblyNameChange = (event) => {
    setsubAssemblyName(event.target.value);
  };

  const handleFileLocationChange = (event) => {
    setFileLocation(event.target.value);
  };

  const handleSave = () => {
    // validation();

    if (validation() === 'true'){
      console.log('Saving data...',SubAssemblyName, fileLocation);
      setForm('subAssemblyAdded'); // Set the form state to 'subassemblyAdded' to display SubAssembly Details
    }
    else{
      console.log("please enter subAssembly name");
    }
    
  };

  const validation = () => {
    if (SubAssembly === ''){
      console.log("subAssemblyName is empty");
      return false;
    }    
    return true;
  }
  const [issubAssembliesComponents,setIssubAssembliesComponents] = useState("No");
  const [isBoughtUp,setIsBoughtUp] = useState("No");
 
  return (
    <>
      <div aria-label="MainFunction" className={styles.form}>
        {form === "subAssemblyAdded" ? (
          <Mainassemblies SubAssemblyName={SubAssemblyName} fileLocation={fileLocation} />
        ) : (
          <form>
            <table class ={styles.table}>
              <thead>
                <tr>
                  <th class ={styles.th}>Name of sub-assembly</th>
                  <td class ={styles.td}>
                    <input
                     className={styles.input}
                      type="text"
                      value={SubAssemblyName}
                      onChange={handlesubAssemblyNameChange}
                      required
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class ={styles.th}>File location</th>
                  <td class ={styles.td}>
                    <input
                    className={styles.input}
                      type="text"
                      value={fileLocation}
                      onChange={handleFileLocationChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th class ={styles.th}>Is it completely bought up</th>
                  <td class ={styles.td}>
                    {/* <Dropdown autoClose="inside">
                         <Dropdown.Toggle variant="success" id="dropdown-basic" autoClose="inside">
                           Yes/No
                         </Dropdown.Toggle>
                   
                         <Dropdown.Menu>
                           <Dropdown.Item href="#/action-1">Yes</Dropdown.Item>
                           <Dropdown.Item href="#/action-2">No</Dropdown.Item>
                         </Dropdown.Menu>
                       </Dropdown> */}
                    <select className={styles.dropdown}
                      value={isBoughtUp} // ...force the select's value to match the state variable...
                      onChange={(e) => setIsBoughtUp(e.target.value)} // ... and update the state variable on any change!
                    
                    >
                      <option value="Yes" >Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th class ={styles.th}>
                    Do you wish to add its subassemblies/components information?
                  </th>
                  <td class ={styles.td}>
                    {/* <Dropdown >
                         <Dropdown.Toggle variant="success" id="dropdown-basic" autoClose="inside">
                           Yes/No
                         </Dropdown.Toggle>
                   
                         <Dropdown.Menu className={styles.btn} >
                           <Dropdown.Item href="#/action-1">Yes</Dropdown.Item>
                           <Dropdown.Item href="#/action-2">No</Dropdown.Item>
                         </Dropdown.Menu>
                       </Dropdown> */}
                    {/* <select>
                      <option value="Yes">Yes</option>

                      <option value="No">No</option>
                    </select> */}
                    <select className={styles.dropdown}
                      value={issubAssembliesComponents} // ...force the select's value to match the state variable...
                      onChange={(e) => setIssubAssembliesComponents(e.target.value)} // ... and update the state variable on any change!
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
