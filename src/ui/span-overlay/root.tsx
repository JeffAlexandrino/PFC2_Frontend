import { SpanOverlayContextProps, SpanOverlayRootProps } from "./types";

import cn from "../../utils/cn";
import React from "react";

export const SpanOverlayContext = React.createContext<SpanOverlayContextProps>({ show: false, setShow: () => {} });

export default function Root({ className, ...props }: SpanOverlayRootProps) {
    const [show, setShow] = React.useState(false);

    return (
        <SpanOverlayContext.Provider value={{ show, setShow }}>
            <div {...props} className={cn(["d-flex w-full", className])} />
        </SpanOverlayContext.Provider>
    );
}
