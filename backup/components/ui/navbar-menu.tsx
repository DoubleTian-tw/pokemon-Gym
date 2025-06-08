import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type directionTypes = "above" | "below" | "left" | "right";

interface directionProps {
    above: string;
    below: string;
    left: string;
    right: string;
}

const NavigationMenu = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
        viewportDirection?: directionTypes;
    }
>(({ className, children, viewportDirection = "above", ...props }, ref) => (
    <NavigationMenuPrimitive.Root
        ref={ref}
        className={cn(
            "relative z-10 flex max-w-max flex-1 items-center justify-center",
            className
        )}
        {...props}>
        {children}
        <NavigationMenuViewport viewportDirection={viewportDirection} />
    </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.List
        ref={ref}
        className={cn(
            "group flex flex-1 list-none items-center justify-center space-x-1",
            className
        )}
        {...props}
    />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
    "group inline-flex items-center justify-center rounded-md font-medium transition-colors hover:bg-gradient-to-b hover:from-accent hover:to-linear focus:bg-gradient-to-b focus:from-accent focus:to-linear focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
    {
        variants: {
            type: {
                text: "h-10 w-max px-4 py-2 text-sm",
                icon: "h-20 w-auto px-4 py-6",
                textIcon: "",
            },
            defaultVariants: {
                size: "text",
            },
        },
    }
);

type displayType = "text" | "icon";

const NavigationMenuTrigger = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
        displayType?: displayType;
    }
>(({ className, children, displayType, ...props }, ref) => (
    <NavigationMenuPrimitive.Trigger
        ref={ref}
        className={cn(
            navigationMenuTriggerStyle({
                type: displayType,
            }),
            "group",
            className
        )}
        {...props}>
        {children}
        <ChevronDown
            className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
        />
    </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Content
        ref={ref}
        className={cn(
            "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ",
            className
        )}
        {...props}
    />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
        viewportDirection: directionTypes;
    }
>(({ className, viewportDirection, ...props }, ref) => {
    const directionClass: directionProps = {
        above: "left-0 bottom-full",
        below: "left-0 top-full",
        left: "right-full top-0",
        right: "left-full top-0",
    };
    return (
        <div
            className={cn(
                "absolute flex justify-center",
                directionClass[viewportDirection]
            )}>
            <NavigationMenuPrimitive.Viewport
                className={cn(
                    "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] bg-navbar",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});
NavigationMenuViewport.displayName =
    NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
    React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
    <NavigationMenuPrimitive.Indicator
        ref={ref}
        className={cn(
            "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
            className
        )}
        {...props}>
        <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
    NavigationMenuPrimitive.Indicator.displayName;

export {
    navigationMenuTriggerStyle,
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuContent,
    NavigationMenuTrigger,
    NavigationMenuLink,
    NavigationMenuIndicator,
    NavigationMenuViewport,
};
