import React, { useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import { useSelector } from "react-redux";
import { deleteData, queryClient, sendData } from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";

const makeDataIterable = (specifications, typeProduct) => {
    return specifications.map((spec) =>
        typeProduct
            ? [
                  spec.product_specifications,
                  spec.product_unit,
                  spec.product_value,
              ]
            : [
                  spec.sub_assembly_specifications,
                  spec.sub_assembly_unit,
                  spec.sub_assembly_value,
              ]
    );
};

function SpecificationDetails({
    specifications,
    setSpecifications,
    emptySpec,
}) {
    const [selectedRowsState, setSelectedRowsState] = useState([]); // State to store selected row indices
    const [error, seterror] = useState("");
    const { currActive } = useSelector((state) => state.product);
    const typeProduct = currActive.startsWith("p");
    const [specificationsState, setSpecificationsState] =
        useState(specifications);
    const [saveBtnClick, setSavebtnClick] = useState(
        specifications.length === 1 &&
            !specifications[0].product_unit &&
            !specifications[0].sub_assembly_unit
            ? false
            : true
    ); // State to track save button click
    const [toDeleteSpecs, setToDeleteSpecs] = useState([]);

    const { mutate: addSpec, isPending: isAddingSpec } = useMutation({
        mutationFn: (addReqSpecData) =>
            sendData(
                `/${
                    typeProduct
                        ? "addproductspecs"
                        : "addsubassemblyspecifications"
                }`,
                "POST",
                addReqSpecData
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    typeProduct ? "productSpecs" : "subassemblySpecs",
                    currActive,
                ],
            });
        },
    });

    const { mutate: updateSpec, isPending: isUpdatingSpec } = useMutation({
        mutationFn: ({ updateReqSpecData, specId }) =>
            sendData(
                `/${
                    typeProduct
                        ? "updateproductspecs"
                        : "updatesubassemblyspecifications"
                }/${encodeURIComponent(specId)}`,
                "PUT",
                updateReqSpecData
            ),
    });

    const { mutate: deleteSpec, isPending: isDeletingSpec } = useMutation({
        mutationFn: (specId) =>
            deleteData(
                `/${
                    typeProduct
                        ? "deleteproductspecs"
                        : "deletesubassemblyspecifications"
                }/${encodeURIComponent(specId)}`
            ),
    });

    const handleInputChange = (value, rowIndex, cellIndex) => {
        setSpecificationsState((prevState) => {
            const updatedSpecificationsState = prevState.map(
                (specification) => ({ ...specification })
            );
            let key = typeProduct ? "product" : "sub_assembly";
            if (!cellIndex) key += "_specifications";
            else if (cellIndex === 1) key += "_unit";
            else key += "_value";
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
                    const id =
                        specificationsState[index][
                            typeProduct
                                ? "product_specs_id"
                                : "sub_assembly_specs_id"
                        ];
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

    const validation = () => {
        let isValid = true;
        let errorMessage = "";
        if (
            makeDataIterable(specificationsState, typeProduct).some((row) =>
                row.some((sp) => sp.trim() === "")
            )
        ) {
            errorMessage += "Please enter all details.\n";
            isValid = false;
        }
        seterror(errorMessage);
        return isValid;
    };

    const handleSave = async () => {
        if (validation()) {
            for (let spec of specificationsState) {
                const type = typeProduct ? "product" : "sub_assembly";
                const updateReqSpecData = {
                    [`${type}_specs`]: spec[`${type}_specifications`],
                    [`${type}_unit`]: spec[`${type}_unit`],
                    [`${type}_value`]: spec[`${type}_value`],
                };
                const addReqSpecData = {
                    ...updateReqSpecData,
                    [`${type}_id`]: currActive,
                };
                spec[`${type}_specs_id`]
                    ? updateSpec({
                          updateReqSpecData,
                          specId: spec[`${type}_specs_id`],
                      })
                    : addSpec(addReqSpecData);
            }
            for (let id of toDeleteSpecs) deleteSpec(id);
            // dispatch(productActions.setCurrForm("DialogBox"));
            if (!specificationsState.length) setSpecifications([]);
            setSavebtnClick(true);
        } else {
            console.log("Validation Failed");
        }
    };

    return (
        <div>
            {isAddingSpec && <div>Adding specification...</div>}
            {isUpdatingSpec && <div>Updating specification...</div>}
            {isDeletingSpec && <div>Deleting specification...</div>}
            <DynamicTable
                className="dynamic-table"
                headers={["S. No.", "Name", "Units", "Value"]}
                specifications={specificationsState}
                selectedRows={selectedRowsState}
                onDeleteRow={handleDeleteRow}
                onInputChange={handleInputChange}
                toggleRowSelection={toggleRowSelection}
                id={currActive}
                saveBtnClick={saveBtnClick}
                setSavebtnClick={setSavebtnClick}
                makeDataIterable={makeDataIterable}
                typeProduct={typeProduct}
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
                            !specifications[0].product_unit &&
                            !specifications[0].sub_assembly_unit
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
