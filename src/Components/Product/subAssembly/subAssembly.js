import React, { useEffect, useRef, useState } from "react";
import styles from "../product.module.css";
import { useDispatch } from "react-redux";
import { productActions } from "../../../store";
import generateId from "../../../util";

const SubAssembly = () => {
    const nameRef = useRef();
    const fileLocationRef = useRef();
    const isBoughtUpRef = useRef();
    const isChildrenNeededRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productActions.addSubassemblyPlaceholderParent());
    }, [dispatch]);

    const validation = () => {
        if (nameRef.current.value.trim() === "") {
            console.log("SubAssembly name is empty");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (validation()) {
            console.log("Saving data...");
            // add subassembly data to backend
            dispatch(
                productActions.addSubassembly({
                    name: nameRef.current.value,
                    fileLocation: fileLocationRef.current.value,
                    id: generateId(nameRef.current.value, "s"),
                    isChildrenNeeded: isChildrenNeededRef.current.value,
                    isBoughtUp: isBoughtUpRef.current.value,
                })
            );
        } else {
            console.log("Please enter subAssembly name");
        }
    };

    return (
        <div aria-label="MainFunction" className={styles.form}>
            <form>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Name of sub-assembly</th>
                            <td className={styles.td}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="SubAssemblyName"
                                    required
                                    ref={nameRef}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th className={styles.th}>File location</th>
                            <td className={styles.td}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="fileLocation"
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
                                    name="isBoughtUp"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.th}>
                                Do you wish to add its subassemblies/components
                                information?
                            </th>
                            <td className={styles.td}>
                                <select
                                    className={styles.dropdown}
                                    ref={isChildrenNeededRef}
                                    name="isSubAssemblyComponentsNeeded"
                                >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubAssembly;
