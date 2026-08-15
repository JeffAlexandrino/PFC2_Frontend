import { PopoverContentProps } from "../type";

import cn from "../../../utils/cn";

import "./styles.css";

export default function Content({ className, ...props }: PopoverContentProps) {
    return <div {...props} className={cn(["table-popover-content", className])} />;
}
