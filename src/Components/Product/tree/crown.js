import { productActions } from "../../../store";

const Crown = ({
    product,
    nodeId,
    dispatch,
    generateChildrenNodes,
    classes,
}) => {
    const node = product.subassemblies[nodeId] || product.components[nodeId];
    const isAlertDisplayed =
        nodeId.startsWith("s") && node.addChildren && !node.hasAddedChildren;
    const children = generateChildrenNodes(product, nodeId, dispatch);

    return (
        <div className={classes.children}>
            <div
                className={`${isAlertDisplayed && classes.subassembly} ${
                    product.currActive === nodeId && classes.active
                }`}
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
