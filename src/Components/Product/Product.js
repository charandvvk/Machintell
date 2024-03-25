import React, { useState } from "react";
import styles from "./product.module.css";
import AddNewProduct from "./newProduct/AddNewProduct";
import SubAssembly from "./subAssembly/subAssembly";
import EditProduct from "./editProduct/EditProduct";
import Components from "./components/component";

const Product = () => {
    const [form,setForm]=useState("");

    function toggleFormDisplay(formType){
        setForm(formType)
    }
    function displayForm(){
        if(form==="Product Form")
        return <AddNewProduct/>
        else if (form==="editProduct")
        return <EditProduct/>
        else if(form==="subAssembly")
        return <SubAssembly/>
        else if(form==="components")
        return <Components/>
    }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftbox}>
          <div className={styles.buttons}>
            <button type="button" className={styles.btn} onClick={()=>{toggleFormDisplay("newProduct")}}>
              Add new product
            </button>
            <button type="button" className={styles.btn} onClick={()=>{toggleFormDisplay("editProduct")}}>
              Edit product
            </button>
          </div>
          <div className={styles.columnTitle}>Product Details</div>
        </div>
        <div className={styles.middlebox}>
          <div className={styles.buttons}>
            <button type="button" className={styles.btn} onClick={()=>{toggleFormDisplay("subAssembly")}}>
              Add sub-assembly
            </button>
            <button type="button" className={styles.btn} onClick={()=>{toggleFormDisplay("components")}}>
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
            <div className={styles.leftcolTitle}>Product Tree</div>
          </div>
          <div className={styles.rightcol}>
            <div>
              {displayForm()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;