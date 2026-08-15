import cn from "../../utils/cn";

export default function Description({ className, children, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            {...props}
            className={cn([
                "bg-info rounded p-2 bg-opacity-25 text-info fw-bold border border-info border-2 d-flex gap-2 align-items-center",
                className,
            ])}
        >
            {children}
        </p>
    );
}
