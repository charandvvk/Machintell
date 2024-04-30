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
    product_specifications: "",
    product_unit: "",
    product_value: "",
};

function ProductDetails({ setWarningFor }) {
    const { name, id, fileLocation } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [secondaryFunctions, setSecondaryFunctions] = useState([]); // State to store secondary functions
    const [specifications, setSpecifications] = useState([]); // State to store secondary functions
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
    }, []);

    const { data: productFetched, isLoading: isFetchingProduct } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getData(`/viewproduct/${encodeURIComponent(id)}`),
        enabled: isFirstMount && !fileLocation,
    });
    useEffect(() => {
        if (productFetched) {
            setFileLocationInput(productFetched.File_Location);
            setMainFunction(productFetched.product_main_function);
        }
    }, [productFetched]);

    const { data: secFnsFetched, isLoading: isFetchingSecFns } = useQuery({
        queryKey: ["productSecFns", id],
        queryFn: () =>
            getData(`/viewproductsecondaryfn/${encodeURIComponent(id)}`),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (secFnsFetched) setSecondaryFunctions(secFnsFetched);
    }, [secFnsFetched]);

    const { data: specsFetched, isLoading: isFetchingSpecs } = useQuery({
        queryKey: ["productSpecs", id],
        queryFn: () => getData(`/viewproductspecs/${encodeURIComponent(id)}`),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (specsFetched) setSpecifications(specsFetched);
    }, [specsFetched]);

    const { mutate: addProduct, isPending: isAddingProduct } = useMutation({
        mutationFn: (addRequestProductData) =>
            sendData("/addproduct", "POST", addRequestProductData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
            dispatch(
                productActions.addProductDetails({
                    name: nameRef.current.value,
                })
            );
        },
    });

    const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation(
        {
            mutationFn: (updateRequestProductData) =>
                sendData(
                    `/updateproduct/${encodeURIComponent(id)}`,
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
            },
        }
    );

    const { mutate: addSecFn, isPending: isAddingSecFn } = useMutation({
        mutationFn: (addReqSecFnData) =>
            sendData("/addproductsecondaryfn", "POST", addReqSecFnData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["productSecFns", id],
            });
        },
    });

    const { mutate: updateSecFn, isPending: isUpdatingSecFn } = useMutation({
        mutationFn: ({ updateReqSecFnData, secFnId }) =>
            sendData(
                `/updateproductsecondaryfn/${encodeURIComponent(secFnId)}`,
                "PUT",
                updateReqSecFnData
            ),
    });

    const { mutate: deleteSecFn, isPending: isDeletingSecFn } = useMutation({
        mutationFn: (secFnId) =>
            deleteData(
                `/deleteproductsecondaryfn/${encodeURIComponent(secFnId)}`
            ),
    });

    const handleOpenSpecsForm = () => {
        setSpecifications([{ ...emptySpec }]);
    };

    const handleAddSecondary = () => {
        setSecondaryFunctions((prevState) => [
            ...prevState,
            { product_sec_fn: "" },
        ]); // Add a new empty secondary function to the state
    };
    const handleSecondaryFunctionsChange = (value, index) => {
        setSecondaryFunctions((prevState) => {
            const updatedSecondaryFunctions = prevState.map((obj) => ({
                ...obj,
            }));
            updatedSecondaryFunctions[index].product_sec_fn = value;
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
                        const id = secondaryFunctions[index].p_sec_fn_id;
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
            errorMessage += "Please enter Main Function.\n";
            isValid = false;
        }

        // Check if Secondary Function is empty
        if (secondaryFunctions.some((sf) => sf.product_sec_fn.trim() === "")) {
            errorMessage += "Please enter all Secondary Functions.\n";
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
                product_name: nameRef.current.value,
                File_Location: fileLocationInput,
                product_main_function: mainFunction,
            };
            const addRequestProductData = {
                ...updateRequestProductData,
                product_id: id,
            };
            fileLocation
                ? addProduct(addRequestProductData)
                : updateProduct(updateRequestProductData);
            for (let secFn of secondaryFunctions) {
                const updateReqSecFnData = {
                    product_sec_fn: secFn.product_sec_fn,
                };
                const addReqSecFnData = {
                    ...updateReqSecFnData,
                    product_id: id,
                };
                secFn.p_sec_fn_id
                    ? updateSecFn({
                          updateReqSecFnData,
                          secFnId: secFn.p_sec_fn_id,
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
                                        <td className={styles.td}>{id}</td>
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
                                        </th>
                                        <td className={styles.td}>
                                            <textarea
                                                className={styles.input}
                                                value={mainFunction}
                                                onChange={(e) =>
                                                    setMainFunction(
                                                        e.target.value
                                                    )
                                                }
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
                                    (secondaryFunctionState, index) => (
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
                                            </th>
                                            <td className={styles.td}>
                                                <input
                                                    type="text"
                                                    className={styles.input}
                                                    value={
                                                        secondaryFunctionState.product_sec_fn
                                                    }
                                                    onChange={(event) =>
                                                        handleSecondaryFunctionsChange(
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
