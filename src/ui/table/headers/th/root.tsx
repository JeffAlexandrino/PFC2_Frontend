export default function Root({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
    return <th {...props} className={["th-header-cell", className].join(" ")} />;
}
