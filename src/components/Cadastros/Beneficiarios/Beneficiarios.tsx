import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { useState, useEffect } from 'react';

type Beneficiario = {
    id: number,
    nome: string,
    email?: string,
    cpf: string,
    telefone?: string,
    data_nascimento: string,
    endereco?: {
        id: number,
        logradouro: string,
        numero: string,
        cep: string,
        bairro: string,
        cidade: string,
        estado: string
    }
    dependentes: [{
        id: number,
        nome: string,
        email?: string,
        cpf: string,
        telefone?: string,
        data_nascimento: string
    }];
}

interface BeneficiariosProps {
    APIToken: string
}

export default function Beneficiarios({ APIToken }: BeneficiariosProps) {
    const [inputContent, setInputContent] = useState("");
    const [searchingAttribute, setSearchingAttribute] = useState("cpf");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [beneficiariosList, setBeneficiariosList] = useState<Beneficiario[]>([])

    const handleSearchBtn = async () => {
        if(inputContent.length != 0) {
            setIsLoadDefault(true);
            let searchResults: Beneficiario[] = await getBeneficiario(inputContent);
            setBeneficiariosList(searchResults);
        }
        else
            setIsLoadDefault(true);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter')
            handleSearchBtn();
    };

    const handleInputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        setInputContent(e.currentTarget.value);
        if(inputContent.length == 0)
            setIsLoadDefault(true)
        else
            setIsLoadDefault(false)
    }

    const handleSelectOnChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setSearchingAttribute(event.currentTarget.value);
    }

    async function getBeneficiario(beneficiarioBuscado: string) {
        try {
            let response = await fetch(`https://edificad-production.up.railway.app/api/beneficiario?${searchingAttribute}=${beneficiarioBuscado}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Beneficiario[] = await response.json();
                return (data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }

        catch (error) {
            return([]);
        }
    }

    async function loadDefaultBeneficarios() {
        try {
            let response = await fetch(`https://edificad-production.up.railway.app/api/beneficiario`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Beneficiario[] = await response.json();
                setBeneficiariosList(data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }

        catch (error) {
            
        }
    }

    useEffect(() => {
        if(isLoadDefault)
            loadDefaultBeneficarios();
    },[isLoadDefault])

    return (
        <div className='h-[100vh] flex flex-col items-center'>
            <h1 className='my-8 text-3xl'>Cadastro de Beneficiários</h1>
            <div className='w-full flex justify-center gap-16'>
                <div className='flex items-center gap-2'>
                    <div>
                        <select name="searchingAttribute" id="searchingAttributeSelect" value={searchingAttribute} onChange={(event) => handleSelectOnChange(event)}>
                            <option value="cpf">CPF</option>
                            <option value="nome">Nome</option>
                        </select>
                    </div>
                    <div className="flex gap-1 justify-end rounded-md border-2 bg-white border-neon-pink">
                        <input type="search" name="inputSearch" placeholder="Buscar beneficiário" value={inputContent} onChange={handleInputOnChange} onKeyDown={(event) => handleKeyDown(event)} className="p-1 rounded-md text-center outline-none" />
                        <button onClick={handleSearchBtn}>
                            <SearchIcon className='text-neon-pink'></SearchIcon>
                        </button>
                    </div>
                </div>

                <div>
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-pink border-2 border-neon-pink text-white'>
                        <AddIcon></AddIcon>
                        Novo beneficiário
                    </button>
                </div>
                <div>
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-pink border-2 border-neon-pink text-white'>
                        <ChangeCircleIcon></ChangeCircleIcon>
                        Alterar dados de beneficiário
                    </button>
                </div>
            </div>
            <div className='mt-4'>
                <table className='rounded-sm px-4 bg-white'>
                    <thead>
                        <tr className='text-center'>
                            <th className='px-2'>CPF</th>
                            <th className='px-2'>Nome</th>
                            <th className='px-2'>Data de nascimento</th>
                            <th className='px-2'>Telefone</th>
                            <th className='px-2'>Email</th>
                            <th className='px-2'>Endereço</th>
                            <th className='px-2'>Dependentes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            beneficiariosList.map((beneficiario, index) =>
                                <tr className='text-sm' key={index}>
                                    <td className='px-2 border-[1px] border-gray-600'>{beneficiario.cpf}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{beneficiario.nome}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{beneficiario.data_nascimento ? beneficiario.data_nascimento : null}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{beneficiario.telefone}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{beneficiario.email}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{`${beneficiario.endereco?.logradouro}, ${beneficiario.endereco?.numero}, ${beneficiario.endereco?.bairro}, ${beneficiario.endereco?.cidade} - ${beneficiario.endereco?.estado}, ${beneficiario.endereco?.cep}`}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>
                                        {
                                            beneficiario.dependentes != undefined && beneficiario.dependentes.length > 0 ?
                                                <Popup trigger={<button className='font-bold'><VisibilityIcon className='mr-2' />Exibir</button>} position="right center" modal>
                                                    <table className='rounded-sm bg-white'>
                                                        <thead>
                                                            <tr className='text-center'>
                                                                <th className='px-2'>CPF</th>
                                                                <th className='px-2'>Nome</th>
                                                                <th className='px-2'>Data de nascimento</th>
                                                                <th className='px-2'>Telefone</th>
                                                                <th className='px-2'>Email</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                beneficiario.dependentes.map((dependente, index) =>
                                                                    <tr className='text-sm' key={index}>
                                                                        <td className='px-2 border-[1px] border-gray-600'>{dependente.cpf}</td>
                                                                        <td className='px-2 border-[1px] border-gray-600'>{dependente.nome}</td>
                                                                        <td className='px-2 border-[1px] border-gray-600'>{dependente.data_nascimento}</td>
                                                                        <td className='px-2 border-[1px] border-gray-600'>{dependente.telefone}</td>
                                                                        <td className='px-2 border-[1px] border-gray-600'>{dependente.email}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        </tbody>

                                                    </table>
                                                </Popup>
                                                :
                                                <p>Não possui</p>
                                        }
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}