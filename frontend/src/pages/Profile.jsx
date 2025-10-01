import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";

export default function Profile() {
    const api = useApi();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        api.profile().then(setProfile).catch(console.error);
    }, []);

    if (!profile) return <p>Carregando…</p>;

    return (
        <div>
            <h2>Meu Perfil</h2>
            <p>Nome: {profile.name}</p>
            <p>Email: {profile.email}</p>
        </div>
    );
}
