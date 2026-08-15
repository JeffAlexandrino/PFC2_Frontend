import { Overlay } from "../overlays";
import { HeaderProps } from "../type";
import { Th } from "./th";

export default function NoFilter({ sortKey, title }: HeaderProps) {
    return (
        <Th.Root>
            <Th.SortSection>
                <Overlay.Sort sortKey={sortKey}>{title}</Overlay.Sort>
            </Th.SortSection>
            <Th.FilterSection />
        </Th.Root>
    );
}
