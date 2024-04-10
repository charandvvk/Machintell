import React, { useState } from "react";
import styles from "./product.module.css";
import AddNewProduct from "./newProduct/AddNewProduct";
import SubAssembly from "./subAssembly/subAssembly";
import ManageProducts from "./manageProducts/manageProducts";
import AddComponents from "./components/AddComponents";
import Tree from "./tree/tree";
import { useDispatch, useSelector } from "react-redux";
import { backendActions, productActions } from "../../store";
import ProductDetails from "./newProduct/ProductDetails";
import SubAssemblyDetails from "./subAssembly/subAssemblyDetails";
import DialogBox from "./DialogBox";

const Product = () => {
    const { name, currActive, subassemblies, currForm, mainFunction } =
        useSelector((state) => state.product);
    const product = useSelector((state) => state.product);
    const { products } = useSelector((state) => state.backend);
    const dispatch = useDispatch();
    const [warningFor, setWarningFor] = useState(null);

    let isDisabled = true;
    if (currActive) {
        if (
            (currActive.startsWith("p") && mainFunction) ||
            (currActive.startsWith("s") &&
                subassemblies[currActive].isChildrenNeeded !== "No")
        )
            isDisabled = false;
    }

    const toggleFormDisplay = (formType) => {
        if (formType === "newProduct" && mainFunction) {
            //send the product tree details to the backend
            dispatch(backendActions.addProduct(product));
            dispatch(productActions.reset());
        } else if (formType === "manageProducts") {
            if (mainFunction) dispatch(backendActions.addProduct(product));
            dispatch(productActions.reset());
        }
        dispatch(productActions.setCurrForm(formType));
    };

    function handleToggleFormType(formType) {
        if (
            (formType === "newProduct" || formType === "manageProducts") &&
            currActive.startsWith("p") &&
            !mainFunction
        )
            setWarningFor(formType);
        else toggleFormDisplay(formType);
    }

    const handleConfirm = (formType) => {
        setWarningFor(null);
        toggleFormDisplay(formType);
    };

    function displayForm() {
        if (currForm === "newProduct") return <AddNewProduct />;
        else if (currForm === "manageProducts") return <ManageProducts />;
        else if (currForm === "subAssembly") return <SubAssembly />;
        else if (currForm === "components")
            return <AddComponents key={currActive} />;
        else if (currForm === "productDetails") return <ProductDetails />;
        else if (currForm === "subAssemblyDetails") {
            return <SubAssemblyDetails key={currActive} />;
        } else if (currForm === "DialogBox") {
            return <DialogBox />;
        }
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
                            disabled={!products.length && !mainFunction}
                        >
                            Manage products
                        </button>
                    </div>
                    <div className={styles.columnTitle}>Product Details</div>
                </div>
                <div className={styles.middlebox}>
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={`${styles.btn} ${
                                currForm === "subAssembly" && styles.active
                            }`}
                            onClick={() => {
                                handleToggleFormType("subAssembly");
                            }}
                            disabled={isDisabled}
                        >
                            Add sub-assembly
                        </button>
                        <button
                            type="button"
                            className={`${styles.btn} ${
                                currForm === "components" &&
                                !currActive.startsWith("c") &&
                                styles.active
                            }`}
                            onClick={() => {
                                handleToggleFormType("components");
                            }}
                            disabled={isDisabled}
                        >
                            Add component
                        </button>
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
                        {warningFor && (
                            <div className={styles.modal}>
                                <div>
                                    Do you want to{" "}
                                    {warningFor === "newProduct"
                                        ? "add a new product"
                                        : "manage products"}{" "}
                                    without saving {name}? If yes, {name}{" "}
                                    details will be lost.
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
                        <div className={warningFor ? styles.hidden : ""}>
                            {displayForm()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
