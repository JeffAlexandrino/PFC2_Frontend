import { OffcanvasFormContextProps, OffcanvasFormRootProps } from "./types";
import { createContext, useId } from "react";
import { Offcanvas } from "react-bootstrap";

export const OffcanvasFormContext = createContext<OffcanvasFormContextProps>({ formId: "", onHide: null! });

export default function Root({ placement, onHide, ...props }: OffcanvasFormRootProps) {
    const formId = useId();

    return (
        <OffcanvasFormContext.Provider value={{ formId, onHide }}>
            <Offcanvas {...props} onHide={onHide} placement={placement ?? "end"} />
        </OffcanvasFormContext.Provider>
    );
}
