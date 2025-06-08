import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from "@/components/ui/navbar-menu";
import { PropsWithChildren, ReactNode } from "react";

interface NavTriggerProps {
    navWidth: number;
    content: ReactNode;
}
const NavTrigger = ({
    navWidth,
    content,
    children,
}: PropsWithChildren<NavTriggerProps>) => {
    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger displayType="icon">
                <div>{children}</div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul
                    className="grid grid-cols-1 gap-4 p-4 md:w-[400px] lg:w-[500px] "
                    style={{ width: `${navWidth}px` }}>
                    {content}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
};

export default NavTrigger;
