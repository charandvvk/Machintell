import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";
import {
    deleteData,
    getData,
    queryClient,
    sendData,
} from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";

const emptySpec = {
    product_specifications: "",
    product_unit: "",
    product_value: "",
};

function SpecificationDetails({ type, specifications }) {
    const [selectedRowsState, setSelectedRowsState] = useState([]); // State to store selected row indices
    const [error, seterror] = useState("");
    const dispatch = useDispatch();
    const product = useSelector((state) => state.product);
    const { subassemblies, currActive, id } = product;
    const initialSpecifications =
        type === "subAssembly" &&
        subassemblies[currActive].specifications.length
            ? subassemblies[currActive].specifications
            : [["", "", ""]];
    const [specificationsState, setSpecificationsState] = useState(
        type === "subAssembly" ? initialSpecifications : specifications
    );
    const [saveBtnClick, setSavebtnClick] = useState(
        specifications.length === 1 && !specifications[0].product_unit
            ? false
            : true
    ); // State to track save button click
    const [toDeleteSpecs, setToDeleteSpecs] = useState([]);

    const { mutate: addSpec, isPending: isAddingSpec } = useMutation({
        mutationFn: (addReqSpecData) =>
            sendData("/addproductspecs", "POST", addReqSpecData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["productSpecs", id],
            });
        },
    });

    const { mutate: updateSpec, isPending: isUpdatingSpec } = useMutation({
        mutationFn: ({ updateReqSpecData, specId }) => {
            return sendData(
                `/updateproductspecs/${encodeURIComponent(specId)}`,
                "PUT",
                updateReqSpecData
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["productSpecs", id],
            });
        },
    });

    const { mutate: deleteSpec, isPending: isDeletingSpec } = useMutation({
        mutationFn: (specId) =>
            deleteData(`/deleteproductspecs/${encodeURIComponent(specId)}`),
    });

    const handleInputChange = (value, rowIndex, cellIndex) => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => ({ ...specification })
            );
            let key = "product_specifications";
            if (cellIndex === 1) key = "product_unit";
            else if (cellIndex === 2) key = "product_value";
            updatedSpecificationsState[rowIndex][key] = value;
            return updatedSpecificationsState;
        });
    };

    const handleAddRow = () => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => ({ ...specification })
            );
            updatedSpecificationsState.push({ ...emptySpec });
            return updatedSpecificationsState;
        });
    };

    const handleDeleteRow = () => {
        const selectedRows = selectedRowsState.length
            ? selectedRowsState
            : [specificationsState.length - 1];
        setSpecificationsState((prevState) =>
            prevState.filter((_, index) => {
                const selected = selectedRows.includes(index);
                if (selected) {
                    const id = specificationsState[index].product_specs_id;
                    id && setToDeleteSpecs((prevState) => [...prevState, id]);
                }
                return !selected;
            })
        );
        setSelectedRowsState([]);
    };

    const toggleRowSelection = (selectedIndex) => {
        setSelectedRowsState((prevState) => {
            return prevState.includes(selectedIndex)
                ? prevState.filter((index) => index !== selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    const handleSave = async () => {
        if (validation()) {
            if (type === "product") {
                for (let spec of specificationsState) {
                    const updateReqSpecData = {
                        product_specs: spec.product_specifications,
                        product_unit: spec.product_unit,
                        product_value: spec.product_value,
                    };
                    const addReqSpecData = {
                        ...updateReqSpecData,
                        product_id: id,
                    };
                    spec.product_specs_id
                        ? updateSpec({
                              updateReqSpecData,
                              specId: spec.product_specs_id,
                          })
                        : addSpec(addReqSpecData);
                }
                for (let id of toDeleteSpecs) deleteSpec(id);
            } else
                dispatch(
                    productActions.addSubAssemblySpecifications(
                        specificationsState.map((specification) => [
                            ...specification,
                        ])
                    )
                );
            // dispatch(productActions.setCurrForm("DialogBox"));
            setSavebtnClick(true);
        } else {
            console.log("Validation Failed");
        }
    };
    const validation = () => {
        let isValid = true;
        let errorMessage = "";

        const iterableData = specificationsState.map((spec) => [
            spec.product_specifications,
            spec.product_unit,
            spec.product_value,
        ]);

        if (iterableData.some((row) => row.some((sp) => sp.trim() === ""))) {
            errorMessage += "Please enter all details.\n";
            isValid = false;
        }

        seterror(errorMessage);

        return isValid;
    };

    return (
        <div>
            {isAddingSpec && <div>Adding specification...</div>}
            {isUpdatingSpec && <div>Updating specification...</div>}
            {isDeletingSpec && <div>Deleting specification...</div>}
            <DynamicTable
                className="dynamic-table"
                headers={["S. No.", "Name", "Units", "Value"]}
                data={specificationsState}
                selectedRows={selectedRowsState}
                onDeleteRow={handleDeleteRow}
                onInputChange={handleInputChange}
                toggleRowSelection={toggleRowSelection}
                id={product.currActive}
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
                            {specifications.length === 1 &&
                            !specifications[0].product_unit
                                ? "Save"
                                : "Update"}
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
