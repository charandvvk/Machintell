import React from "react";
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
    const { name, id, currActive, subassemblies, currForm } = useSelector(
        (state) => state.product
    );
    const product = useSelector((state) => state.product);
    const dispatch = useDispatch();

    let isDisabled = true;
    if (currActive) {
        if (
            currActive.startsWith("p") ||
            (currActive.startsWith("s") &&
                subassemblies[currActive].isChildrenNeeded !== "No")
        )
            isDisabled = false;
    }

    function toggleFormDisplay(formType) {
        dispatch(productActions.setCurrForm(formType));
        if (formType === "newProduct" && id) {
            //send the product tree details to the backend
            dispatch(backendActions.addProduct(product));
            dispatch(productActions.reset());
            dispatch(productActions.setCurrForm("newProduct"));
        } else if (formType === "manageProducts") {
            if (id) dispatch(backendActions.addProduct(product));
            dispatch(productActions.reset());
            dispatch(productActions.setCurrForm("manageProducts"));
        }
    }

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
                                toggleFormDisplay("newProduct");
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
                                toggleFormDisplay("manageProducts");
                            }}
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
                                toggleFormDisplay("subAssembly");
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
                                toggleFormDisplay("components");
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
                        <div>{displayForm()}</div>
                        <div>
                            {/* {id && currActive === id && <ProductDetails />} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
