import {
    PopoverHeaderProps as BPopoverHeaderProps,
    PopoverProps,
    PopoverBodyProps as BPopoverBodyProps,
} from "react-bootstrap";

export type PopoverRootProps = PopoverProps & {};
export type PopoverHeaderProps = Omit<BPopoverHeaderProps, "as"> & {};
export type PopoverBodyProps = Omit<BPopoverBodyProps, "as"> & {};
