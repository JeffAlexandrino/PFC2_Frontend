export default function cn(classNames: (string | false | null | undefined)[]) {
    const definedClasses = classNames.filter((className) => className);
    return definedClasses.join(" ");
}
