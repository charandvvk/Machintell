import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";

function SpecificationDetails({ type, setIsSpecsFormVisbile }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, seterror] = useState("");
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product);
    const specifications =
        type === "product"
            ? product.specifications.length
                ? product.specifications
                : [["", "", ""]]
            : product.subassemblies[product.currActive]?.specifications || [
                  ["", "", ""],
              ];
    const [specificationsState, setSpecificationsState] =
        useState(specifications);
    const [saveBtnClick, setSavebtnClick] = useState(false); // State to track save button click

    const handleInputChange = (value, rowIndex, cellIndex) => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => [...specification]
            );
            updatedSpecificationsState[rowIndex][cellIndex] = value;
            return updatedSpecificationsState;
        });
    };

    const handleAddRow = () => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => [...specification]
            );
            updatedSpecificationsState.push(["", "", ""]);
            return updatedSpecificationsState;
        });
    };

    const handleDeleteRow = () => {
        setSpecificationsState((prevState) => {
            return selectedRows.length
                ? prevState.filter((_, index) => !selectedRows.includes(index))
                : prevState.slice(0, -1);
        });
        setSelectedRows([]);
    };

    const toggleRowSelection = (selectedIndex) => {
        setSelectedRows((prevState) => {
            return prevState.includes(selectedIndex)
                ? prevState.filter((index) => index !== selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    const handleSave = () => {
        if (validation()) {
            console.log("saved");
            if (type === "product") {
                dispatch(
                    productActions.addProductSpecifications(
                        specificationsState.map((specification) => [
                            ...specification,
                        ])
                    )
                );
            } else {
                dispatch(
                    productActions.addSubAssemblySpecifications(
                        specificationsState.map((specification) => [
                            ...specification,
                        ])
                    )
                );
            }
            // dispatch(productActions.setCurrForm("DialogBox"));
            setSavebtnClick(true);
            if (!specificationsState.length) setIsSpecsFormVisbile(false);
        } else {
            console.log("Validation Failed");
        }
    };
    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        if (
            specificationsState.some((row) =>
                row.some((sp) => sp.trim() === "")
            )
        ) {
            errorMessage += "Please enter all details.\n";
            isValid = false;
        }

        seterror(errorMessage);

        return isValid;
    };

    return (
        <div>
            <DynamicTable
                className="dynamic-table"
                headers={["Name", "Units", "Value"]}
                data={specificationsState}
                selectedRows={selectedRows}
                onRowSelection={(index) => setSelectedRows([index])}
                onDeleteRow={handleDeleteRow}
                onInputChange={handleInputChange}
                toggleRowSelection={toggleRowSelection}
                id={product.id}
                saveBtnClick={saveBtnClick}
                setSavebtnClick={setSavebtnClick}
            />
            {!saveBtnClick && (
                <>
                    <div>
                        <button className={styles.btn} onClick={handleAddRow}>
                            +
                        </button>
                        {specificationsState.length ? (
                            <button
                                className={styles.btn}
                                onClick={handleDeleteRow}
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
                    {error && (
                        <div className={styles.error}>
                            <pre>{error}</pre>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SpecificationDetails;
