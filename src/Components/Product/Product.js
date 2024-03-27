import React, { useState } from "react";
import styles from "./product.module.css";
import AddNewProduct from "./newProduct/AddNewProduct";
import SubAssembly from "./subAssembly/subAssembly";
import EditProduct from "./editProduct/editProduct";
import AddComponents from "./components/AddComponents";
import Tree from "./tree/tree";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../store";

const Product = () => {
    const [form, setForm] = useState("");
    const product = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [resetProduct, setResetProduct] = useState(false);
    const [resetSubassembly, setResetSubassembly] = useState(false);

    let isDisabled = true;
    if (product.currActive) {
        if (product.currActive.startsWith("p")) isDisabled = false;
        else {
            if (product.subassemblies[product.currActive].addChildren) {
                isDisabled = false;
            } else {
                isDisabled = true;
            }
        }
    }

    function toggleFormDisplay(formType) {
        setForm(formType);
        if (formType === "newProduct" && product.id) {
            dispatch(productActions.reset());
            setResetProduct((prevState) => !prevState);
            //send the product tree details to the backend
        }
        if (formType === "subAssembly") {
            setResetSubassembly((prevState) => !prevState);
        }
    }
    function displayForm() {
        if (form === "newProduct") return <AddNewProduct key={resetProduct} />;
        else if (form === "editProduct") return <EditProduct />;
        else if (form === "subAssembly")
            return <SubAssembly key={resetSubassembly} />;
        else if (form === "components") return <AddComponents />;
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.leftbox}>
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={styles.btn}
                            onClick={() => {
                                toggleFormDisplay("newProduct");
                            }}
                        >
                            Add new product
                        </button>
                        <button
                            type="button"
                            className={styles.btn}
                            onClick={() => {
                                toggleFormDisplay("editProduct");
                            }}
                        >
                            Edit product
                        </button>
                    </div>
                    <div className={styles.columnTitle}>Product Details</div>
                </div>
                <div className={styles.middlebox}>
                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={styles.btn}
                            onClick={() => {
                                toggleFormDisplay("subAssembly");
                            }}
                            disabled={isDisabled}
                        >
                            Add sub-assembly
                        </button>
                        <button
                            type="button"
                            className={styles.btn}
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
                            {product.name && <Tree />}
                        </div>
                    </div>
                    <div className={styles.rightcol}>
                        <div>{displayForm()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
