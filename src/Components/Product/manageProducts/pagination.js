import React from "react";
import classes from "../product.module.css";

const Pagination = ({ pageCount, currPageNumber, setCurrPageNumber }) => {
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) pageNumbers.push(i);

    return (
        <>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={number === currPageNumber ? classes.active : ""}
                    onClick={() => setCurrPageNumber(number)}
                >
                    {number}
                </button>
            ))}
        </>
    );
};

export default Pagination;
