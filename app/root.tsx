import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
} from "@remix-run/react";

import stylesHref from "./tailwind.css?url";

export const links: LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    { rel: "stylesheet", href: stylesHref, type: "text/css" },
];

export const meta: MetaFunction = () => {
    return [
        {
            title: "Pokemon Gym 神奇寶貝道館 | 打道館沒煩惱 | 快速推薦打道館角色",
        },
        {
            name: "description",
            content:
                "想打道館時總是忘記該選甚麼屬性、神奇寶貝嗎? 還是每次都要一一查名稱呢? 很花時間又開很多分頁! 體驗看看Pokemon Gym帶來的方便吧! 不用再為選擇困擾啦!",
        },
        {
            name: "og:title",
            content: "Pokemon Gym | 神奇寶貝道館",
        },
        {
            name: "og:description",
            content:
                "想打道館時總是忘記該選甚麼屬性、神奇寶貝嗎? 還是每次都要一一查名稱呢? 很花時間又開很多分頁! 體驗看看Pokemon Gym帶來的方便吧! 不用再為選擇困擾啦!",
        },
    ];
};

export function ErrorBoundary() {
    const error = useRouteError();
    return (
        <html lang="en">
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <h1>
                    {isRouteErrorResponse(error)
                        ? `${error.status} ${error.statusText}`
                        : error instanceof Error
                        ? error.message
                        : "Unknown Error"}
                </h1>
                <Scripts />
            </body>
        </html>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
