import { SpanOverlayMenuProps } from "./types";
import { SpanOverlayContext } from "./root";
import { Overlay } from "react-bootstrap";
import { useContext } from "react";

export default function Menu({ rootClose, onHide, show, flip, placement, ...props }: SpanOverlayMenuProps) {
    const { setShow, show: internalShow } = useContext(SpanOverlayContext);

    return (
        <Overlay
            {...props}
            rootClose={rootClose ?? true}
            onHide={onHide ? onHide : () => setShow(false)}
            show={show ?? internalShow}
            flip={flip ?? true}
            placement={placement ?? "bottom"}
        />
    );
}
