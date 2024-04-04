import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendActions, productActions } from "../../../store";
import classes from "../product.module.css";
import AddNewProduct from "../newProduct/AddNewProduct";

const ManageProducts = () => {
    const { products } = useSelector((state) => state.backend);
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState("");
    const [selectedAction, setSelectedAction] = useState(null);
    const selectedProduct = products.find(
        (product) => product.id === selectedId
    );

    const handleConfirm = () => {
        if (selectedAction === "edit")
            dispatch(productActions.set(selectedProduct));
        else if (selectedAction === "duplicate") {
            setSelectedAction("confirmDuplicate");
        } else {
            dispatch(backendActions.deleteProduct(selectedId));
            setSelectedAction(null);
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
                    />
                ) : (
                    <div>
                        <div>
                            Do you want to {selectedAction}{" "}
                            {selectedProduct.name}?
                        </div>
                        <button onClick={() => setSelectedAction(null)}>
                            Cancel
                        </button>
                        <button onClick={handleConfirm}>Confirm</button>
                    </div>
                )
            ) : (
                <>
                    <div>Select a product:</div>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedId(product.id)}
                            className={`${classes.cursor} ${
                                selectedId === product.id
                                    ? classes.active
                                    : classes.background
                            }`}
                        >
                            {product.name}
                        </div>
                    ))}
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
                </>
            )}
        </>
    );
};

export default ManageProducts;
