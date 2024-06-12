import React, { useEffect, useRef, useState } from "react";
import SpecificationDetails from "./SpecificationDetails";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";
import {
    deleteData,
    getData,
    queryClient,
    sendData,
} from "../../../utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";

const emptySpec = {
    name: "",
    unit: "",
    value: "",
};

function ProductDetails({ setWarningFor }) {
    const {
        name,
        id: productId,
        fileLocation,
    } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [secondaryFunctions, setSecondaryFunctions] = useState([]); // State to store secondary functions
    const [specifications, setSpecifications] = useState([]); // State to store specifications
    const [selectedRowsState, setSelectedRowsState] = useState([]); // State to store selected row indices
    const [saveBtnClick, setSavebtnClick] = useState(
        fileLocation ? false : true
    ); // State to track save button click
    const nameRef = useRef();
    const [fileLocationInput, setFileLocationInput] = useState(fileLocation);
    const [mainFunction, setMainFunction] = useState("");
    const [toDeleteSecFns, setToDeleteSecFns] = useState([]);
    const [isFirstMount, setIsFirstMount] = useState(true);

    useEffect(() => {
        setWarningFor(null);
        setIsFirstMount(false);
    }, [setWarningFor]);

    const {
        data: productFetched,
        isFetching: isFetchingProduct,
        error: getProductError,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getData(`products/${encodeURIComponent(productId)}`),
        enabled: isFirstMount && !fileLocation,
    });
    useEffect(() => {
        if (productFetched) {
            setFileLocationInput(productFetched.file_location);
            setMainFunction(productFetched.main_functions);
        }
    }, [productFetched]);

    const { data: secFnsFetched, isFetching: isFetchingSecFns } = useQuery({
        queryKey: ["productSecondaryFunctions", productId],
        queryFn: () =>
            getData(
                `products/${encodeURIComponent(productId)}/secondary-functions`
            ),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (secFnsFetched) setSecondaryFunctions(secFnsFetched);
    }, [secFnsFetched]);

    const { data: specsFetched, isFetching: isFetchingSpecs } = useQuery({
        queryKey: ["productSpecifications", productId],
        queryFn: () =>
            getData(`products/${encodeURIComponent(productId)}/specifications`),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (specsFetched) setSpecifications(specsFetched);
    }, [specsFetched]);

    const {
        mutate: addProduct,
        isPending: isAddingProduct,
        error: addProductError,
    } = useMutation({
        mutationFn: (addRequestProductData) =>
            sendData("products", "POST", addRequestProductData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
            dispatch(
                productActions.addProductDetails({
                    name: nameRef.current.value,
                })
            );
            alert(`Saved successfully.`);
        },
    });

    const {
        mutate: updateProduct,
        isPending: isUpdatingProduct,
        error: updateProductError,
    } = useMutation({
        mutationFn: (updateRequestProductData) =>
            sendData(
                `products/${encodeURIComponent(productId)}`,
                "PUT",
                updateRequestProductData
            ),
        onSuccess: () => {
            // queryClient.invalidateQueries({
            //     queryKey: ["products"],
            // });
            dispatch(
                productActions.addProductDetails({
                    name: nameRef.current.value,
                })
            );
            alert("Updated successfully.");
        },
    });

    const { mutate: addSecFn, isPending: isAddingSecFn } = useMutation({
        mutationFn: (addReqSecFnData) =>
            sendData(
                `products/${encodeURIComponent(productId)}/secondary-functions`,
                "POST",
                addReqSecFnData
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["productSecondaryFunctions", productId],
            });
        },
    });

    const { mutate: updateSecFn, isPending: isUpdatingSecFn } = useMutation({
        mutationFn: ({ updateReqSecFnData, secondaryFunctionId }) =>
            sendData(
                `products/${encodeURIComponent(
                    productId
                )}/secondary-functions/${encodeURIComponent(
                    secondaryFunctionId
                )}`,
                "PUT",
                updateReqSecFnData
            ),
    });

    const { mutate: deleteSecFn, isPending: isDeletingSecFn } = useMutation({
        mutationFn: (secondaryFunctionId) =>
            deleteData(
                `products/${encodeURIComponent(
                    productId
                )}/secondary-functions/${encodeURIComponent(
                    secondaryFunctionId
                )}`
            ),
    });

    const handleOpenSpecsForm = () => {
        setSpecifications([{ ...emptySpec }]);
    };

    const handleAddSecondary = () => {
        setSecondaryFunctions((prevState) => [
            ...prevState,
            { secondary_function: "" },
        ]); // Add a new empty secondary function to the state
        setError("");
    };
    const handleSecondaryFunctionsChange = (value, index) => {
        setSecondaryFunctions((prevState) => {
            const updatedSecondaryFunctions = prevState.map((obj) => ({
                ...obj,
            }));
            updatedSecondaryFunctions[index].secondary_function = value;
            return updatedSecondaryFunctions;
        });
    };

    const handleDelete = () => {
        if (
            window.confirm(
                "Are you sure you want to delete selected/last secondary functions?"
            )
        ) {
            const selectedRows = selectedRowsState.length
                ? selectedRowsState
                : [secondaryFunctions.length - 1];
            setSecondaryFunctions((prevState) =>
                prevState.filter((_, index) => {
                    const selected = selectedRows.includes(index);
                    if (selected) {
                        const id =
                            secondaryFunctions[index]
                                .product_secondary_function_id;
                        id &&
                            setToDeleteSecFns((prevState) => [
                                ...prevState,
                                id,
                            ]);
                    }
                    return !selected;
                })
            );
            setSelectedRowsState([]);
            setError("");
        }
    };

    const toggleRowSelection = (selectedIndex) => {
        setSelectedRowsState((prevState) => {
            return prevState.includes(selectedIndex)
                ? prevState.filter((index) => index !== selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        // Check if mainFunction is empty
        if (mainFunction.trim() === "") {
            errorMessage += "* Please enter Main Function.\n";
            isValid = false;
        }

        // Check if Secondary Function is empty
        if (
            secondaryFunctions.some((sf) => sf.secondary_function.trim() === "")
        ) {
            errorMessage += "* Please enter all Secondary Functions.\n";
            isValid = false;
        }

        // Set error message
        setError(errorMessage);

        return isValid;
    };

    const handleSave = async () => {
        // Perform validation
        if (validation()) {
            const updateRequestProductData = {
                name: nameRef.current.value,
                fileLocation: fileLocationInput,
                mainFunctions: mainFunction,
            };
            const addRequestProductData = {
                productId,
                ...updateRequestProductData,
            };
            fileLocation
                ? addProduct(addRequestProductData)
                : updateProduct(updateRequestProductData);
            for (let secFn of secondaryFunctions) {
                const updateReqSecFnData = {
                    secondaryFunction: secFn.secondary_function,
                };
                const addReqSecFnData = {
                    ...updateReqSecFnData,
                };
                secFn.product_secondary_function_id
                    ? updateSecFn({
                          updateReqSecFnData,
                          secondaryFunctionId:
                              secFn.product_secondary_function_id,
                      })
                    : addSecFn(addReqSecFnData);
            }
            for (let id of toDeleteSecFns) deleteSecFn(id);
            setSavebtnClick(true);
        } else console.log("Validation failed");
    };

    return (
        <>
            {isFetchingProduct && <div>Loading product...</div>}
            {isFetchingSecFns && <div>Loading secondary functions...</div>}
            {isFetchingSpecs && <div>Loading specifications...</div>}
            {isAddingProduct && <div>Adding product...</div>}
            {isAddingSecFn && <div>Adding secondary function...</div>}
            {isUpdatingProduct && <div>Updating product...</div>}
            {isUpdatingSecFn && <div>Updating secondary function...</div>}
            {isDeletingSecFn && <div>Deleting secondary function...</div>}
            {addProductError && addProductError.message}
            {updateProductError && updateProductError.message}
            {getProductError && getProductError.message}
            <div aria-label="productAdded" className={styles.form}>
                <div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>
                                    Name of the Product
                                </th>
                                <td className={styles.td}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        defaultValue={name}
                                        ref={nameRef}
                                    />
                                </td>
                                <td>
                                    {saveBtnClick && (
                                        <button
                                            className={styles.btn}
                                            onClick={() =>
                                                setSavebtnClick(false)
                                            }
                                        >
                                            +
                                        </button>
                                    )}
                                </td>
                            </tr>
                            {!saveBtnClick && (
                                <>
                                    <tr>
                                        <th className={styles.th}>
                                            Product ID
                                        </th>
                                        <td className={styles.td}>
                                            {productId}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={styles.th}>
                                            File location
                                        </th>
                                        <td className={styles.td}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={fileLocationInput}
                                                onChange={(e) =>
                                                    setFileLocationInput(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={styles.th}>
                                            Main Functions
                                            {error &&
                                                mainFunction.trim() === "" && (
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
                                            <textarea
                                                className={styles.input}
                                                value={mainFunction}
                                                onChange={(e) => {
                                                    setMainFunction(
                                                        e.target.value
                                                    );
                                                    setError("");
                                                }}
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
                                {secondaryFunctions.map(
                                    (secondaryFunction, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                backgroundColor:
                                                    selectedRowsState.includes(
                                                        index
                                                    )
                                                        ? "lightgray"
                                                        : "white",
                                            }}
                                        >
                                            <th
                                                className={styles.th}
                                                onClick={() =>
                                                    toggleRowSelection(index)
                                                }
                                            >
                                                Secondary function {index + 1}
                                                {secondaryFunction.secondary_function.trim() ===
                                                    "" &&
                                                    error && (
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
                                                    type="text"
                                                    className={styles.input}
                                                    value={
                                                        secondaryFunction.secondary_function
                                                    }
                                                    onChange={(event) => {
                                                        handleSecondaryFunctionsChange(
                                                            event.target.value,
                                                            index
                                                        );
                                                        setError("");
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        )}
                    </table>
                    {!saveBtnClick && (
                        <div>
                            <button
                                className={styles.btn}
                                onClick={handleAddSecondary}
                            >
                                +
                            </button>

                            {secondaryFunctions.length ? (
                                <button
                                    className={styles.btn}
                                    onClick={handleDelete}
                                >
                                    -
                                </button>
                            ) : null}

                            <button
                                className={`${styles.savebtn} ${styles.btn}`}
                                onClick={handleSave}
                            >
                                {!fileLocation ? "Update" : "Save"}
                            </button>
                        </div>
                    )}
                </div>
                {error && (
                    <div className={styles.error}>
                        <pre>{error}</pre>
                    </div>
                )}
                {specifications.length ? (
                    <SpecificationDetails
                        specifications={specifications}
                        setSpecifications={setSpecifications}
                        key={JSON.stringify(specifications)}
                        emptySpec={emptySpec}
                    />
                ) : (
                    <div>
                        <button
                            className={`${styles.savebtn} ${styles.btn}`}
                            onClick={handleOpenSpecsForm}
                            disabled={fileLocation}
                        >
                            Add specification
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductDetails;
