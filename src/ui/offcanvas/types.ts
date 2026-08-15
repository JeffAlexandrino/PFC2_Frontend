import React from "react";

import * as Bootstrap from "react-bootstrap";

export type OffcanvasRootProps = Bootstrap.OffcanvasProps & {};
export type OffcanvasHeaderProps = Bootstrap.OffcanvasHeaderProps & {};
export type OffcanvasBodyProps = Omit<Bootstrap.OffcanvasBodyProps, "as"> & {};
export type OffcanvasTitleProps = Omit<Bootstrap.OffcanvasTitleProps, "as"> & {};
export type OffcanvasFooterProps = React.HTMLAttributes<HTMLDivElement> & {};
