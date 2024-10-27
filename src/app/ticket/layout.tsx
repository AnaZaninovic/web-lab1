"use client";

import {Auth0Provider} from "@auth0/auth0-react";
import {ORIGIN} from "@/utils/config";



export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Auth0Provider
            domain="dev-dql1ocd66ubqcx1g.us.auth0.com"
            clientId="2NF7kvzsrAvVqn6NjwYgF1wvRJRRVKXn"
            authorizationParams={{
                redirect_uri: ORIGIN + "/ticket/finauth",
                audience: "https://dev-dql1ocd66ubqcx1g.us.auth0.com/userinfo",
            }}
            useRefreshTokens={true}
            cacheLocation={"localstorage"}
        >
            {children}
        </Auth0Provider>
    );
}
