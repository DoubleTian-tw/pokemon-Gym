import { Outlet } from "react-router-dom";
import Hero from "../components/Hero";
import { HeroProvider } from "../components/Hero/useHeroContext";

const Gym = () => {
    return (
        <>
            <HeroProvider>
                <Hero />
                <Outlet />
            </HeroProvider>
        </>
    );
};
export default Gym;
