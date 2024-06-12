import React, { useState, useRef, useEffect } from "react";
import styles from "../product.module.css";
import { productActions } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import SpecificationDetails from "../newProduct/SpecificationDetails";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    deleteData,
    getData,
    queryClient,
    sendData,
} from "../../../utils/http";

const emptySpec = {
    name: "",
    unit: "",
    value: "",
};

const isParentOf = (items, subaassemblyId) =>
    Object.values(items).find((value) => value.parent === subaassemblyId);

function SubAssemblyDetails({ setWarningFor }) {
    const {
        id: productId,
        subassemblies,
        components,
        currActive: subassemblyId,
    } = useSelector((state) => state.product);
    const { name, isChildrenNeeded, fileLocation, isBoughtUp, parent } =
        subassemblies[subassemblyId];
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [secondaryFunctions, setSecondaryFunctions] = useState([]);
    const [specifications, setSpecifications] = useState([]); // State to store secondary functions
    const [selectedRowsState, setSelectedRowsState] = useState([]); // State to store selected row indices
    const [saveBtnClick, setSavebtnClick] = useState(
        fileLocation ? false : true
    ); // State to track save button click
    const nameRef = useRef();
    const isChildrenNeededRef = useRef();
    const [fileLocationInput, setFileLocationInput] = useState(fileLocation);
    const [isBoughtUpInput, setIsBoughtUpInput] = useState(isBoughtUp);
    const [mainFunction, setMainFunction] = useState("");
    const [toDeleteSecFns, setToDeleteSecFns] = useState([]);
    const [isFirstMount, setIsFirstMount] = useState(true);

    useEffect(() => {
        setWarningFor(null);
        setIsFirstMount(false);
    }, [setWarningFor]);

    const { data: subassemblyFetched, isFetching: isFetchingSubassembly } =
        useQuery({
            queryKey: ["subassembly", subassemblyId],
            queryFn: () =>
                getData(`subassemblies/${encodeURIComponent(subassemblyId)}`),
            enabled: isFirstMount && !fileLocation,
        });
    useEffect(() => {
        if (subassemblyFetched) {
            setFileLocationInput(subassemblyFetched.file_location);
            setIsBoughtUpInput(subassemblyFetched.bought_up);
            setMainFunction(subassemblyFetched.main_functions);
        }
    }, [subassemblyFetched]);

    const { data: secFnsFetched, isFetching: isFetchingSecFns } = useQuery({
        queryKey: ["subassemblySecondaryFunctions", subassemblyId],
        queryFn: () =>
            getData(
                `subassemblies/${encodeURIComponent(
                    subassemblyId
                )}/secondary-functions`
            ),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (secFnsFetched) setSecondaryFunctions(secFnsFetched);
    }, [secFnsFetched]);

    const { data: specsFetched, isFetching: isFetchingSpecs } = useQuery({
        queryKey: ["subassemblySpecifications", subassemblyId],
        queryFn: () =>
            getData(
                `subassemblies/${encodeURIComponent(
                    subassemblyId
                )}/specifications`
            ),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (specsFetched) setSpecifications(specsFetched);
    }, [specsFetched]);

    const { mutate: updateSubassembly, isPending: isUpdatingSubassembly } =
        useMutation({
            mutationFn: ({ updateRequestSubassemblyData, subassemblyId }) =>
                sendData(
                    `subassemblies/${encodeURIComponent(subassemblyId)}`,
                    "PUT",
                    updateRequestSubassemblyData
                ),
            onSuccess: (_, variables) => {
                dispatch(
                    productActions.addSubassemblyDetails({
                        name: nameRef.current.value,
                        isChildrenNeeded:
                            variables.updateRequestSubassemblyData
                                .toAddChildren,
                        target: variables.target,
                    })
                );
            },
        });

    const { mutate: addSubassembly, isPending: isAddingSubassembly } =
        useMutation({
            mutationFn: (addRequestSubassemblyData) =>
                sendData("subassemblies", "POST", addRequestSubassemblyData),
            onSuccess: (_, variables) => {
                dispatch(
                    productActions.addSubassemblyDetails({
                        name: nameRef.current.value,
                        isChildrenNeeded: variables.toAddChildren,
                    })
                );
                if (
                    parent.startsWith("s") &&
                    subassemblies[parent].isChildrenNeeded === "Yes"
                ) {
                    const updateRequestSubassemblyData = {
                        toAddChildren: "added",
                    };
                    updateSubassembly({
                        updateRequestSubassemblyData,
                        parent,
                        target: "subassembly parent",
                    });
                }
            },
        });

    const { mutate: addSecFn, isPending: isAddingSecFn } = useMutation({
        mutationFn: (addReqSecFnData) =>
            sendData(
                `subassemblies/${encodeURIComponent(
                    subassemblyId
                )}/secondary-functions`,
                "POST",
                addReqSecFnData
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subassemblySecondaryFunctions", subassemblyId],
            });
        },
    });

    const { mutate: updateSecFn, isPending: isUpdatingSecFn } = useMutation({
        mutationFn: ({ updateReqSecFnData, secondaryFunctionId }) => {
            return sendData(
                `subassemblies/${encodeURIComponent(
                    subassemblyId
                )}/secondary-functions/${encodeURIComponent(
                    secondaryFunctionId
                )}`,
                "PUT",
                updateReqSecFnData
            );
        },
    });

    const { mutate: deleteSecFn, isPending: isDeletingSecFn } = useMutation({
        mutationFn: (secondaryFunctionId) =>
            deleteData(
                `subassemblies/${encodeURIComponent(
                    subassemblyId
                )}/secondary-functions/${encodeURIComponent(
                    secondaryFunctionId
                )}`
            ),
    });

    const handleOpenSpecsForm = () => {
        setSpecifications([{ ...emptySpec }]);
    };

    const handleAddSecondary = () => {
        setSecondaryFunctions((prevState) => [
            ...prevState,
            { secondary_function: "" },
        ]); // Add a new empty secondary function to the state
    };

    const handleSecondaryFunctionsChange = (value, index) => {
        setSecondaryFunctions((prevState) => {
            const updatedSecondaryFunctions = prevState.map((obj) => ({
                ...obj,
            }));
            updatedSecondaryFunctions[index].secondary_function = value;
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
                        const subaassemblySecondaryFunctionId =
                            secondaryFunctions[index]
                                .subassembly_secondary_function_id;
                        subaassemblySecondaryFunctionId &&
                            setToDeleteSecFns((prevState) => [
                                ...prevState,
                                subaassemblySecondaryFunctionId,
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
        if (
            secondaryFunctions.some((sf) => sf.secondary_function.trim() === "")
        ) {
            errorMessage += "Please enter  all Secondary Functions.\n";
            isValid = false;
        }

        // Set error message
        setError(errorMessage);

        return isValid;
    };

    const handleSave = () => {
        // Perform validation
        if (validation()) {
            let toAddChildren = isChildrenNeededRef.current.value;
            if (isChildrenNeeded === "No" && toAddChildren === "Yes")
                toAddChildren =
                    isParentOf(subassemblies, subassemblyId) ||
                    isParentOf(components, subassemblyId)
                        ? "added"
                        : "Yes";
            const updateRequestSubassemblyData = {
                name: nameRef.current.value,
                fileLocation: fileLocationInput,
                boughtUp: isBoughtUpInput,
                toAddChildren,
                mainFunctions: mainFunction,
            };
            const addRequestSubassemblyData = {
                subassemblyId,
                productId,
                parentId: parent,
                ...updateRequestSubassemblyData,
            };
            fileLocation
                ? addSubassembly(addRequestSubassemblyData)
                : updateSubassembly({
                      updateRequestSubassemblyData,
                      subassemblyId,
                  });
            for (let secFn of secondaryFunctions) {
                const updateReqSecFnData = {
                    secondaryFunction: secFn.secondary_function,
                };
                const addReqSecFnData = {
                    ...updateReqSecFnData,
                };
                secFn.subassembly_secondary_function_id
                    ? updateSecFn({
                          updateReqSecFnData,
                          secondaryFunctionId:
                              secFn.subassembly_secondary_function_id,
                      })
                    : addSecFn(addReqSecFnData);
            }
            for (let subaassemblyId of toDeleteSecFns)
                deleteSecFn(subaassemblyId);
            setSavebtnClick(true);
        } else console.log("Validation failed");
    };

    return (
        <>
            {isFetchingSubassembly && <div>Loading subassembly...</div>}
            {isFetchingSecFns && <div>Loading secondary functions...</div>}
            {isFetchingSpecs && <div>Loading specifications...</div>}
            {isAddingSubassembly && <div>Adding subassembly...</div>}
            {isAddingSecFn && <div>Adding secondary function...</div>}
            {isUpdatingSubassembly && <div>Updating subassembly...</div>}
            {isUpdatingSecFn && <div>Updating secondary function...</div>}
            {isDeletingSecFn && <div>Deleting secondary function...</div>}
            <div aria-label="SubAssemblyAdded" className={styles.form}>
                <div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>
                                    Name of sub-assembly
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
                                            sub-assembly ID
                                        </th>
                                        <td className={styles.td}>
                                            {subassemblyId}
                                        </td>
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
                                            Is it completely bought up
                                        </th>
                                        <td className={styles.td}>
                                            <select
                                                className={styles.dropdown}
                                                name="isBoughtUp"
                                                value={isBoughtUpInput}
                                                onChange={(e) =>
                                                    setIsBoughtUpInput(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={styles.th}>
                                            Do you wish to add its
                                            subassemblies/components
                                            information?
                                        </th>
                                        <td className={styles.td}>
                                            <select
                                                className={styles.dropdown}
                                                name="isSubAssemblyComponentsNeeded"
                                                ref={isChildrenNeededRef}
                                                defaultValue={
                                                    isChildrenNeeded !== "No"
                                                        ? "Yes"
                                                        : "No"
                                                }
                                            >
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </select>
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
                                                        secondaryFunctionState.secondary_function
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
                        type="subAssembly"
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
        </>
    );
}

export default SubAssemblyDetails;
