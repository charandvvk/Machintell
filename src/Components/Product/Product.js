import React, { useState } from "react";
import styles from "./product.module.css";
import AddNewProduct from "./newProduct/AddNewProduct";
import SubAssembly from "./subAssembly/subAssembly";
import ManageProducts from "./manageProducts/manageProducts";
import AddComponents from "./components/AddComponents";
import Tree from "./tree/tree";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../store";
import ProductDetails from "./newProduct/ProductDetails";
import SubAssemblyDetails from "./subAssembly/subAssemblyDetails";
import { deleteData, getData } from "../../utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";
// import DialogBox from "./DialogBox";

const Product = () => {
    const product = useSelector((state) => state.product);
    const {
        name,
        fileLocation,
        currActive,
        subassemblies,
        currForm,
        components,
    } = product;
    const subassembly = subassemblies[currActive];
    const dispatch = useDispatch();
    const [warningFor, setWarningFor] = useState(null);
    let itemNotSaved;
    if (warningFor && warningFor !== "delete" && currForm !== "components") {
        itemNotSaved = currActive.startsWith("p") ? name : subassembly.name;
    }

    const { data: productsFetched, isPending: isFetchingProducts } = useQuery({
        queryKey: ["products"],
        queryFn: () => getData("/viewproducts"),
        initialData: [],
    });

    const {
        mutate: deleteSubassemblyOrComponent,
        isPending: isDeletingSubassemblyOrComponent,
    } = useMutation({
        mutationFn: () =>
            deleteData(
                `/delete${
                    currActive.startsWith("c") ? "components" : "subassembly"
                }/${encodeURIComponent(currActive)}`
            ),
        onSuccess: () => {
            dispatch(
                productActions[
                    `delete${
                        currActive.startsWith("s") ? "Subassembly" : "Component"
                    }`
                ](currActive)
            );
            setWarningFor(null);
            dispatch(productActions.setCurrForm(null));
            dispatch(productActions.setActive(""));
        },
    });

    let isDisabled = true;
    if (currActive) {
        if (
            (currActive.startsWith("p") && !fileLocation) ||
            (currActive.startsWith("s") &&
                subassembly.isChildrenNeeded !== "No" &&
                !subassembly.fileLocation)
        )
            isDisabled = false;
    }

    const toggleFormDisplay = (formType) => {
        if (
            (formType === "newProduct" && !fileLocation) ||
            formType === "manageProducts"
        )
            dispatch(productActions.reset());
        dispatch(productActions.setCurrForm(formType));
    };

    function handleToggleFormType(formType) {
        if (
            (formType === "newProduct" || formType === "manageProducts") &&
            ((currActive.startsWith("p") && fileLocation) ||
                (currActive.startsWith("s") && subassembly.fileLocation))
        )
            setWarningFor(formType);
        else toggleFormDisplay(formType);
    }

    const handleConfirm = (formType) => {
        setWarningFor(null);
        toggleFormDisplay(formType);
    };

    function displayForm() {
        if (currForm === "newProduct")
            return <AddNewProduct setWarningFor={setWarningFor} />;
        else if (currForm === "manageProducts")
            return (
                <ManageProducts
                    setWarningFor={setWarningFor}
                    productsFetched={productsFetched}
                />
            );
        else if (currForm === "subAssembly")
            return <SubAssembly setWarningFor={setWarningFor} />;
        else if (currForm === "components")
            return (
                <AddComponents key={currActive} setWarningFor={setWarningFor} />
            );
        else if (currForm === "productDetails")
            return <ProductDetails setWarningFor={setWarningFor} />;
        else if (currForm === "subAssemblyDetails") {
            return (
                <SubAssemblyDetails
                    key={currActive}
                    setWarningFor={setWarningFor}
                />
            );
        }
        // else if (currForm === "DialogBox") {
        //     return <DialogBox />;
        // }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.leftbox}>
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={`${styles.btn} ${
                                currForm === "newProduct" && styles.active
                            }`}
                            onClick={() => {
                                handleToggleFormType("newProduct");
                            }}
                        >
                            Add new product
                        </button>
                        <button
                            type="button"
                            className={`${styles.btn} ${
                                currForm === "manageProducts" && styles.active
                            }`}
                            onClick={() => {
                                handleToggleFormType("manageProducts");
                            }}
                            disabled={!productsFetched.length}
                        >
                            {isFetchingProducts
                                ? "Loading status"
                                : "Manage products"}
                        </button>
                    </div>
                    <div className={styles.columnTitle}>Product Details</div>
                </div>
                <div className={styles.middlebox}>
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={`${styles.btn} ${
                                currForm === "subAssembly" &&
                                !warningFor &&
                                styles.active
                            }`}
                            onClick={() => {
                                handleToggleFormType("subAssembly");
                            }}
                            disabled={
                                isDisabled ||
                                (currForm === "subAssembly" && warningFor)
                            }
                        >
                            Add sub-assembly
                        </button>
                        <button
                            type="button"
                            className={`${styles.btn} ${
                                currForm === "components" &&
                                !currActive.startsWith("c") &&
                                !warningFor &&
                                styles.active
                            }`}
                            onClick={() => {
                                handleToggleFormType("components");
                            }}
                            disabled={
                                isDisabled ||
                                (currForm === "components" && warningFor)
                            }
                        >
                            Add component
                        </button>
                        {((currActive.startsWith("s") &&
                            !subassemblies[currActive].fileLocation) ||
                            currActive.startsWith("c")) && (
                            <button
                                type="button"
                                className={`${styles.btn} ${
                                    warningFor === "delete" && styles.active
                                }`}
                                onClick={() => setWarningFor("delete")}
                            >
                                {isDeletingSubassemblyOrComponent
                                    ? `Deleting ${
                                          currActive.startsWith("s")
                                              ? "subassembly"
                                              : "component"
                                      }...`
                                    : "Delete"}
                            </button>
                        )}
                    </div>
                    <div className={styles.columnTitle}>Main Assemblies</div>
                </div>
                <div className={styles.rightbox}>
                    <div></div>
                    <div className={styles.columnTitle}>View</div>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.col}>
                    <div className={styles.leftcol}>
                        <div className={styles.leftcolTitle}>
                            {name && <Tree />}
                        </div>
                    </div>
                    <div className={styles.rightcol}>
                        {warningFor && warningFor !== "delete" && (
                            <div className={styles.modal}>
                                <div>
                                    Do you want to{" "}
                                    {warningFor === "newProduct"
                                        ? "add a new product"
                                        : "manage products"}{" "}
                                    without saving {itemNotSaved}? If yes,{" "}
                                    {itemNotSaved} details will be lost.
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => setWarningFor(null)}>
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleConfirm(warningFor)
                                        }
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                        {warningFor === "delete" && (
                            <div className={styles.modal}>
                                <div>
                                    Do you want to delete{" "}
                                    {currActive.startsWith("s") &&
                                        `${subassemblies[currActive].name}, and nested subassemblies and components`}
                                    {currActive.startsWith("c") &&
                                        components[currActive].name}
                                    ?
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => setWarningFor(null)}>
                                        Cancel
                                    </button>
                                    <button
                                        onClick={deleteSubassemblyOrComponent}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className={warningFor ? styles.hidden : ""}>
                            <div>{displayForm()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
