import cn from "../../utils/cn";
import React from "react";

import "./styles.css";

import { ProgressLineListProps, ProgressLineStepProps } from "./types";

export default function List({ className, orientation, children, ...props }: ProgressLineListProps) {
    const arrChildren = React.Children.toArray(children).filter((child) =>
        React.isValidElement<ProgressLineStepProps<any>>(child)
    );

    const indexOfActiveChild = arrChildren.findIndex((child) => child.props.active);
    const childrenModified = arrChildren.map((child, index) =>
        index < indexOfActiveChild ? React.cloneElement(child, { ...child.props, completed: true }) : child
    );

    return (
        <ol {...props} className={cn(["progress-line-list", className, orientation])}>
            {childrenModified}
        </ol>
    );
}
