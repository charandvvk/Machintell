import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendActions, productActions } from "../../../store";
import classes from "../product.module.css";
import AddNewProduct from "../newProduct/AddNewProduct";
import { deleteData, getData } from "../../../utils/http";

const ManageProducts = ({ setWarningFor }) => {
    // const { products } = useSelector((state) => state.backend);
    const [productsData, setProductsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState("");
    const [selectedAction, setSelectedAction] = useState(null);
    const selectedProduct = productsData.find(
        (product) => product.product_id === selectedId
    );

    useEffect(() => {
        setWarningFor(null);
        const getProducts = async () => {
            setIsLoading(true);
            try {
                const data = await getData("/viewproducts");
                setProductsData(data);
            } catch (error) {
                console.error("Error:", error.message);
            }
            setIsLoading(false);
        };
        getProducts();
    }, [setWarningFor]);

    const handleConfirm = async () => {
        if (selectedAction === "edit")
            dispatch(productActions.set(selectedProduct));
        else if (selectedAction === "duplicate") {
            setSelectedAction("confirmDuplicate");
        } else {
            try {
                const { message, data } = await deleteData(
                    `/deleteproduct/${encodeURIComponent(selectedId)}`
                );
                setProductsData((prevState) =>
                    prevState.filter(
                        (product) => product.product_id !== selectedId
                    )
                );
                dispatch(
                    productActions.setHasProducts(productsData.length - 1)
                );
            } catch (error) {
                console.error("Error:", error.message);
            }
            dispatch(backendActions.deleteProduct(selectedId));
            setSelectedAction(null);
            if (productsData.length === 1)
                dispatch(productActions.setCurrForm(null));
        }
    };

    const handleSave = (id) => {
        setSelectedAction(null);
        setSelectedId(id);
    };

    return (
        <>
            {selectedAction ? (
                selectedAction === "confirmDuplicate" ? (
                    <AddNewProduct
                        product={selectedProduct}
                        onSave={handleSave}
                        setWarningFor={setWarningFor}
                    />
                ) : (
                    <div className={classes.modal}>
                        <div>
                            Do you want to {selectedAction}{" "}
                            {selectedProduct.product_name}?
                        </div>
                        <div className={classes.actions}>
                            <button onClick={() => setSelectedAction(null)}>
                                Cancel
                            </button>
                            <button onClick={handleConfirm}>Confirm</button>
                        </div>
                    </div>
                )
            ) : (
                <div className={classes.select}>
                    <div className={classes.title}>Select a product:</div>
                    <div className={classes.products}>
                        {isLoading && "Loading products..."}
                        {productsData.map((product) => (
                            <div
                                key={product.product_id}
                                onClick={() =>
                                    setSelectedId(product.product_id)
                                }
                                className={`${classes.product} ${
                                    classes.cursor
                                } ${
                                    selectedId === product.product_id
                                        ? classes.active
                                        : classes.background
                                }`}
                            >
                                {product.product_name}
                            </div>
                        ))}
                    </div>
                    <div className={classes.actions}>
                        <button
                            onClick={() => setSelectedAction("edit")}
                            disabled={!selectedId}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setSelectedAction("duplicate")}
                            disabled={!selectedId}
                        >
                            Duplicate
                        </button>
                        <button
                            onClick={() => setSelectedAction("delete")}
                            disabled={!selectedId}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageProducts;
