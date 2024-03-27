import { useDispatch, useSelector } from "react-redux";
import classes from "../product.module.css";
import { productActions } from "../../../store";
import Crown from "./crown";

function Tree() {
    const product = useSelector((state) => state.product);
    const dispatch = useDispatch();
    return (
        <>
            <div
                className={
                    product.currActive === product.id ? classes.active : ""
                }
                onClick={() => dispatch(productActions.setActive(product.id))}
            >
                {/* {`${product.name} - ${product.id}`} */}
                {product.name}
            </div>
            {generateChildrenNodes(product, product.id, dispatch)}
        </>
    );
}

export default Tree;

const generateChildrenNodes = (product, nodeId, dispatch) => {
    return Object.keys(product.subassemblies)
        .concat(Object.keys(product.components))
        .filter((id) => {
            if (id.startsWith("s"))
                return product.subassemblies[id].parent === nodeId;
            else return product.components[id].parent === nodeId;
        })
        .map((child) => (
            <Crown
                key={child}
                product={product}
                nodeId={child}
                dispatch={dispatch}
                generateChildrenNodes={generateChildrenNodes}
                classes={classes}
            />
        ));
};
