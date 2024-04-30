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
    sub_assembly_specifications: "",
    sub_assembly_unit: "",
    sub_assembly_value: "",
};

const isParentOf = (items, id) =>
    Object.values(items).find((value) => value.parent === id);

function SubAssemblyDetails({ setWarningFor }) {
    const {
        id: productId,
        subassemblies,
        components,
        currActive: id,
    } = useSelector((state) => state.product);
    const { name, isChildrenNeeded, fileLocation, isBoughtUp, parent } =
        subassemblies[id];
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
    }, []);

    const { data: subassemblyFetched, isLoading: isFetchingSubassembly } =
        useQuery({
            queryKey: ["subassembly", id],
            queryFn: () =>
                getData(`/viewsubassembly/${encodeURIComponent(id)}`),
            enabled: isFirstMount && !fileLocation,
        });
    useEffect(() => {
        if (subassemblyFetched) {
            setFileLocationInput(subassemblyFetched.file_location);
            setMainFunction(subassemblyFetched.subassembly_main_func);
        }
    }, [subassemblyFetched]);

    const { data: secFnsFetched, isLoading: isFetchingSecFns } = useQuery({
        queryKey: ["subassemblySecFns", id],
        queryFn: () =>
            getData(`/viewsubassemblysecfn/${encodeURIComponent(id)}`),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (secFnsFetched) setSecondaryFunctions(secFnsFetched);
    }, [secFnsFetched]);

    const { data: specsFetched, isLoading: isFetchingSpecs } = useQuery({
        queryKey: ["subassemblySpecs", id],
        queryFn: () =>
            getData(`/viewsubassemblyspecifications/${encodeURIComponent(id)}`),
        enabled: !fileLocation,
    });
    useEffect(() => {
        if (specsFetched) setSpecifications(specsFetched);
    }, [specsFetched]);

    const { mutate: addSubassembly, isPending: isAddingSubassembly } =
        useMutation({
            mutationFn: (addRequestSubassemblyData) =>
                sendData("/addsubassembly", "POST", addRequestSubassemblyData),
            onSuccess: (_, variables) => {
                dispatch(
                    productActions.addSubassemblyDetails({
                        name: nameRef.current.value,
                        isChildrenNeeded: variables.to_add_assemblies,
                    })
                );
                if (
                    parent.startsWith("s") &&
                    subassemblies[parent].isChildrenNeeded === "Yes"
                ) {
                    const updateRequestSubassemblyData = {
                        to_add_assemblies: "added",
                    };
                    updateSubassembly({
                        updateRequestSubassemblyData,
                        parent,
                        target: "parent",
                    });
                }
            },
        });

    const { mutate: updateSubassembly, isPending: isUpdatingSubassembly } =
        useMutation({
            mutationFn: ({ updateRequestSubassemblyData, id }) =>
                sendData(
                    `/updatesubassembly/${encodeURIComponent(id)}`,
                    "PUT",
                    updateRequestSubassemblyData
                ),
            onSuccess: (_, variables) => {
                dispatch(
                    productActions.addSubassemblyDetails({
                        name: nameRef.current.value,
                        isChildrenNeeded:
                            variables.updateRequestSubassemblyData
                                .to_add_assemblies,
                        target: variables.target,
                    })
                );
            },
        });

    const { mutate: addSecFn, isPending: isAddingSecFn } = useMutation({
        mutationFn: (addReqSecFnData) =>
            sendData("/addsubassemblysecfn", "POST", addReqSecFnData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subassemblySecFns", id],
            });
        },
    });

    const { mutate: updateSecFn, isPending: isUpdatingSecFn } = useMutation({
        mutationFn: ({ updateReqSecFnData, secFnId }) => {
            return sendData(
                `/updatesubassemblysecfn/${encodeURIComponent(secFnId)}`,
                "PUT",
                updateReqSecFnData
            );
        },
    });

    const { mutate: deleteSecFn, isPending: isDeletingSecFn } = useMutation({
        mutationFn: (secFnId) =>
            deleteData(
                `/deletesubassemblysecfn/${encodeURIComponent(secFnId)}`
            ),
    });

    const handleOpenSpecsForm = () => {
        setSpecifications([{ ...emptySpec }]);
    };

    const handleAddSecondary = () => {
        setSecondaryFunctions((prevState) => [
            ...prevState,
            { sub_secondary_functions_details: "" },
        ]); // Add a new empty secondary function to the state
    };

    const handleSecondaryFunctionsChange = (value, index) => {
        setSecondaryFunctions((prevState) => {
            const updatedSecondaryFunctions = prevState.map((obj) => ({
                ...obj,
            }));
            updatedSecondaryFunctions[index].sub_secondary_functions_details =
                value;
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
                        const id =
                            secondaryFunctions[index].sub_sec_functions_id;
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
        if (mainFunction.trim() === "") {
            errorMessage += "Please enter Main Function.\n";
            isValid = false;
        }

        // Check if Secondary Function is empty
        if (
            secondaryFunctions.some(
                (sf) => sf.sub_secondary_functions_details.trim() === ""
            )
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
            let to_add_assemblies = isChildrenNeededRef.current.value;
            if (isChildrenNeeded === "No" && to_add_assemblies === "Yes")
                to_add_assemblies =
                    isParentOf(subassemblies, id) || isParentOf(components, id)
                        ? "added"
                        : "Yes";
            const updateRequestSubassemblyData = {
                subassembly_name: nameRef.current.value,
                file_location: fileLocationInput,
                subassembly_main_func: mainFunction,
                sub_assembly_bought_up: isBoughtUpInput,
                to_add_assemblies,
            };
            const addRequestSubassemblyData = {
                ...updateRequestSubassemblyData,
                sub_assembly_id: id,
                product_id: productId,
            };
            fileLocation
                ? addSubassembly(addRequestSubassemblyData)
                : updateSubassembly({
                      updateRequestSubassemblyData,
                      id,
                  });
            for (let secFn of secondaryFunctions) {
                const updateReqSecFnData = {
                    sub_secondary_functions_details:
                        secFn.sub_secondary_functions_details,
                };
                const addReqSecFnData = {
                    ...updateReqSecFnData,
                    sub_assembly_id: id,
                };
                secFn.sub_sec_functions_id
                    ? updateSecFn({
                          updateReqSecFnData,
                          secFnId: secFn.sub_sec_functions_id,
                      })
                    : addSecFn(addReqSecFnData);
            }
            for (let id of toDeleteSecFns) deleteSecFn(id);
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
                                                        secondaryFunctionState.sub_secondary_functions_details
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
