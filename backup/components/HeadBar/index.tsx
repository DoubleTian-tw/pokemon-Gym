import React, { FunctionComponent, memo, ReactNode, useMemo } from "react";
import { BiMenuAltRight, BiArrowBack } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BarBtnProps {
    children: ReactNode;
    className?: string;
}

const BarButton: FunctionComponent<BarBtnProps> = memo(
    ({ children, className }) => {
        return (
            <Button variant="ghost" className={cn("p-3 h-6 w-6", className)}>
                <div className="text-2xl">{children}</div>
            </Button>
        );
    }
);
BarButton.displayName = "BarButton";

interface BarProps {
    title: string;
}

const HeadBar: FunctionComponent<BarProps> = memo(({ title }) => {
    const havePrePage = true;
    return (
        <div className="flex justify-between items-center mt-2 mb-6">
            <BarButton className={havePrePage ? "visible" : "invisible"}>
                <BiArrowBack />
            </BarButton>
            <div className="text-xl font-bold tracking-widest">{title}</div>
            <BarButton>
                <BiMenuAltRight />
            </BarButton>
        </div>
    );
});
HeadBar.displayName = "HeadBar";

export default HeadBar;
