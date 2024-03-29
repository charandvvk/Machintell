import { productActions } from "../../../store";
import classes from "../product.module.css";

const Crown = ({ product, nodeId, dispatch, generateChildrenNodes }) => {
    const node = product.subassemblies[nodeId] || product.components[nodeId];
    const isAlertDisplayed =
        nodeId.startsWith("s") && node.isChildrenNeeded === "Yes";
    const children = generateChildrenNodes(product, nodeId, dispatch);

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

    return (
        <div className={`${classes.border} ${classes.children}`}>
            <div
                className={`${nodeId !== "untitled" && classes.cursor} ${
                    nodeId !== "untitled" &&
                    (product.currActive === nodeId
                        ? classes.active
                        : classes.background)
                } ${isAlertDisplayed && classes.subassembly}`}
                onClick={handleNodeClick}
            >
                <div style={{ color: nodeTextColor }}>
                    {/* {`${node.name} - ${nodeId} - ${node.parent}`} */}
                    {node.name}
                </div>
                {isAlertDisplayed && <div className={classes.alert}></div>}
            </div>
            {children}
        </div>
    );
};

export default Crown;
