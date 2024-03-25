import React, { useEffect, useState } from "react";
import SpecificationDetails from "./SpecificationDetails";
import styles from "../product.module.css";

function ProductDetails({ productName, fileLocation }) {
  const [mainFunction, setMainFunction] = useState("");
  const [error, setError] = useState('');
  const [product, setProduct] = useState({
    productName: productName,
    fileLocation: fileLocation,
    mainFunction:'',
    secondaryFunction:[], specifications:[],
  });
  const [secondaryFunctions, setSecondaryFunctions] = useState([""]); // State to store secondary functions
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected row indices
  const [form, setForm] = useState("");
  const [productId, setProductId] = useState("");
  useEffect( () => {
    generateProductId(productName);
  }, [productName]);

  const generateProductId = (productName) => {
    if (productName.length >= 2){
      const firstTwoChars = productName.substring(0,2).toUpperCase();
      const date = new Date();
      const month = ('0' + ((date.getMonth()+1))).slice(-2);
      const year = date.getFullYear().toString().slice(-2);
      const specialChars = "!@#$%^&*()_[]{}|";
      const specialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
      const orderNumbers = "0123456789";
      const orderNumber = specialChars.charAt(Math.floor(Math.random() * orderNumbers.length));      
      const generateProductId = firstTwoChars + month + year + specialChar + orderNumber;
      setProductId(generateProductId);
    }
  }

  const handleMainFunctionChange = (event) => {
    setMainFunction(event.target.value);
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
    console.log('Saving data...', mainFunction, secondaryFunctions);

    // Perform validation
    if (validation()) {
      setForm('specifications'); // Set the form state to 'productAdded' to display ProductDetails
    } else {
      console.log('Validation failed');
    }
  };

  const validation = () => {
    let isValid = true;
    let errorMessage = '';

    // Check if mainFunction is empty
    if (mainFunction.trim() === '') {
      errorMessage += 'Please enter Main Function.\n';
      isValid = false;
    }

    // Check if Secondary Function is empty
    if (secondaryFunctions.some(sf => sf.trim() === '')) {
      errorMessage += 'Please enter  all Secondary Functions.\n';
      isValid = false;
    }

    // Set error message
    setError(errorMessage);

    return isValid;
  };

  
  const handleDelete = () => {
    let updatedSecondaryFunctions;
    if (selectedRows.length === 0) {
      updatedSecondaryFunctions = [...secondaryFunctions];
      updatedSecondaryFunctions.pop();
    } else {
      updatedSecondaryFunctions = secondaryFunctions.filter(
        (_, index) => !selectedRows.includes(index)
      );
    }
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
    <div aria-label="productAdded" className={styles.form}>
      {form === "specifications" ? (
        <SpecificationDetails productName={productName} fileLocation={fileLocation} />
      ) : (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Name of the Product</th>
                <td className={styles.td}>{productName}</td>
              </tr>
              <tr>
                <th className={styles.th}>Product ID</th>
                <td className={styles.td}>{productId}</td>
              </tr>
              <tr>
                <th className={styles.th}>Main Functions</th>
                <td className={styles.td}>
                  <textarea className={styles.input}
                    value={mainFunction}
                    onChange={handleMainFunctionChange}
                  />
                </td>
              </tr>
              <tr>
                <th className={styles.th} colSpan="2">
                  Add secondary function
                </th>
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
                  <td className={styles.th}>
                    <input className={styles.input}
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
            <div className={styles.btn2}>
              <button onClick={handleAddSecondary}>Add </button>
            </div>
            <div className={styles.btn2}>
              <button onClick={handleDelete}>Delete </button>
            </div>
            <div className={styles.btn2}>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;