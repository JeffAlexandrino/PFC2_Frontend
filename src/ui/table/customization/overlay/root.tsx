import { OverlayTrigger, OverlayTriggerProps } from "react-bootstrap";

export type CustomizationOverlayRootProps = OverlayTriggerProps & {};

export default function Root({ trigger, rootClose, ...props }: CustomizationOverlayRootProps) {
    return <OverlayTrigger {...props} trigger={trigger ?? "click"} rootClose={rootClose ?? true} placement="left-start"/>;
}

