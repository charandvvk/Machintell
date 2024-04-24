import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    fileLocation: "",
    id: "",
    subassemblies: {
        untitled: {
            name: "Untitled",
            parent: "",
        },
    },
    components: {},
    currActive: "",
    currForm: null,
    hasProducts: null,
};

const isParentOf = (items, currActive) =>
    Object.values(items).find((value) => value.parent === currActive);

const deleteSubassemblyRecursive = (id, subassemblies, components) => {
    for (const compId in components)
        if (components[compId].parent === id) delete components[compId];
    for (const subId in subassemblies) {
        const subassembly = subassemblies[subId];
        if (subassembly && subassembly.parent === id)
            deleteSubassemblyRecursive(subId, subassemblies, components);
    }
    delete subassemblies[id];
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addProductName(state) {
            state.name = "Untitled project";
        },
        addProduct(state, { payload }) {
            state.name = payload.name;
            state.fileLocation = payload.fileLocation;
            state.id = payload.id;
            state.currActive = payload.id;
            state.currForm = "productDetails";
        },
        addProductDetails(state, { payload }) {
            state.name = payload.name;
            delete state.fileLocation;
        },
        addSubassemblyPlaceholderParent(state) {
            state.subassemblies.untitled.parent = state.currActive;
        },
        removeSubassemblyPlaceholderParent(state) {
            state.subassemblies.untitled.parent = "";
        },
        addSubassembly(state, { payload }) {
            const subassembly = {
                parent: state.currActive,
                name: payload.name,
                isChildrenNeeded: payload.isChildrenNeeded,
                fileLocation: payload.fileLocation,
                isBoughtUp: payload.isBoughtUp,
                mainFunction: "",
                secondaryFunctions: [],
                specifications: [],
            };
            state.subassemblies[payload.id] = subassembly;
            state.currActive = payload.id;
            state.currForm = "subAssemblyDetails";
        },
        addSubassemblyDetails(state, { payload }) {
            const { subassemblies, currActive, components } = state;
            const subassembly = subassemblies[currActive];
            const parentId = subassembly.parent;
            if (
                parentId.startsWith("s") &&
                subassemblies[parentId].isChildrenNeeded === "Yes"
            )
                subassemblies[parentId].isChildrenNeeded = "added";
            subassembly.name = payload.name;
            subassembly.fileLocation = payload.fileLocation;
            subassembly.mainFunction = payload.mainFunction;
            subassembly.secondaryFunctions = [...payload.secondaryFunctions];
            subassembly.isBoughtUp = payload.isBoughtUp;
            if (
                subassembly.isChildrenNeeded !== "No" &&
                payload.isChildrenNeeded === "No"
            )
                subassembly.isChildrenNeeded = "No";
            else if (
                subassembly.isChildrenNeeded === "No" &&
                payload.isChildrenNeeded === "Yes"
            ) {
                subassembly.isChildrenNeeded =
                    isParentOf(subassemblies, currActive) ||
                    isParentOf(components, currActive)
                        ? "added"
                        : "Yes";
            }
        },
        addSubAssemblySpecifications(state, { payload }) {
            state.subassemblies[state.currActive].specifications = payload.map(
                (specification) => [...specification]
            );
        },
        deleteSubassembly(state, { payload }) {
            const { subassemblies, components } = state;
            deleteSubassemblyRecursive(payload, subassemblies, components);
        },
        addComponents(state, { payload }) {
            const { currActive, subassemblies } = state;
            if (
                currActive.startsWith("s") &&
                subassemblies[currActive].isChildrenNeeded === "Yes"
            )
                subassemblies[currActive].isChildrenNeeded = "added";
            for (let component of payload) {
                state.components[component[1]] = {
                    parent: state.currActive,
                    name: component[0],
                    isBoughtUp: component[2],
                    fileLocation: component[3],
                };
            }
            state.currForm = null;
            state.currActive = "";
        },
        deleteComponent(state, { payload }) {
            delete state.components[payload];
        },
        setActive(state, { payload }) {
            state.currActive = payload;
        },
        setCurrForm(state, { payload }) {
            state.currForm = payload;
        },
        reset(state) {
            Object.assign(state, JSON.parse(JSON.stringify(initialState)));
        },
        set(state, { payload }) {
            const product = JSON.parse(JSON.stringify(payload));
            product.currActive = "";
            product.currForm = "";
            Object.assign(state, product);
        },
        setHasProducts(state, { payload }) {
            state.hasProducts = payload ? true : false;
        },
    },
});

const backendSlice = createSlice({
    name: "backend",
    initialState: { products: [] },
    reducers: {
        addProduct(state, { payload }) {
            const product = JSON.parse(JSON.stringify(payload));
            const index = state.products.findIndex(
                (prod) => prod.id === product.id
            );
            if (index === -1) state.products.push(product);
            else state.products[index] = product;
        },
        duplicateProduct(state, { payload }) {
            const product = JSON.parse(JSON.stringify(payload.product));
            product.name = payload.name;
            product.fileLocation = payload.fileLocation;
            product.id = payload.id;
            state.products.push(product);
        },
        deleteProduct(state, { payload }) {
            state.products = state.products.filter(
                (product) => product.id !== payload
            );
        },
    },
});

const store = configureStore({
    reducer: {
        product: productSlice.reducer,
        backend: backendSlice.reducer,
    },
});

export default store;

export const productActions = productSlice.actions;
export const backendActions = backendSlice.actions;
