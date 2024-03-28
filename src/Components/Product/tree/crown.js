import { productActions } from "../../../store";
import classes from "../product.module.css";

const Crown = ({ product, nodeId, dispatch, generateChildrenNodes }) => {
    const node = product.subassemblies[nodeId] || product.components[nodeId];
    const isAlertDisplayed =
        nodeId.startsWith("s") && node.addChildren && !node.hasAddedChildren;
    const children = generateChildrenNodes(product, nodeId, dispatch);

    return (
        <div className={`${classes.border} ${classes.children}`}>
            <div
                className={`${classes.cursor} ${
                    product.currActive === nodeId
                        ? classes.active
                        : classes.background
                } ${isAlertDisplayed && classes.subassembly}`}
                onClick={() =>
                    nodeId.startsWith("s") &&
                    dispatch(productActions.setActive(nodeId))
                }
            >
                <div
                    style={{ color: nodeId.startsWith("s") ? "blue" : "green" }}
                >
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
