import React, { useEffect, useRef, useState } from "react";
import styles from "../product.module.css";
import { useDispatch } from "react-redux";
import { backendActions, productActions } from "../../../store";
import generateId from "../../../util";

function AddNewProduct({ product, onSave }) {
    const nameRef = useRef();
    const fileLocationRef = useRef();
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        if (!product) dispatch(productActions.addProductName());
    }, [dispatch]);

    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        // Check if productName is empty
        if (nameRef.current.value.trim() === "") {
            errorMessage += "Please enter product name.\n";
            isValid = false;
        }

        // Check if fileLocation is empty
        if (fileLocationRef.current.value.trim() === "") {
            errorMessage += "Please enter file location.\n";
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
            const name = nameRef.current.value;
            const fileLocation = fileLocationRef.current.value;
            const id = generateId(name, "p");
            if (product) {
                dispatch(
                    backendActions.duplicateProduct({
                        name,
                        fileLocation,
                        id,
                        product,
                    })
                );
                onSave(id);
            } else
                dispatch(
                    productActions.addProduct({
                        name,
                        fileLocation,
                        id,
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
                                    Name of the Product
                                </th>
                                <td className={styles.td}>
                                    <input
                                        ref={nameRef}
                                        className={styles.input}
                                        type="text"
                                        required
                                        defaultValue={product && product.name}
                                    />
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className={styles.th}>File location</th>
                                <td className={styles.td}>
                                    <input
                                        ref={fileLocationRef}
                                        className={styles.input}
                                        type="text"
                                        required
                                        defaultValue={
                                            product && product.fileLocation
                                        }
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.btn2}
                            onClick={handleSave}
                        >
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
