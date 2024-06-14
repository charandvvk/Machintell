import React, { useState } from "react";
import classes from "./product.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../store";

function Chart() {
    const { name, id, subassemblies, components, currActive } = useSelector(
        (state) => state.product
    );
    const [selectedId, setSelectedId] = useState("");
    const [hoveredId, setHoveredId] = useState("");
    const [showStats, setShowStats] = useState(false);
    const dispatch = useDispatch();
    let head = name;

    const currActiveId = currActive.slice(1);
    if (currActiveId[0] === "s") head = subassemblies[currActiveId].name;

    const subassembliesDisplayed = Object.entries(subassemblies).filter(
        ([key, value]) => value.parent === currActiveId
    );
    const componentsDisplayed = Object.entries(components).filter(
        ([key, value]) => value.parent === currActiveId
    );

    const hasChildren = (id) => {
        return (
            Object.values(subassemblies).find(
                (subassembly) => subassembly.parent === id
            ) ||
            Object.values(components).find(
                (component) => component.parent === id
            )
        );
    };

    const handleClickSubassembly = (key) => {
        if (hasChildren(key)) {
            setSelectedId(key);
            dispatch(productActions.setActive(`t${key}`));
        }
    };

    const handleClickPrevious = () => {
        dispatch(
            productActions.setActive(`t${subassemblies[currActiveId].parent}`)
        );
    };

    const handleClickInitial = () => {
        dispatch(productActions.setActive(`t${id}`));
    };

    const handleMouseOver = (key) => {
        setShowStats(true);
        setHoveredId(key);
    };

    return (
        <div className={classes.chart}>
            <div className={classes.header}>
                <div>Subassemblies</div>
                <div className={classes.head}>
                    <div
                        className={`${classes.box} ${
                            currActiveId[0] === "s" && classes["bg-blue"]
                        }`}
                    >
                        {head}
                    </div>
                    <div className={classes["vertical-short"]}></div>
                </div>
                <div>Components</div>
            </div>
            <div className={classes["children-chart"]}>
                <div className={classes["children-subassembly"]}>
                    {subassembliesDisplayed.map(([key, value]) => (
                        <div className={classes.child} key={key}>
                            {showStats && hoveredId === key && (
                                <div
                                    className={`${classes.stats} ${classes["details-subassembly"]}`}
                                >
                                    <div>
                                        No. of subassemblies:{" "}
                                        {
                                            Object.values(subassemblies).filter(
                                                (subassembly) =>
                                                    subassembly.parent === key
                                            ).length
                                        }
                                    </div>
                                    <div>
                                        No. of components:{" "}
                                        {
                                            Object.values(components).filter(
                                                (component) =>
                                                    component.parent === key
                                            ).length
                                        }
                                    </div>
                                    {Object.values(subassemblies).filter(
                                        (subassembly) =>
                                            subassembly.parent === key
                                    ).length ? (
                                        <div>
                                            No. of bought-up subassemblies:{" "}
                                            {
                                                Object.values(
                                                    subassemblies
                                                ).filter(
                                                    (subassembly) =>
                                                        subassembly.parent ===
                                                            key &&
                                                        subassembly.boughtUp ===
                                                            "Yes"
                                                ).length
                                            }
                                        </div>
                                    ) : null}
                                    {Object.values(components).filter(
                                        (component) => component.parent === key
                                    ).length ? (
                                        <div>
                                            No. of bought-up components:{" "}
                                            {
                                                Object.values(
                                                    components
                                                ).filter(
                                                    (component) =>
                                                        component.parent ===
                                                            key &&
                                                        component.boughtUp ===
                                                            "Yes"
                                                ).length
                                            }
                                        </div>
                                    ) : null}
                                </div>
                            )}
                            <div
                                className={`${classes.box} ${
                                    hasChildren(key) && classes.hover
                                }
                                ${key === selectedId && classes.active}`}
                                onClick={() => handleClickSubassembly(key)}
                                onMouseOver={() => handleMouseOver(key)}
                                onMouseLeave={() => setShowStats(false)}
                            >
                                {value.name}
                            </div>
                            <div className={classes["horizontal-short"]}></div>
                            <div className={classes["vertical-long"]}></div>
                        </div>
                    ))}
                </div>
                <div className={`${classes.gap} ${classes["border-top"]}`}>
                    <button
                        onClick={handleClickPrevious}
                        disabled={currActiveId[0] === "p"}
                        className={classes["btn-back"]}
                    >
                        Previous view
                    </button>
                </div>
                <div className={`${classes.gap} ${classes["border-top"]}`}>
                    <button
                        onClick={handleClickInitial}
                        disabled={currActiveId[0] === "p"}
                        className={classes["btn-back"]}
                    >
                        Initial view
                    </button>
                </div>
                <div className={classes["children-components"]}>
                    {componentsDisplayed.map(([key, value]) => (
                        <div className={classes.child} key={key}>
                            {showStats && hoveredId === key && (
                                <div
                                    className={`${classes.stats} ${classes["details-components"]}`}
                                >
                                    {currActiveId[0] !== "p" && (
                                        <div>Product: {name}</div>
                                    )}
                                    <div>Bought-up: {value.boughtUp}</div>
                                </div>
                            )}
                            <div className={classes["vertical-long"]}></div>
                            <div className={classes["horizontal-short"]}></div>
                            <div
                                className={classes.box}
                                onMouseOver={() => handleMouseOver(key)}
                                onMouseLeave={() => setShowStats(false)}
                            >
                                {value.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Chart;
