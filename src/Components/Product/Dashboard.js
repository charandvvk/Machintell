import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getData } from "../../utils/http";
import classes from "./product.module.css";

function Dashboard({ setWarningFor }) {
    const [selectedId, setSelectedId] = useState(null);

    const {
        data: productsTreesFetched,
        isFetching: isFetchingProductTrees,
        error: getProductTreesError,
    } = useQuery({
        queryKey: ["trees"],
        queryFn: () => getData("products/trees"),
        initialData: [],
    });

    useEffect(() => {
        setWarningFor(null);
    }, [setWarningFor]);

    return (
        <>
            {isFetchingProductTrees && "Loading products"}
            {getProductTreesError && getProductTreesError.message}
            <div className={classes.title}>
                Select a product and click on Product tree:
            </div>
            <div className={classes.products}>
                {productsTreesFetched.map((product) => (
                    <div className={classes.card} key={product.id}>
                        <div
                            key={product.id}
                            onClick={() => setSelectedId(product.id)}
                            className={`${classes.product} ${classes.cursor} ${
                                selectedId === product.id
                                    ? classes.active
                                    : classes.background
                            }`}
                        >
                            {product.name}
                        </div>
                        <div className={classes.stats}>
                            <div>
                                No. of subassemblies:{" "}
                                {Object.keys(product.subassemblies).length}
                            </div>
                            <div>
                                No. of components:{" "}
                                {Object.keys(product.components).length}
                            </div>
                            <div>
                                No. of bought-up subassemblies:
                                {
                                    Object.values(product.subassemblies).filter(
                                        (subassembly) =>
                                            subassembly.boughtUp === "Yes"
                                    ).length
                                }
                            </div>
                            <div>
                                No. of bought-up components:{" "}
                                {
                                    Object.values(product.components).filter(
                                        (component) =>
                                            component.boughtUp === "Yes"
                                    ).length
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Dashboard;
