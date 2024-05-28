import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { productActions } from "../../../store";
import classes from "../product.module.css";
import AddNewProduct from "../newProduct/AddNewProduct";
import { deleteData, getData, queryClient } from "../../../utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import Pagination from "./pagination";

const productCountPerPage = 10;

const ManageProducts = ({ setWarningFor, productsFetched }) => {
    const dispatch = useDispatch();
    const [selectedId, setSelectedId] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const selectedProduct = productsFetched.find(
        (product) => product.product_id === selectedId
    );
    const [currPageNumber, setCurrPageNumber] = useState(1);
    const beginIndex = (currPageNumber - 1) * productCountPerPage;
    const displayedProducts = productsFetched.slice(
        beginIndex,
        beginIndex + productCountPerPage
    );
    const pageCount = Math.ceil(productsFetched.length / productCountPerPage);

    useEffect(() => {
        setWarningFor(null);
    }, [setWarningFor]);

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
                if (displayedProducts.length === 1)
                    setCurrPageNumber((prevState) => prevState - 1);
            },
        }
    );

    const {
        data: productTreeFetched,
        isLoading: isFetchingProductTree,
        refetch: viewProductTree,
    } = useQuery({
        queryKey: ["productTree", selectedId],
        queryFn: () => {
            return getData(
                `/viewproducttree/${encodeURIComponent(selectedId)}`
            );
        },
        enabled: false,
    });

    useEffect(() => {
        if (productTreeFetched) {
            dispatch(productActions.set(productTreeFetched));
            queryClient.removeQueries(["productTree", selectedId]);
        }
    }, [productTreeFetched, dispatch, selectedId]);

    const handleConfirm = () => {
        if (selectedAction === "edit") {
            viewProductTree();
            setSelectedAction(null);
        } else if (selectedAction === "duplicate")
            setSelectedAction("confirmDuplicate");
        else {
            deleteProduct();
            setSelectedAction(null);
        }
    };

    return (
        <>
            {isFetchingProductTree && "Loading product tree..."}
            {isDeletingProduct && `Deleting ${selectedProduct.product_name}...`}
            {selectedAction ? (
                selectedAction === "confirmDuplicate" ? (
                    <AddNewProduct
                        product={selectedProduct}
                        setWarningFor={setWarningFor}
                        setSelectedAction={setSelectedAction}
                        setSelectedId={setSelectedId}
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
                        {displayedProducts.map((product) => (
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
                    {pageCount > 1 && (
                        <Pagination
                            pageCount={pageCount}
                            currPageNumber={currPageNumber}
                            setCurrPageNumber={setCurrPageNumber}
                        />
                    )}
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
