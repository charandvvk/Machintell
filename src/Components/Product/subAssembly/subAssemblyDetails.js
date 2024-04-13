import React, { useState, useRef } from "react";
import styles from "../product.module.css";
import { productActions } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import SpecificationDetails from "../newProduct/SpecificationDetails";

function SubAssemblyDetails() {
    const { subassemblies, currActive } = useSelector((state) => state.product);
    const {
        name,
        fileLocation,
        isBoughtUp,
        isChildrenNeeded,
        mainFunction,
        secondaryFunctions,
        specifications,
    } = subassemblies[currActive];
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [secondaryFunctionsState, setSecondaryFunctionsState] =
        useState(secondaryFunctions);
    const [selectedRows, setSelectedRows] = useState([]);
    const mainFunctionRef = useRef();
    const nameRef = useRef();
    const fileLocationRef = useRef();
    const isBoughtUpRef = useRef();
    const isChildrenNeededRef = useRef();
    const [saveBtnClick, setSavebtnClick] = useState(false); // State to track save button click
    const [isSpecsFormVisible, setIsSpecsFormVisbile] = useState(
        specifications.length
    );

    const handleOpenSpecsForm = () => {
        setIsSpecsFormVisbile(true);
    };

    const handleAddSecondary = () => {
        setSecondaryFunctionsState((prevState) => [...prevState, ""]); // Add a new empty secondary function to the state
    };

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
                    ? prevState.filter(
                          (_, index) => !selectedRows.includes(index)
                      )
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

    const handleSave = () => {
        console.log(
            "Saving data...",
            mainFunctionRef.current.value,
            secondaryFunctionsState
        );

        // Perform validation
        if (validation()) {
            dispatch(
                productActions.addSubassemblyDetails({
                    name: nameRef.current.value,
                    fileLocation: fileLocationRef.current.value,
                    mainFunction: mainFunctionRef.current.value,
                    isBoughtUp: isBoughtUpRef.current.value,
                    isChildrenNeeded: isChildrenNeededRef.current.value,
                    mainFunction: mainFunctionRef.current.value,
                    secondaryFunctions: [...secondaryFunctionsState],
                })
            );
            setSavebtnClick(true);
            // add subassembly details (main function) data to backend
            // add subassembly secondary functions data to backend
        } else {
            console.log("Validation failed");
        }
    };

    return (
        <div aria-label="SubAssemblyAdded" className={styles.form}>
            <div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Name of sub-assembly</th>
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
                                        onClick={() => setSavebtnClick(false)}
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
                                        sub-assembly ID
                                    </th>
                                    <td className={styles.td}>{currActive}</td>
                                </tr>
                                <tr>
                                    <th className={styles.th}>File location</th>
                                    <td className={styles.td}>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            defaultValue={fileLocation}
                                            ref={fileLocationRef}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className={styles.th}>
                                        Is it completely bought up
                                    </th>
                                    <td className={styles.td}>
                                        <select
                                            className={styles.dropdown}
                                            ref={isBoughtUpRef}
                                            defaultValue={isBoughtUp}
                                            name="isBoughtUp"
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th className={styles.th}>
                                        Do you wish to add its
                                        subassemblies/components information?
                                    </th>
                                    <td className={styles.td}>
                                        <select
                                            className={styles.dropdown}
                                            ref={isChildrenNeededRef}
                                            defaultValue={
                                                isChildrenNeeded !== "No"
                                                    ? "Yes"
                                                    : "No"
                                            }
                                            name="isSubAssemblyComponentsNeeded"
                                        >
                                            <option value="No">No</option>
                                            <option value="Yes">Yes</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th className={styles.th}>
                                        Main Functions{" "}
                                    </th>
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
                                                selectedRows.includes(index)
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
            {isSpecsFormVisible ? (
                <SpecificationDetails
                    type={"subAssembly"}
                    setIsSpecsFormVisbile={setIsSpecsFormVisbile}
                />
            ) : (
                <div>
                    <button
                        className={`${styles.savebtn} ${styles.btn}`}
                        onClick={handleOpenSpecsForm}
                    >
                        Add specification
                    </button>
                </div>
            )}
        </div>
    );
}

export default SubAssemblyDetails;
