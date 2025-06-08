import { PropsWithChildren } from "react";
import { ThemeProvider } from "./themes";

const Providers = ({ children }: PropsWithChildren) => {
    return <ThemeProvider>{children}</ThemeProvider>;
};

export default Providers;
