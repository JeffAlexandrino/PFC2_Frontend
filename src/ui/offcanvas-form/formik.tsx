import { Formik as DefaultFormik, FormikValues } from "formik";
import { OffcanvasFormFormikProps } from "./types";
import { OffcanvasFormContext } from "./root";
import { Form } from "react-bootstrap";
import { useContext } from "react";

export default function Formik<T extends FormikValues>({
    children,
    initialValues,
    onSubmit,
    ...props
}: OffcanvasFormFormikProps<T>) {
    const { formId } = useContext(OffcanvasFormContext);

    return (
        <div className="d-flex h-100 w-100 py-3">
            <DefaultFormik {...props} initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, ...rest }) => (
                    <Form className="d-flex w-100" id={formId} onSubmit={handleSubmit}>
                        {children(rest)}
                    </Form>
                )}
            </DefaultFormik>
        </div>
    );
}
