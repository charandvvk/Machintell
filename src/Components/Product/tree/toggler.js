import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import classes from "../product.module.css";

function Toggler({ hideCrown, handleTogglerClick }) {
    return (
        <div
            className={`${classes.toggler} ${!hideCrown && classes.rotate}`}
            onClick={handleTogglerClick}
        >
            <FaChevronRight />
        </div>
    );
}

export default Toggler;
