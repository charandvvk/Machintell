import useToggler from "../../../hooks/useToggler";
import { productActions } from "../../../store";
import classes from "../product.module.css";
import Toggler from "./toggler";

const Crown = ({ product, nodeId, dispatch, generateChildrenNodes }) => {
    const node = product.subassemblies[nodeId] || product.components[nodeId];
    const isAlertDisplayed =
        nodeId.startsWith("s") &&
        node.isChildrenNeeded === "Yes" &&
        !node.fileLocation;
    const children = generateChildrenNodes(product, nodeId, dispatch);
    const { hideCrown, handleTogglerClick } = useToggler();

    function handleNodeClick() {
        if (nodeId !== "untitled")
            dispatch(productActions.setActive(nodeId)) &&
                dispatch(
                    productActions.setCurrForm(
                        nodeId.startsWith("s")
                            ? "subAssemblyDetails"
                            : "components"
                    )
                );
    }

    let nodeTextColor;
    if (nodeId.startsWith("s")) nodeTextColor = "blue";
    else if (nodeId.startsWith("c")) nodeTextColor = "green";

    const hasChildren =
        Object.values(product.subassemblies).find(
            (subassembly) => subassembly.parent === nodeId
        ) ||
        Object.values(product.components).find(
            (component) => component.parent === nodeId
        );

    return (
        <div className={`${classes.border} ${classes.children}`}>
            <div className={classes.expandable}>
                {nodeId.startsWith("s") && hasChildren && (
                    <Toggler
                        hideCrown={hideCrown}
                        handleTogglerClick={handleTogglerClick}
                    />
                )}
                <div
                    className={`${classes.text} ${classes.grow} ${
                        nodeId !== "untitled" && classes.cursor
                    } ${
                        nodeId !== "untitled" &&
                        (product.currActive === nodeId
                            ? classes.active
                            : classes.background)
                    } ${isAlertDisplayed && classes.subassembly}`}
                    onClick={handleNodeClick}
                >
                    {isAlertDisplayed && (
                        <div className={classes.alert}>
                            <div className={classes.triangle}></div>
                            <div className={classes["triangle-border"]}></div>
                        </div>
                    )}
                    <div style={{ color: nodeTextColor }}>
                        {/* {`${node.name} - ${nodeId} - ${node.parent}`} */}
                        {node.name}
                    </div>
                </div>
            </div>
            {!hideCrown && children}
        </div>
    );
};

export default Crown;
