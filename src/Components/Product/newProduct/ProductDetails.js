import React, { useRef, useState } from "react";
import SpecificationDetails from "./SpecificationDetails";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";

function ProductDetails() {
    const {
        name,
        id,
        fileLocation,
        mainFunction,
        secondaryFunctions,
        // specifications,
    } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [secondaryFunctionsState, setSecondaryFunctionsState] =
        useState(secondaryFunctions); // State to store secondary functions
    const [selectedRows, setSelectedRows] = useState([]); // State to store selected row indices

    const mainFunctionRef = useRef();

    const handleAddSecondary = () => {
        setSecondaryFunctionsState((prevState) => [...prevState, ""]); // Add a new empty secondary function to the state
    };

    const handleSecondaryFunctionStateChange = (value, index) => {
        setSecondaryFunctionsState((prevState) => {
            const updatedSecondaryFunctionsState = [...prevState];
            updatedSecondaryFunctionsState[index] = value;
            return updatedSecondaryFunctionsState;
        });
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
            // add product details (main function) data to backend
            // add product secondary functions data to backend
        } else {
            console.log("Validation failed");
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        // Check if mainFunction is empty
        if (mainFunctionRef.current.value.trim() === "") {
            errorMessage += "Please enter Main Function.\n";
            isValid = false;
        }

        // Check if Secondary Function is empty
        if (secondaryFunctionsState.some((sf) => sf.trim() === "")) {
            errorMessage += "Please enter  all Secondary Functions.\n";
            isValid = false;
        }

        // Set error message
        setError(errorMessage);

        return isValid;
    };

    const handleDelete = () => {
        setSecondaryFunctionsState((prevState) => {
            return selectedRows.length
                ? prevState.filter((_, index) => !selectedRows.includes(index))
                : prevState.slice(0, -1);
        });
        setSelectedRows([]);
    };

    const toggleRowSelection = (selectedIndex) => {
        setSelectedRows((prevState) => {
            return prevState.includes(selectedIndex)
                ? prevState.filter((index) => index != selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    return (
        <div aria-label="productAdded" className={styles.form}>
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Name of the Product</th>
                            <td className={styles.td}>{name}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>Product ID</th>
                            <td className={styles.td}>{id}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>File location</th>
                            <td className={styles.td}>{fileLocation}</td>
                        </tr>
                        <tr>
                            <th className={styles.th}>Main Functions</th>
                            <td className={styles.td}>
                                <textarea
                                    className={styles.input}
                                    defaultValue={mainFunction}
                                    ref={mainFunctionRef}
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
                        {secondaryFunctionsState.map(
                            (secondaryFunctionState, index) => (
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
                                    <td className={styles.th}>
                                        <input
                                            className={styles.input}
                                            type="text"
                                            value={secondaryFunctionState}
                                            onChange={(event) =>
                                                handleSecondaryFunctionStateChange(
                                                    event.target.value,
                                                    index
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            )
                        )}
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
            {error && (
                <div className={styles.error}>
                    <pre>{error}</pre>
                </div>
            )}
            <SpecificationDetails
                productName={name}
                fileLocation={fileLocation}
            />
        </div>
    );
}

export default ProductDetails;
