import React, { useRef, useState } from "react";
import SpecificationDetails from "./SpecificationDetails";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";

function ProductDetails() {
  const { name, id, fileLocation, mainFunction, secondaryFunctions } =
    useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [secondaryFunctionsState, setSecondaryFunctionsState] =
    useState(secondaryFunctions); // State to store secondary functions
  const [selectedRows, setSelectedRows] = useState([]); // State to store selected row indices
  const [saveBtnClick, setSavebtnClick] = useState(false); // State to track save button click
  const mainFunctionRef = useRef();

  const handleAddSecondary = () => {
    setSecondaryFunctionsState((prevState) => [...prevState, ""]); // Add a new empty secondary function to the state
  };
  console.log(selectedRows)
  const handleSecondaryFunctionsStateChange = (value, index) => {
    setSecondaryFunctionsState((prevState) => {
      const updatedSecondaryFunctionsState = [...prevState];
      updatedSecondaryFunctionsState[index] = value;
      return updatedSecondaryFunctionsState;
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete selected/last secondary functions?"
      )
    ) {
      setSecondaryFunctionsState((prevState) => {
        return selectedRows.length
          ? prevState.filter((_, index) => !selectedRows.includes(index))
          : prevState.slice(0, -1);
      });
      setSelectedRows([]);
    }
  };

  const toggleRowSelection = (selectedIndex) => {
    setSelectedRows((prevState) => {
      return prevState.includes(selectedIndex)
        ? prevState.filter((index) => index !== selectedIndex)
        : [...prevState, selectedIndex];
    });
  };

  const validation = () => {
    let isValid = true;
    let errorMessage = "";

    // Check if mainFunction is empty
    if (mainFunctionRef.current.value.trim() === "") {
      errorMessage += "* Please enter Main Function.\n";
      isValid = false;
    }

    // Check if Secondary Function is empty
    if (!secondaryFunctionsState.some((sf) => sf.trim() !== "")) {
      errorMessage += "* Please enter  all Secondary Functions.\n";
      isValid = false;
    }

    // Set error message
    setError(errorMessage);

    return isValid;
  };

  const handleSave = () => {
    console.log(
      "Saving data...",
      mainFunctionRef.current.value,
      secondaryFunctionsState
    );
    // Perform validation
    if (validation()) {
        dispatch(
            productActions.addProductDetails({
                mainFunction: mainFunctionRef.current.value,
                secondaryFunctions: [...secondaryFunctionsState],
            })
            );
            setSavebtnClick(true);
      // add product details (main function) data to backend
      // add product secondary functions data to backend
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <div aria-label="productAdded" className={styles.form}>
      <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Name of the Product</th>
              <td className={styles.td}>{name}</td>
              <td>{saveBtnClick &&  <button className={styles.btn} onClick={()=>setSavebtnClick(false)}>+</button>}</td>
            </tr>
            {!saveBtnClick && (
              <>
                <tr>
                  <th className={styles.th}>Product ID</th>
                  <td className={styles.td}>{id}</td>
                </tr>
                <tr>
                  <th className={styles.th}>File location</th>
                  <td className={styles.td}>{fileLocation}</td>
                </tr>
                <tr>
                  <th className={styles.th}>
                    Main Functions { error && mainFunctionRef.current.value === "" && <span className={styles.requiredSymbol}>*</span> }
                    </th>
                  <td className={styles.td}>
                    <textarea
                      className={styles.input}
                      defaultValue={mainFunction}
                      ref={mainFunctionRef}
                      onChange={() => setError("")}
                    />
                  </td>
                </tr>
                <tr>
                  <th className={styles.th} colSpan="2">
                    Add secondary function 
                  </th>
                </tr>
              </>
            )}
          </thead>
          {!saveBtnClick && (
            <tbody>
              {secondaryFunctionsState.map((secondaryFunctionState, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: selectedRows.includes(index)
                      ? "lightgray"
                      : "white",
                  }}
                  
                >
                  <th className={styles.th} onClick={() => toggleRowSelection(index)}>
                    Secondary function {index + 1} {" "} { secondaryFunctionsState === "" && error && <span className={styles.requiredSymbol}>*</span> }
                  </th>
                  <td className={styles.td}>
                    <input
                      type="text"
                      className={styles.input}
                      value={secondaryFunctionState}
                      onChange={(event) =>
                        handleSecondaryFunctionsStateChange(
                          event.target.value,
                          index
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!saveBtnClick && (
          <div>
            <button className={styles.btn} onClick={handleAddSecondary}>
              +
            </button>

            <button className={styles.btn} onClick={handleDelete}>
              -
            </button>

            <button
              className={`${styles.savebtn} ${styles.btn}`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className={styles.error}>
          <pre>{error}</pre>
        </div>
      )}
      <SpecificationDetails type={"product"}/>
    </div>
  );
}

export default ProductDetails;
