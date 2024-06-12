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
    const parent = parentId
        ? parentId.startsWith("p")
            ? "products"
            : "subassemblies"
        : null;

    const { data: componentsFetched, isFetching: isFetchingComponents } =
        useQuery({
            queryKey: ["components", parentId],
            queryFn: () =>
                getData(`${parent}/${encodeURIComponent(parentId)}/components`),
            enabled: currActive.startsWith("c"),
        });
    useEffect(() => {
        if (componentsFetched) {
            setComponentsState(
                componentsFetched.map((component, index) => {
                    const componentIdKey = `${
                        parentId.startsWith("p") ? "product" : "subassembly"
                    }_component_id`;
                    if (component[componentIdKey] === currActive)
                        setCurrActivePos(index);
                    return [
                        component.name,
                        component[componentIdKey],
                        component.bought_up,
                        component.file_location,
                    ];
                })
            );
        }
    }, [componentsFetched, currActive, parentId]);

    const { mutate: updateSubassembly, isPending: isUpdatingSubassembly } =
        useMutation({
            mutationFn: (updateRequestSubassemblyData) =>
                sendData(
                    `subassemblies/${encodeURIComponent(currActive)}`,
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
            sendData(
                `${
                    currActive.startsWith("p") ? "products" : "subassemblies"
                }/${encodeURIComponent(currActive)}/components`,
                "POST",
                addReqComponentData
            ),
        onSuccess: (_, variables) => {
            dispatch(
                productActions.addComponent({
                    id: variables.componentId,
                    name: variables.name,
                })
            );
            if (
                currActive.startsWith("s") &&
                subassemblies[currActive].isChildrenNeeded === "Yes"
            ) {
                const updateRequestSubassemblyData = {
                    toAddChildren: "added",
                };
                updateSubassembly(updateRequestSubassemblyData);
            }
        },
    });

    const { mutate: updateComponent, isPending: isUpdatingComponent } =
        useMutation({
            mutationFn: (updateReqComponentData) =>
                sendData(
                    `${parent}/${encodeURIComponent(
                        parentId
                    )}/components/${encodeURIComponent(currActive)}`,
                    "PUT",
                    updateReqComponentData
                ),
            onSuccess: (_, variables) => {
                dispatch(
                    productActions.addComponent({
                        id: variables.componentId,
                        name: variables.name,
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
                    name: component[0],
                    boughtUp: component[2],
                    fileLocation: component[3],
                };
                updateComponent(updateReqComponentData);
            } else {
                for (let component of componentsState) {
                    const addReqComponentData = {
                        componentId: component[1],
                        productId: id,
                        name: component[0],
                        boughtUp: component[2],
                        fileLocation: component[3],
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
