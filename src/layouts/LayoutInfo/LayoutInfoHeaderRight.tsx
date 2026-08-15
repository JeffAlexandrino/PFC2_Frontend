import { ReactNode } from "react";

import "./styles.css";

interface ILayoutInfoHeaderRightProps {
    children?: ReactNode;
}

export default function LayoutInfoHeaderRight(props: ILayoutInfoHeaderRightProps) {
    return <div className="d-flex my-layout-info-header-right align-items-center gap-3">{props.children}</div>;
}
