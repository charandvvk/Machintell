import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    fileLocation: "",
    id: "",
    mainFunction: "",
    secondaryFunctions: [],
    specifications: [],
    subassemblies: {},
    components: {},
    currActive: "",
    currForm: "",
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
            state.currForm = "";
        },
        addProductDetails(state, { payload }) {
            state.mainFunction = payload.mainFunction;
            state.secondaryFunctions = [...payload.secondaryFunctions];
        },
        addProductSpecifications(state, { payload }) {
            state.specifications = payload.map((specification) => ({
                ...specification,
            }));
        },
        // addSubassemblyName(state) {
        //     state.name = "Untitled";
        // },
        addSubassembly(state, { payload }) {
            handleAddChildren(state);
            const subassembly = {
                name: payload.name,
                parent: state.currActive,
                addChildren: payload.addChildren,
            };
            if (subassembly.addChildren) subassembly.hasAddedChildren = false;
            state.subassemblies[payload.id] = subassembly;
            state.currActive = payload.id;
        },
        addComponents(state, { payload }) {
            handleAddChildren(state);
            const components = payload;
            for (let component of components) {
                state.components[component[1].value] = {
                    parent: state.currActive,
                    name: component[0].value,
                };
            }
        },
        setActive(state, { payload }) {
            state.currActive = payload;
        },
        setCurrForm(state, { payload }) {
            state.currForm = payload;
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
