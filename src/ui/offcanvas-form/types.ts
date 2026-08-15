import { ButtonProps, OffcanvasHeaderProps, OffcanvasProps, OffcanvasTitleProps } from "react-bootstrap";
import { FormikHelpers, FormikProps } from "formik";
import React, { ReactNode } from "react";

import * as yup from "yup";

export type OffcanvasFormRootProps = OffcanvasProps & {};
export type OffcanvasFormHeaderProps = OffcanvasHeaderProps & {};
export type OffcanvasFormBodyProps = React.HTMLAttributes<HTMLDivElement> & {};
export type OffcanvasFormFormikProps<T extends yup.AnyObject> = {
    initialValues: T;
    onSubmit: (values: T, helpers: FormikHelpers<T>) => void;
    children: (props: Omit<FormikProps<T>, "handleSubmit">) => ReactNode;
    validateOnChange?: boolean;
    validationSchema?: yup.ObjectSchema<T, yup.AnyObject, any, "">;
};
export type OffcanvasFormResetProps = Omit<ButtonProps, "type"> & {};
export type OffcanvasFormSubmitProps = ButtonProps & { pending?: boolean };
export type OffcanvasFormFooterProps = React.HTMLAttributes<HTMLDivElement> & {};
export type OffcanvasFormTitleProps = Omit<OffcanvasTitleProps, "as"> & {};
export type OffcanvasFormWarningMessageProps = React.HTMLAttributes<HTMLDivElement> & {};

export type OffcanvasFormContextProps = { formId: string; onHide: () => void };
