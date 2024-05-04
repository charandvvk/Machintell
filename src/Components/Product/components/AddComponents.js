import React, { useEffect, useState } from "react";
import DynamicTable from "./DynamicTable";
import styles from "../product.module.css";
import generateId from "../../../utils/generateId";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../../store";
import { getData, sendData } from "../../../utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";

const emptyComponent = ["", "", "Yes", ""];

function AddComponents({ setWarningFor }) {
    const [selectedRows, setSelectedRows] = useState([]);
    const [error, seterror] = useState("");
    const dispatch = useDispatch();
    const { components, currActive, subassemblies, id } = useSelector(
        (state) => state.product
    );
    const [currActivePos, setCurrActivePos] = useState();
    const [componentsState, setComponentsState] = useState([
        [...emptyComponent],
    ]);
    const parentId = currActive.startsWith("c")
        ? components[currActive].parent
        : null;

    const { data: componentsFetched, isLoading: isFetchingComponents } =
        useQuery({
            queryKey: ["components", parentId],
            queryFn: () =>
                getData(`/viewcomponents/${encodeURIComponent(parentId)}`),
            enabled: currActive.startsWith("c"),
        });
    useEffect(() => {
        if (componentsFetched) {
            setComponentsState(
                componentsFetched.map((component, index) => {
                    if (component.comp_id === currActive)
                        setCurrActivePos(index);
                    return [
                        component.item_name,
                        component.comp_id,
                        component.bought_up,
                        component.comp_file_location,
                    ];
                })
            );
        }
    }, [componentsFetched, currActive]);

    const { mutate: updateSubassembly, isPending: isUpdatingSubassembly } =
        useMutation({
            mutationFn: (updateRequestSubassemblyData) =>
                sendData(
                    `/updatesubassembly/${encodeURIComponent(currActive)}`,
                    "PUT",
                    updateRequestSubassemblyData
                ),
            onSuccess: () => {
                dispatch(
                    productActions.addSubassemblyDetails({
                        target: "component parent",
                    })
                );
            },
        });

    const { mutate: addComponent, isPending: isAddingComponent } = useMutation({
        mutationFn: (addReqComponentData) =>
            sendData("/addcomponents", "POST", addReqComponentData),
        onSuccess: (_, variables) => {
            dispatch(
                productActions.addComponent({
                    id: variables.comp_id,
                    name: variables.item_name,
                })
            );
            if (
                currActive.startsWith("s") &&
                subassemblies[currActive].isChildrenNeeded === "Yes"
            ) {
                const updateRequestSubassemblyData = {
                    to_add_assemblies: "added",
                };
                updateSubassembly(updateRequestSubassemblyData);
            }
        },
    });

    const { mutate: updateComponent, isPending: isUpdatingComponent } =
        useMutation({
            mutationFn: (updateReqComponentData) =>
                sendData(
                    `/updatecomponents/${encodeURIComponent(currActive)}`,
                    "PUT",
                    updateReqComponentData
                ),
            onSuccess: (_, variables) => {
                dispatch(
                    productActions.addComponent({
                        id: variables.comp_id,
                        name: variables.item_name,
                    })
                );
            },
        });

    useEffect(() => {
        setWarningFor(null);
    }, [setWarningFor]);

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
            updatedComponentsState.push([...emptyComponent]);
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
                ? prevState.filter((index) => index !== selectedIndex)
                : [...prevState, selectedIndex];
        });
    };

    const handleSave = () => {
        if (validation()) {
            if (currActive.startsWith("c")) {
                const component = componentsState[currActivePos];
                const updateReqComponentData = {
                    item_name: component[0],
                    bought_up: component[2],
                    comp_file_location: component[3],
                };
                updateComponent(updateReqComponentData);
            } else {
                for (let component of componentsState) {
                    const addReqComponentData = {
                        item_name: component[0],
                        comp_id: component[1],
                        bought_up: component[2],
                        comp_file_location: component[3],
                        parent_id: currActive,
                        product_id: id,
                    };
                    addComponent(addReqComponentData);
                }
                setComponentsState([[...emptyComponent]]);
            }
        } else console.log("Validation Failed");
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
        setComponentsState((prevState) => {
            if (prevState[rowIndex][cellIndex + 1]) return prevState;
            const updatedComponentsState = prevState.map((component) => [
                ...component,
            ]);
            updatedComponentsState[rowIndex][cellIndex + 1] = generateId(
                value,
                "c"
            );
            return updatedComponentsState;
        });
    };

    return (
        <div>
            {isFetchingComponents && "Loading components..."}
            {isAddingComponent && "Adding component..."}
            {isUpdatingComponent && "Updating component..."}
            {isUpdatingSubassembly && "Updating subassembly..."}
            <DynamicTable
                className="dynamic-table"
                headers={[
                    "S. No.",
                    "Item name",
                    "UID",
                    "Bought-up",
                    "File Location",
                ]}
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
                        <button className={styles.btn} onClick={handleAddRow}>
                            +
                        </button>
                        {componentsState.length ? (
                            <button
                                className={styles.btn}
                                onClick={handleDeleteRow}
                            >
                                -
                            </button>
                        ) : null}
                    </>
                )}
                <button
                    className={`${styles.btn} ${styles.savebtn} `}
                    onClick={handleSave}
                >
                    {currActive.startsWith("c") ? "Update" : "Save"}
                </button>
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
