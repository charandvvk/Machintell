import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    fileLocation: "",
    id: "",
    subassemblies: {},
    components: {},
    currActive: "",
    currForm: "",
};

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
        addSubassemblyPlaceholder(state) {
            state.subassemblies.untitled = {
                name: "Untitled",
                parent: state.currActive,
            };
        },
        deleteSubassemblyPlaceholder(state) {
            delete state.subassemblies.untitled;
        },
        addSubassembly(state, { payload }) {
            const subassembly = {
                parent: state.currActive,
                name: payload.name,
                isChildrenNeeded: payload.isChildrenNeeded,
                fileLocation: payload.fileLocation,
                isBoughtUp: payload.isBoughtUp,
            };
            state.subassemblies[payload.id] = subassembly;
            state.currActive = payload.id;
            state.currForm = "subAssemblyDetails";
        },
        addSubassemblyDetails(state, { payload }) {
            const { subassemblies, currActive } = state;
            const subassembly = subassemblies[currActive];
            if (payload.target === "component parent")
                subassembly.isChildrenNeeded = "added";
            else if (payload.target === "subassembly parent") {
                const parentId = subassembly.parent;
                subassemblies[parentId].isChildrenNeeded = "added";
            } else {
                subassembly.name = payload.name;
                subassembly.isChildrenNeeded = payload.isChildrenNeeded;
                delete subassembly.fileLocation;
                delete subassembly.isBoughtUp;
            }
        },
        deleteSubassembly(state, { payload }) {
            const { subassemblies, components } = state;
            deleteSubassemblyRecursive(payload, subassemblies, components);
        },
        addComponent(state, { payload }) {
            const { currActive, components } = state;
            if (currActive.startsWith("c"))
                components[currActive].name = payload.name;
            else {
                components[payload.id] = {
                    name: payload.name,
                    parent: currActive,
                };
            }
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
    },
});

const store = configureStore({
    reducer: {
        product: productSlice.reducer,
    },
});

export default store;

export const productActions = productSlice.actions;
