import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendActions, productActions } from "../../../store";
import classes from "../product.module.css";
import AddNewProduct from "../newProduct/AddNewProduct";
import { deleteData, queryClient } from "../../../utils/http";
import { useMutation } from "@tanstack/react-query";

const ManageProducts = ({ setWarningFor, productsFetched }) => {
    // const { products } = useSelector((state) => state.backend);
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState("");
    const [selectedAction, setSelectedAction] = useState(null);
    const selectedProduct = productsFetched.find(
        (product) => product.product_id === selectedId
    );

    const { mutate: deleteProduct, isPending: isDeletingProduct } = useMutation(
        {
            mutationFn: () =>
                deleteData(`/deleteproduct/${encodeURIComponent(selectedId)}`),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["products"],
                });
                if (productsFetched.length === 1)
                    dispatch(productActions.setCurrForm(null));
            },
        }
    );

    useEffect(() => {
        setWarningFor(null);
    }, [setWarningFor]);

    const handleConfirm = async () => {
        if (selectedAction === "edit")
            dispatch(productActions.set(selectedProduct));
        else if (selectedAction === "duplicate") {
            setSelectedAction("confirmDuplicate");
        } else {
            deleteProduct();
            setSelectedAction(null);
            dispatch(backendActions.deleteProduct(selectedId));
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
                    {isDeletingProduct &&
                        `Deleting ${selectedProduct.product_name}...`}
                    <div className={classes.products}>
                        {productsFetched.map((product) => (
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
