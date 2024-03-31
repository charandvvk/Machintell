import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import generateId from "../../../util";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";

function AddComponents() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, seterror] = useState("");
    const dispatch = useDispatch();
    const { components, currActive } = useSelector((state) => state.product);
    let initialComponents = [["", "", "Yes", ""]];
    let currActivePos;
    if (currActive.startsWith("c")) {
        initialComponents = Object.entries(components)
            .filter(
                ([id, details]) =>
                    details.parent === components[currActive].parent
            )
            .map(([id, details], index) => {
                if (id === currActive) currActivePos = index;
                return [
                    details.name,
                    id,
                    details.isBoughtUp,
                    details.fileLocation,
                ];
            });
    }
    const [componentsState, setComponentsState] = useState(initialComponents);

    const handleInputChange = (value, rowIndex, cellIndex) => {
        setComponentsState((prevState) => {
            const updatedComponentsState = prevState.map((component) => [
                ...component,
            ]);
            updatedComponentsState[rowIndex][cellIndex] = value;
            return updatedComponentsState;
        });
    };

    const handleAddRow = () => {
        setComponentsState((prevState) => {
            const updatedComponentsState = prevState.map((component) => [
                ...component,
            ]);
            updatedComponentsState.push(["", "", "", ""]);
            return updatedComponentsState;
        });
    };

    const handleDeleteRow = () => {
        setComponentsState((prevState) => {
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

    const handleSave = () => {
        if (!currActive.startsWith("c")) {
            if (validation()) {
                console.log("saved", componentsState);
                //send components data to the backend
                dispatch(
                    productActions.addComponents(
                        componentsState.map((component) => [...component])
                    )
                );
            } else {
                console.log("Validation Failed");
            }
        }
    };

    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        if (
            componentsState.some((row) =>
                row.some((cell, index) => index !== 2 && cell.trim() === "")
            )
        ) {
            errorMessage += "Please enter all details.\n";
            isValid = false;
        }

        seterror(errorMessage);

        return isValid;
    };

    const handleInputBlur = (value, rowIndex, cellIndex) => {
        if (cellIndex === 0) {
            setComponentsState((prevState) => {
                const updatedComponentsState = prevState.map((component) => [
                    ...component,
                ]);
                updatedComponentsState[rowIndex][cellIndex + 1] = generateId(
                    value,
                    "c"
                );
                return updatedComponentsState;
            });
        }
    };

    return (
        <div>
            <DynamicTable
                className="dynamic-table"
                headers={["Item name", "UID", "Bought-up", "File Location"]}
                data={componentsState}
                selectedRows={selectedRows}
                onRowSelection={(index) => setSelectedRows([index])}
                onDeleteRow={handleDeleteRow}
                onInputChange={handleInputChange}
                onInputBlur={handleInputBlur}
                toggleRowSelection={toggleRowSelection}
                currActive={currActive}
                currActivePos={currActivePos}
            />

            <div className={styles.buttonGroup}>
                {!currActive.startsWith("c") && (
                    <>
                        <div>
                            <button
                                className={styles.btn2}
                                onClick={handleAddRow}
                            >
                                Add Component
                            </button>
                        </div>
                        <div>
                            <button
                                className={styles.btn2}
                                onClick={handleDeleteRow}
                            >
                                Delete Component
                            </button>
                        </div>
                    </>
                )}
                <div>
                    <button className={styles.btn2} onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default AddComponents;
