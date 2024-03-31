import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendActions, productActions } from "../../../store";
import classes from "../product.module.css";

const EditProduct = () => {
    const { products } = useSelector((state) => state.backend);
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState("");

    const handleEdit = () => {
        dispatch(
            productActions.set(
                products.find((product) => product.id === selectedId)
            )
        );
    };

    const handleDelete = () => {
        dispatch(backendActions.deleteProduct(selectedId));
    };

    return (
        <>
            <div>Select a product to edit or delete:</div>
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
            {selectedId && (
                <>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            )}
        </>
    );
};

export default EditProduct;
