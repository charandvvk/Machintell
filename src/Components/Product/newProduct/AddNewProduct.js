import React, { useEffect, useRef, useState } from "react";
import styles from "../product.module.css";
import { useDispatch } from "react-redux";
import { productActions } from "../../../store";
import generateId from "../../../utils/generateId";
import { useMutation } from "@tanstack/react-query";
import { queryClient, sendData } from "../../../utils/http";

function AddNewProduct({
    product,
    setWarningFor,
    setSelectedAction,
    setSelectedId,
}) {
    const nameRef = useRef();
    const fileLocationRef = useRef();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const [warning, setWarning] = useState(null);

    useEffect(() => {
        setWarningFor(null);
    }, []);

    useEffect(() => {
        if (!product) dispatch(productActions.addProductName());
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

    const { mutate: addDuplicateProduct, isPending: isAddingDuplicateProduct } =
        useMutation({
            mutationFn: (addRequestDuplicateProductData) =>
                sendData(
                    "/addduplicateproduct",
                    "POST",
                    addRequestDuplicateProductData
                ),
            onSuccess: ({ data }) => {
                queryClient.invalidateQueries({
                    queryKey: ["products"],
                });
                setSelectedAction(null);
                setSelectedId(data);
            },
        });

    const handleConfirm = () => {
        const addRequestDuplicateProductData = {
            id: product.product_id,
            name: nameRef.current.value,
            fileLocation: fileLocationRef.current.value,
        };
        addDuplicateProduct(addRequestDuplicateProductData);
    };

    const handleSave = () => {
        // console.log("Saving data...");

        // Perform validation

        // add product data to backend
        if (validation()) {
            const name = nameRef.current.value;
            const fileLocation = fileLocationRef.current.value;
            if (product) {
                if (
                    product.product_name === name &&
                    product.File_Location === fileLocation
                )
                    setWarning(
                        "Do you want to save with same name and file location?"
                    );
                else if (product.product_name === name)
                    setWarning("Do you want to save with same name?");
                else if (product.File_Location === fileLocation)
                    setWarning("Do you want to save with same file location?");
                else handleConfirm();
            } else
                dispatch(
                    productActions.addProduct({
                        name,
                        fileLocation,
                        id: generateId(name, "p"),
                    })
                );
        }
    };

    return (
        <>
            {isAddingDuplicateProduct && <div>Adding duplicate product...</div>}
            {warning && (
                <div className={styles.modal}>
                    <div>{warning}</div>
                    <div className={styles.actions}>
                        <button onClick={() => setWarning(null)}>Cancel</button>
                        <button onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            )}
            <div
                aria-label="Product Form"
                className={`${styles.form} ${warning && styles.hidden}`}
            >
                <form>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>
                                        Name of the Product
                                        {error &&
                                            nameRef.current.value.trim() ===
                                                "" && (
                                                <span
                                                    className={
                                                        styles.requiredSymbol
                                                    }
                                                >
                                                    *
                                                </span>
                                            )}
                                    </th>
                                    <td className={styles.td}>
                                        <input
                                            ref={nameRef}
                                            className={styles.input}
                                            type="text"
                                            required
                                            defaultValue={
                                                product && product.product_name
                                            }
                                            onChange={() => setError("")} // Clear error on input change
                                        />
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className={styles.th}>
                                        File location
                                        {error &&
                                            fileLocationRef.current.value.trim() ===
                                                "" && (
                                                <span
                                                    className={
                                                        styles.requiredSymbol
                                                    }
                                                >
                                                    *
                                                </span>
                                            )}
                                    </th>
                                    <td className={styles.td}>
                                        <input
                                            ref={fileLocationRef}
                                            className={styles.input}
                                            type="text"
                                            required
                                            defaultValue={
                                                product && product.File_Location
                                            }
                                            onChange={() => setError("")}
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
                                {product ? "Duplicate" : "Save"}
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
        </>
    );
}

export default AddNewProduct;
