import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendActions, productActions } from "../../../store";
import classes from "../product.module.css";
import AddNewProduct from "../newProduct/AddNewProduct";

const ManageProducts = ({ setWarningFor }) => {
    const { products } = useSelector((state) => state.backend);
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState("");
    const [selectedAction, setSelectedAction] = useState(null);
    const selectedProduct = products.find(
        (product) => product.id === selectedId
    );

    useEffect(() => {
        setWarningFor(null);
    }, []);

    const handleConfirm = () => {
        if (selectedAction === "edit")
            dispatch(productActions.set(selectedProduct));
        else if (selectedAction === "duplicate") {
            setSelectedAction("confirmDuplicate");
        } else {
            dispatch(backendActions.deleteProduct(selectedId));
            setSelectedAction(null);
            if (products.length === 1)
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
                            {selectedProduct.name}?
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
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedId(product.id)}
                                className={`${classes.product} ${
                                    classes.cursor
                                } ${
                                    selectedId === product.id
                                        ? classes.active
                                        : classes.background
                                }`}
                            >
                                {product.name}
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
