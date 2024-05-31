import { useDispatch, useSelector } from "react-redux";
import classes from "../product.module.css";
import { productActions } from "../../../store";
import Crown from "./crown";
import Toggler from "./toggler";
import useToggler from "../../../hooks/useToggler";

function Tree() {
    const product = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const { hideCrown, handleTogglerClick } = useToggler();

    function handleProductClick() {
        product.id &&
            dispatch(productActions.setActive(product.id)) &&
            dispatch(productActions.setCurrForm("productDetails"));
    }

    const children = generateChildrenNodes(product, product.id, dispatch);

    const hasChildren =
        Object.keys(product.subassemblies).length ||
        Object.keys(product.components).length
            ? true
            : false;

    return (
        <div className={classes.border}>
            <div className={classes.expandable}>
                {hasChildren && (
                    <Toggler
                        hideCrown={hideCrown}
                        handleTogglerClick={handleTogglerClick}
                    />
                )}
                <div
                    className={`${classes.text} ${classes.grow} ${
                        hasChildren && classes["left-border"]
                    } ${product.id && classes.cursor} ${
                        product.currActive !== product.id && classes.background
                    } ${
                        product.id &&
                        product.currActive === product.id &&
                        classes.active
                    }`}
                    onClick={handleProductClick}
                >
                    {/* {`${product.name} - ${product.id}`} */}
                    {product.name}
                </div>
            </div>
            {!hideCrown && children}
        </div>
    );
}

export default Tree;

const generateChildrenNodes = (product, nodeId, dispatch) => {
    return (
        <div>
            {Object.keys(product.subassemblies)
                .concat(Object.keys(product.components))
                .filter((id) => {
                    if (
                        id.startsWith("s") ||
                        (product.currForm === "subAssembly" &&
                            id === "untitled")
                    )
                        return product.subassemblies[id].parent === nodeId;
                    else if (id.startsWith("c"))
                        return product.components[id].parent === nodeId;
                })
                .map((child) => (
                    <Crown
                        key={child}
                        product={product}
                        nodeId={child}
                        dispatch={dispatch}
                        generateChildrenNodes={generateChildrenNodes}
                    />
                ))}
        </div>
    );
};
