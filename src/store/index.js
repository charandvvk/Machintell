import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    fileLocation: "",
    id: "",
    mainFunction: "",
    secondaryFunctions: [""],
    specifications: [["", "", ""]],
    subassemblies: {
        untitled: { name: "Untitled", parent: "" },
        // "": {
        //     parent: "",
        //     name: "",
        //     fileLocation: "",
        //     isBoughtUp: "No",
        //     isChildrenNeeded: "No",
        //     mainFunction: "",
        //     secondaryFunction: [""],
        //     specifications: [["", "", ""]],
        // },
    },
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
            state.specifications = payload.map((specification) => [
                ...specification,
            ]);
        },
        addSubassemblyPlaceholderParent(state) {
            state.subassemblies.untitled.parent = state.currActive;
        },
        addSubassembly(state, { payload }) {
            handleChildrenNeed(state);
            const subassembly = {
                parent: state.currActive,
                name: payload.name,
                isChildrenNeeded: payload.isChildrenNeeded,
            };
            state.subassemblies[payload.id] = subassembly;
            state.currForm = "";
            state.currActive = "";
        },
        addComponents(state, { payload }) {
            handleChildrenNeed(state);
            const components = payload;
            for (let component of components) {
                state.components[component[1].value] = {
                    parent: state.currActive,
                    name: component[0].value,
                };
            }
            state.currForm = "";
            state.currActive = "";
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

function handleChildrenNeed(state) {
    const { currActive, subassemblies } = state;
    if (
        currActive.startsWith("s") &&
        subassemblies[currActive].isChildrenNeeded === "Yes"
    ) {
        subassemblies[currActive].isChildrenNeeded = "added";
    }
}
