import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    id: "",
    components: {},
    subassemblies: {},
    currActive: "",
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addProductName(state) {
            state.name = "Untitled";
        },
        addProduct(state, action) {
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.currActive = action.payload.id;
        },
        // addSubassemblyName(state) {
        //     state.name = "Untitled";
        // },
        addSubassembly(state, action) {
            handleAddChildren(state);
            const subassembly = {
                name: action.payload.name,
                parent: state.currActive,
                addChildren: action.payload.addChildren,
            };
            if (subassembly.addChildren) subassembly.hasAddedChildren = false;
            state.subassemblies[action.payload.id] = subassembly;
            state.currActive = action.payload.id;
        },
        addComponents(state, action) {
            handleAddChildren(state);
            const components = action.payload;
            for (let component of components) {
                state.components[component[1].value] = {
                    parent: state.currActive,
                    name: component[0].value,
                };
            }
        },
        setActive(state, action) {
            state.currActive = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
    },
});

const store = configureStore({
    reducer: { product: productSlice.reducer },
});

export default store;

export const productActions = productSlice.actions;

function handleAddChildren(state) {
    const { currActive, subassemblies } = state;
    if (currActive.startsWith("s") && subassemblies[currActive].addChildren) {
        subassemblies[currActive].hasAddedChildren = true;
    }
}
