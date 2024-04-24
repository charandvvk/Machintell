import React, { useEffect, useRef, useState } from "react";
import SpecificationDetails from "./SpecificationDetails";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";
import { deleteData, getData, sendData } from "../../../utils/http";

const getProductSecFns = async (id, setSecondaryFunctionsState) => {
    try {
        const data = await getData(
            `/viewproductsecondaryfn/${encodeURIComponent(id)}`
        );
        setSecondaryFunctionsState(data);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const getProductSpecs = async (id, setSpecifications) => {
    try {
        const data = await getData(
            `/viewproductspecs/${encodeURIComponent(id)}`
        );
        setSpecifications(data);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

const emptySpec = {
    product_specifications: "",
    product_unit: "",
    product_value: "",
};

function ProductDetails({ setWarningFor }) {
    const { name, id, fileLocation } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [secondaryFunctionsState, setSecondaryFunctionsState] = useState([]); // State to store secondary functions
    const [specifications, setSpecifications] = useState([]); // State to store secondary functions
    const [selectedRowsState, setSelectedRowsState] = useState([]); // State to store selected row indices
    const [saveBtnClick, setSavebtnClick] = useState(
        fileLocation ? false : true
    ); // State to track save button click
    const nameRef = useRef();
    const [fileLocationState, setFileLocationState] = useState(fileLocation);
    const [mainFunctionState, setMainFunctionState] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toDeleteSecFns, setToDeleteSecFns] = useState([]);

    useEffect(() => {
        setWarningFor(null);
        const getProduct = async () => {
            setIsLoading(true);
            try {
                const data = await getData(
                    `/viewproduct/${encodeURIComponent(id)}`
                );
                setFileLocationState(data.File_Location);
                setMainFunctionState(data.product_main_function);
            } catch (error) {
                console.error("Error:", error.message);
            }
            await getProductSecFns(id, setSecondaryFunctionsState);
            await getProductSpecs(id, setSpecifications);
            setIsLoading(false);
        };
        if (!fileLocation) getProduct();
    }, []);

    const handleOpenSpecsForm = () => {
        setSpecifications([{ ...emptySpec }]);
    };

    const handleAddSecondary = () => {
        setSecondaryFunctionsState((prevState) => [
            ...prevState,
            { product_sec_fn: "" },
        ]); // Add a new empty secondary function to the state
    };
    const handleSecondaryFunctionsStateChange = (value, index) => {
        setSecondaryFunctionsState((prevState) => {
            const updatedSecondaryFunctionsState = prevState.map((obj) => ({
                ...obj,
            }));
            updatedSecondaryFunctionsState[index].product_sec_fn = value;
            return updatedSecondaryFunctionsState;
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
                : [secondaryFunctionsState.length - 1];
            setSecondaryFunctionsState((prevState) =>
                prevState.filter((_, index) => {
                    const selected = selectedRows.includes(index);
                    if (selected) {
                        const id = secondaryFunctionsState[index].p_sec_fn_id;
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
        if (mainFunctionState.trim() === "") {
            errorMessage += "Please enter Main Function.\n";
            isValid = false;
        }

        // Check if Secondary Function is empty
        if (
            secondaryFunctionsState.some(
                (sf) => sf.product_sec_fn.trim() === ""
            )
        ) {
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
                File_Location: fileLocationState,
                product_main_function: mainFunctionState,
            };
            const addRequestProductData = {
                ...updateRequestProductData,
                product_id: id,
            };
            try {
                if (fileLocation) {
                    const { message, data } = await sendData(
                        "/addproduct",
                        "POST",
                        addRequestProductData
                    );
                    dispatch(productActions.setHasProducts(true));
                } else {
                    const { message, data } = await sendData(
                        `/updateproduct/${encodeURIComponent(id)}`,
                        "PUT",
                        updateRequestProductData
                    );
                }
                dispatch(
                    productActions.addProductDetails({
                        name: nameRef.current.value,
                    })
                );
            } catch (error) {
                console.error("Error:", error.message);
            }
            for (let secFn of secondaryFunctionsState) {
                const updateReqProdSecFnData = {
                    product_sec_fn: secFn.product_sec_fn,
                };
                const addReqProdSecFnData = {
                    ...updateReqProdSecFnData,
                    product_id: id,
                };
                try {
                    if (secFn.p_sec_fn_id) {
                        const { message, data } = await sendData(
                            `/updateproductsecondaryfn/${encodeURIComponent(
                                secFn.p_sec_fn_id
                            )}`,
                            "PUT",
                            updateReqProdSecFnData
                        );
                    } else {
                        const { message, data } = await sendData(
                            "/addproductsecondaryfn",
                            "POST",
                            addReqProdSecFnData
                        );
                    }
                } catch (error) {
                    console.error("Error:", error.message);
                }
            }
            for (let id of toDeleteSecFns) {
                try {
                    const { message, data } = await deleteData(
                        `/deleteproductsecondaryfn/${encodeURIComponent(id)}`
                    );
                } catch (error) {
                    console.error("Error:", error.message);
                }
            }
            await getProductSecFns(id, setSecondaryFunctionsState);
            setSavebtnClick(true);
        } else {
            console.log("Validation failed");
        }
    };

    return (
        <>
            {isLoading ? (
                "Loading product details..."
            ) : (
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
                                                    value={fileLocationState}
                                                    onChange={(e) =>
                                                        setFileLocationState(
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
                                                    value={mainFunctionState}
                                                    onChange={(e) =>
                                                        setMainFunctionState(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th
                                                className={styles.th}
                                                colSpan="2"
                                            >
                                                Add secondary function
                                            </th>
                                        </tr>
                                    </>
                                )}
                            </thead>
                            {!saveBtnClick && (
                                <tbody>
                                    {secondaryFunctionsState.map(
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
                                                        toggleRowSelection(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Secondary function{" "}
                                                    {index + 1}
                                                </th>
                                                <td className={styles.td}>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        value={
                                                            secondaryFunctionState.product_sec_fn
                                                        }
                                                        onChange={(event) =>
                                                            handleSecondaryFunctionsStateChange(
                                                                event.target
                                                                    .value,
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

                                {secondaryFunctionsState.length ? (
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
                            type="product"
                            setSpecifications={setSpecifications}
                            specifications={specifications}
                            key={JSON.stringify(specifications)}
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
            )}
        </>
    );
}

export default ProductDetails;
