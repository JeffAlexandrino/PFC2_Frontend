import { Stack } from "react-bootstrap";
import { ReactNode } from "react";

export interface GroupRadioRootProps {
    className?: string;
    children?: ReactNode;
}

export default function GroupRadioRoot(props: GroupRadioRootProps) {
    return <Stack className={`${props.className}`}>{props.children}</Stack>;
}
