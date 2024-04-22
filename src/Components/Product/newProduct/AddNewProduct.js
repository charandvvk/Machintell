import React, { useEffect, useRef, useState } from "react";
import styles from "../product.module.css";
import { useDispatch } from "react-redux";
import { productActions } from "../../../store";
import generateId from "../../../util";

function AddNewProduct() {
  const nameRef = useRef();
  const fileLocationRef = useRef();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productActions.addProductName());
  }, [dispatch]);

  const validation = () => {
    let isValid = true;
    let errorMessage = "";

    // Check if productName is empty
    if (nameRef.current.value.trim() === "") {
      errorMessage += "* Please enter a product name.\n";
      isValid = false;
    }

    // Check if fileLocation is empty
    if (fileLocationRef.current.value.trim() === "") {
      errorMessage += "* Please enter a file location.\n";
      isValid = false;
    }

    // Set error message
    setError(errorMessage);

    return isValid;
  };

  const handleSave = () => {
    console.log("Saving data...");

    // Perform validation
    if (validation()) {
      // add product data to backend
      dispatch(
        productActions.addProduct({
          name: nameRef.current.value,
          fileLocation: fileLocationRef.current.value,
          id: generateId(nameRef.current.value, "p"),
        })
      );
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div aria-label="Product Form" className={styles.form}>
      <form>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>
                  Name of the Product {error && nameRef.current.value === "" && <span className={styles.requiredSymbol}>*</span>}
                </th>
                <td className={styles.td}>
                  <input
                    ref={nameRef}
                    className={styles.input}
                    type="text"
                    required
                    onChange={() => setError("")} // Clear error on input change
                  />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={styles.th}>
                    File location { error && fileLocationRef.current.value === "" && <span className={styles.requiredSymbol}>*</span> }
                </th>
                <td className={styles.td}>
                  <input
                    ref={fileLocationRef}
                    className={styles.input}
                    type="text"
                    required
                    onChange={() => setError("")}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btn2} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </form>
      {error && (
        <div className={styles.error}>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default AddNewProduct;
