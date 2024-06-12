import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function useToggler() {
    const [hideCrown, setHideCrown] = useState(true);
    const { subassemblies, components } = useSelector((state) => state.product);
    const isInitialRender = useRef(true);

    useEffect(() => {
        if (isInitialRender.current) isInitialRender.current = false;
        else setHideCrown(false);
    }, [components, subassemblies]);

    function handleTogglerClick() {
        setHideCrown((prevState) => !prevState);
    }

    return { hideCrown, handleTogglerClick };
}

export default useToggler;
