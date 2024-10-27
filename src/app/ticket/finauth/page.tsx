"use client";

import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

const FinauthPage = () => {
    const {handleRedirectCallback} = useAuth0();
    const {push} = useRouter();

    const handleRedirect = async () => {
        try {
            const data = await handleRedirectCallback();
            push(`/ticket/${data.appState.ticketId}`);
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        void handleRedirect();
    }, []);

    return (
        <div>
        </div>
    );
}

export default FinauthPage;
