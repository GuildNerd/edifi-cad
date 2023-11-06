import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import { useState, useEffect } from 'react';

type Voluntario = {
    id: number,
    nome: string,
    email?: string,
    cpf: string,
    telefone?: string,
    endereco?: {
        id: number,
        logradouro: string,
        numero: string,
        cep: string,
        bairro: string,
        cidade: string,
        estado: string
    }
}

interface VoluntariosProps {
    APIToken: string
}

export default function Voluntarios({ APIToken }: VoluntariosProps) {
    const [inputContent, setInputContent] = useState("");
    const [searchingAttribute, setSearchingAttribute] = useState("cpf");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [voluntariosList, setVoluntariosList] = useState<Voluntario[]>([]);

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
        if(inputContent.length == 0)
            setIsLoadDefault(true);
        else
            setIsLoadDefault(false);
    }

    const handleSearchBtn = async () => {
        if(inputContent.length != 0) {
            let searchResults: Voluntario[] = await getVoluntario(inputContent);
            setVoluntariosList(searchResults);
        }
        else
            setIsLoadDefault(true)
    }
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchBtn();
        }
    };

    const handleSelectOnChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setSearchingAttribute(event.currentTarget.value);
    }

    async function getVoluntario(voluntarioBuscado: string) {
        try {
            let response = await fetch(`https://edificad-production.up.railway.app/api/voluntario?${searchingAttribute}=${voluntarioBuscado}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Voluntario[] = await response.json();
                return (data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }

        catch (error) {
            return([]);
        }
    }

    async function loadDefaultVoluntarios() {
        try {
            let response = await fetch(`https://edificad-production.up.railway.app/api/voluntario`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Voluntario[] = await response.json();
                setVoluntariosList(data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }

        catch (error) {
            
        }
    }

    useEffect(() => {
        if(isLoadDefault)
            loadDefaultVoluntarios();
    },[isLoadDefault])

    return (
        <div className='h-[100vh] flex flex-col items-center'>
            <h1 className='my-8 text-3xl'>Cadastro de Voluntários</h1>
            <div className='w-full flex justify-center gap-16'>
                <div className='flex items-center gap-2'>
                    <div>
                        <select name="searchingAttribute" id="searchingAttributeSelect" value={searchingAttribute} onChange={(event) => handleSelectOnChange(event)}>
                            <option value="cpf">CPF</option>
                            <option value="nome">Nome</option>
                        </select>
                    </div>
                    <div className="flex gap-1 justify-end rounded-md border-2 bg-white border-baby-blue">
                        <input type="search" placeholder="Buscar voluntário" value={inputContent} onChange={handleInputChange} onKeyDown={(event) => handleKeyDown(event)} className="p-1 rounded-md text-center outline-none" />
                        <button onClick={handleSearchBtn}>
                            <SearchIcon className='text-baby-blue'></SearchIcon>
                        </button>
                    </div>
                </div>
                
                <div>
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-baby-blue border-2 border-baby-blue text-white'>
                        <AddIcon></AddIcon>
                        Novo voluntário
                    </button>
                </div>

                <div>
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-baby-blue border-2 border-baby-blue text-white'>
                        <ChangeCircleIcon></ChangeCircleIcon>
                        Alterar dados de voluntário
                    </button>
                </div>
            </div>
            <div className='mt-4'>
                <table className='rounded-sm bg-white'>
                    <thead>
                        <tr className='text-center'>
                            <th className='px-2'>CPF</th>
                            <th className='px-2'>Nome</th>
                            <th className='px-2'>Telefone</th>
                            <th className='px-2'>Email</th>
                            <th className='px-2'>Endereço</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            voluntariosList.map((voluntario, index) =>
                            <tr className='text-sm' key={index}>
                                <td className='px-2 border-[1px] border-gray-600'>{voluntario.cpf}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{voluntario.nome}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{voluntario.telefone}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{voluntario.email}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{`${voluntario.endereco?.logradouro}, ${voluntario.endereco?.numero}, ${voluntario.endereco?.bairro}, ${voluntario.endereco?.cidade} - ${voluntario.endereco?.estado}, ${voluntario.endereco?.cep}`}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}