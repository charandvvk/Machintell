import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import generateId from "../../../util";
import { useDispatch } from "react-redux";
import { productActions } from "../../../store";

function AddComponents() {
    const dispatch = useDispatch();
    const [components, setComponents] = useState([
        [
            { value: "", type: "input" },
            { value: "", type: "input" },
            {
                value: "Yes",
                type: "select",
            },
            { value: "", type: "input" },
        ],
    ]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, seterror] = useState("");

    const handleAddSpecification = () => {
        setComponents([
            ...components,
            [
                { value: "", type: "input" },
                { value: "", type: "input" },
                {
                    value: "Yes",
                    type: "select",
                },
                { value: "", type: "input" },
            ],
        ]);
    };

    const handleDeleteRow = (index) => {
        const updatedSpecifications = [...components];
        updatedSpecifications.splice(index, 1);
        setComponents(updatedSpecifications);
        setSelectedRows([]);
    };

    const handleSave = () => {
        const allSpecifications = components.map((row) =>
            row.map((cell) => cell.value)
        );

        // Log or process the collected data
        console.log("All Specifications:", allSpecifications);

        if (true) {
            console.log("saved");
            dispatch(productActions.addComponents(components));
        } else {
            console.log("Validation Failed");
        }
    };
    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        if (
            components.some((row) => row.some((sp) => sp.value.trim() === ""))
        ) {
            errorMessage += "Please enter all Specifications.\n";
            isValid = false;
        }

        seterror(errorMessage);

        return isValid;
    };

    const handleInputChange = (event, rowIndex, cellIndex) => {
        // console.log(event.target.value)
        const updatedComponents = [...components];
        updatedComponents[rowIndex][cellIndex].value = event.target.value; // Update the 'value' property
        setComponents(updatedComponents);
    };
    const handleInputBlur = (event, rowIndex, cellIndex) => {
        console.log(event.target.value, cellIndex);
        if (cellIndex === 0) {
            const updatedComponents = [...components];
            updatedComponents[rowIndex][cellIndex + 1].value = generateId(
                event.target.value,
                "c"
            ); // Update the 'value' property
            setComponents(updatedComponents);
        }
    };
    return (
        <div>
            <DynamicTable
                className="dynamic-table"
                headers={["Item name", "UID", "Bought-up", "File Location"]}
                data={components}
                selectedRows={selectedRows}
                onRowSelection={(index) => setSelectedRows([index])}
                onDeleteRow={handleDeleteRow}
                onInputChange={handleInputChange}
                onInputBlur={handleInputBlur}
            />
            <div className={styles.buttonGroup}>
                <div>
                    <button
                        className={styles.btn2}
                        onClick={handleAddSpecification}
                    >
                        Add Component
                    </button>
                </div>
                <div>
                    <button className={styles.btn2} onClick={handleDeleteRow}>
                        Delete Component
                    </button>
                </div>
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
