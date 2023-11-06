import { useState } from "react";

export interface LoginProps {
    handleChangePage: (newPage?: string) => void,
    handleSetAPIToken: (token: string) => void
}

export default function Login({ handleChangePage, handleSetAPIToken }: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowLoginError, setShowLoginError] = useState(false);

    function handleInputChangeUsername(event: React.FormEvent<HTMLInputElement>) {
        setUsername(event.currentTarget.value);
    }

    function handleInputChangePassword(event: React.FormEvent<HTMLInputElement>) {
        setPassword(event.currentTarget.value);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter')
            checkLogin();
    };

    async function checkLogin() {
        let requestBody = {
            "username": "" + username,
            "password": "" + password
        }

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }

        try {
            const response = await fetch("https://edificad-production.up.railway.app/api/auth/login", requestOptions)
            
            if(response.ok){
                let data = await response.json();
                handleSetAPIToken(data.token);
                handleChangePage("home");
            }
            else
                throw new Error (`${response.status} ${response.statusText}`);
        }

        catch (error) {
            setShowLoginError(true)
        }
    }

    return (
        <div className="h-[100vh] bg-neon-blue flex flex-col md:flex-row items-center justify-evenly bg-[url('./src/assets/bg-login-screen-bw.jpg')] bg-cover">
            <div className="h-[100vh] flex flex-grow-[1] flex-col items-center justify-center gap-4 text-white">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="font-bold text-2xl md:text-5xl">Edifi-Cad</h1>
                    <h2 className="text-md md:text-xl">Sistema de cadastro e gestão</h2>
                </div>
            </div>
            <div className="flex-grow-[1] flex flex-col gap-12 items-center">
                <img src="src\assets\logo.jpg" alt="" className="bg-white rounded-[50%] h-32 w-32" />
                <div className="w-[80%] mx-4 p-8 rounded-md flex flex-col items-center gap-2 bg-white" onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event)}>
                    <p className="text-lg text-slate-700">Faça login para acessar o sistema</p>
                    <input type="text" placeholder="Usuário" className="w-[70%] p-2 rounded-md border-2 border-gray-400" onChange={handleInputChangeUsername} onFocus={() => setShowLoginError(false)} />
                    <input type="password" placeholder="Senha" className="w-[70%] p-2 rounded-md border-2 border-gray-400" onChange={handleInputChangePassword} onFocus={() => setShowLoginError(false)} />
                    <button className="w-[50%] py-2 px-4 rounded-md bg-neon-pink text-white" onClick={() => checkLogin()}>Entrar</button>
                    {
                        isShowLoginError ? <p className="text-red-500 text-bold">Ocorreu um erro no login, tente novamente.</p> : null
                    }
                </div>
            </div>
        </div>
    )
}