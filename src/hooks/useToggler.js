import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function useToggler() {
    const [hideCrown, setHideCrown] = useState(true);
    const { subassemblies, components } = useSelector((state) => state.product);

    useEffect(() => {
        setHideCrown(false);
    }, [components, subassemblies]);

    function handleTogglerClick() {
        setHideCrown((prevState) => !prevState);
    }

    return { hideCrown, handleTogglerClick };
}

export default useToggler;
