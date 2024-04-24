import React, { useEffect, useState } from "react";
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
import { getData } from "../../utils/http";
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
        hasProducts,
    } = product;
    const subassembly = subassemblies[currActive];
    const dispatch = useDispatch();
    const [warningFor, setWarningFor] = useState(null);
    let itemNotSaved;
    if (warningFor && warningFor !== "delete" && currForm !== "components") {
        itemNotSaved = currActive.startsWith("p") ? name : subassembly.name;
    }
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            setIsLoading(true);
            try {
                const data = await getData("/viewproducts");
                dispatch(productActions.setHasProducts(data.length));
            } catch (error) {
                console.error("Error:", error.message);
            }
            setIsLoading(false);
        };
        getProducts();
    }, []);

    let isDisabled = true;
    if (currActive) {
        if (
            (currActive.startsWith("p") && !fileLocation) ||
            (currActive.startsWith("s") &&
                subassembly.isChildrenNeeded !== "No" &&
                subassembly.mainFunction)
        )
            isDisabled = false;
    }

    const handleDelete = () => {
        currActive.startsWith("s")
            ? dispatch(productActions.deleteSubassembly(currActive))
            : dispatch(productActions.deleteComponent(currActive));
        setWarningFor(null);
        dispatch(productActions.setCurrForm(null));
        dispatch(productActions.setActive(""));
    };

    const toggleFormDisplay = (formType) => {
        if (formType === "newProduct") {
            //send the product tree details to the backend
            if (currActive.startsWith("s") && !subassembly.mainFunction) {
                const productCopy = JSON.parse(JSON.stringify(product));
                delete productCopy.subassemblies[currActive];
                dispatch(backendActions.addProduct(productCopy));
                dispatch(productActions.reset());
            } else if (!fileLocation) {
                dispatch(backendActions.addProduct(product));
                dispatch(productActions.reset());
            }
        } else if (formType === "manageProducts") {
            if (currActive.startsWith("s") && !subassembly.mainFunction) {
                const productCopy = JSON.parse(JSON.stringify(product));
                delete productCopy.subassemblies[currActive];
                dispatch(backendActions.addProduct(productCopy));
            } else if (!fileLocation)
                dispatch(backendActions.addProduct(product));
            dispatch(productActions.reset());
        }
        dispatch(productActions.setCurrForm(formType));
    };

    function handleToggleFormType(formType) {
        if (
            (formType === "newProduct" || formType === "manageProducts") &&
            ((currActive.startsWith("p") && fileLocation) ||
                (currActive.startsWith("s") && !subassembly.mainFunction))
        ) {
            setWarningFor(formType);
        } else toggleFormDisplay(formType);
    }

    const handleConfirm = (formType) => {
        setWarningFor(null);
        toggleFormDisplay(formType);
    };

    function displayForm() {
        if (currForm === "newProduct")
            return <AddNewProduct setWarningFor={setWarningFor} />;
        else if (currForm === "manageProducts")
            return <ManageProducts setWarningFor={setWarningFor} />;
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
                            disabled={!hasProducts}
                        >
                            {isLoading ? "Loading status" : "Manage products"}
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
                            subassemblies[currActive].mainFunction) ||
                            currActive.startsWith("c")) && (
                            <button
                                type="button"
                                className={`${styles.btn} ${
                                    warningFor === "delete" && styles.active
                                }`}
                                onClick={() => setWarningFor("delete")}
                            >
                                Delete
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
                                    <button onClick={handleDelete}>
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
