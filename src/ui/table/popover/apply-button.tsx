import { Button, ButtonProps } from "react-bootstrap";

export default function ApplyButton({ variant, size, className, children, ...props }: ButtonProps) {
    return (
        <div className="d-flex w-100 gap-2 justify-content-end p-2">
            <Button
                {...props}
                variant={variant ?? "primary"}
                size={size ?? "sm"}
                className={["w-100", className].join(" ")}
            >
                {children ?? "Aplicar"}
            </Button>
        </div>
    );
}
