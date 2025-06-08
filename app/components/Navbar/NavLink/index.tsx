import { Link, useLocation } from "react-router-dom";
import {
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navbar-menu";
import { PropsWithChildren } from "react";

interface NavLinkProps {
    path: string;
}
const NavLink = ({ path, children }: PropsWithChildren<NavLinkProps>) => {
    const location = useLocation();
    const isActive = path === location.pathname;
    return (
        <NavigationMenuItem className="flex-1">
            <Link to={path}>
                <NavigationMenuLink
                    asChild
                    className={cn(
                        navigationMenuTriggerStyle({
                            type: "icon",
                        }),
                        isActive &&
                            "bg-gradient-to-b from-accent to-linear text-navbar-active"
                    )}>
                    <div>{children}</div>
                </NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    );
};

export default NavLink;
