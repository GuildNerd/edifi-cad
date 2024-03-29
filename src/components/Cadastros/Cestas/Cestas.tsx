import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Button } from '@mui/material';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { useState, useEffect } from 'react';

import UpdateCesta from './UpdateCesta';
import CreateCesta from './CreateCesta';

const URL = "https://edificad-production.up.railway.app/api/cesta";

export type Cesta = {
    id: number,
    nome: string,
    descricao: string,
    quantidade_estoque: number,
}

interface CestasProps {
    APIToken: string
}

export default function Cestas({ APIToken }: CestasProps) {
    const [inputContent, setInputContent] = useState("");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [isShowUpdateCesta, setIsShowUpdateCesta] = useState(false);
    const [cestasList, setCestasList] = useState<Cesta[]>([]);
    const [openPopupCreate, setOpenPopupCreate] = useState(false);

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
        if (event.currentTarget.value.length == 0)
            setIsLoadDefault(true);
        else
            setIsLoadDefault(false);
    }

    const handleSearchBtn = async () => {
        if (inputContent.length != 0) {
            setIsLoadDefault(true);
            let searchResults: Cesta[] = await getCesta(inputContent);
            setCestasList(searchResults);
        }
        else
            setIsLoadDefault(true);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchBtn();
        }
    };

    async function getCesta(cestaBuscada: string) {
        try {
            let response = await fetch(`${URL}?nome=${cestaBuscada}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Cesta[] = await response.json();
                return (data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }
        catch (error) {
            return ([]);
        }
    }

    async function loadDefaultCestas() {
        try {
            let response = await fetch(`${URL}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Cesta[] = await response.json();
                setCestasList(data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }

        catch (error) {
            console.log(`Um erro ocorreu: ${error}`)
        }
    }

    // removendo cesta
    const handleDeleteCesta = async (cestaId: number) => {
        try {
            const response = await fetch(`${URL}/${cestaId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                },
            });

            if (response.ok) {
                loadDefaultCestas();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao excluir cesta:', error);
        }
    }

    useEffect(() => {
        loadDefaultCestas();
    }, [isLoadDefault])

    return (
        <div className='h-[100vh] flex flex-col items-center'>
            <h1 className='my-8 text-3xl'>Cadastro de Cestas</h1>
            <div className='w-full flex justify-center gap-16'>
                <div className="flex gap-1 justify-end rounded-md border-2 bg-white border-neon-orange">
                    <input type="search" placeholder="Buscar cesta por nome" id="searchCesta" value={inputContent} onChange={handleInputChange} onKeyDown={(event) => handleKeyDown(event)} className="p-1 rounded-md text-center outline-none" />
                    <button onClick={handleSearchBtn}>
                        <SearchIcon className='text-neon-orange'></SearchIcon>
                    </button>
                </div>
                <div>
                    <Popup open={openPopupCreate} trigger={
                        <button onClick={() => setOpenPopupCreate(true)} className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-orange border-2 border-neon-orange text-white'>
                            <AddIcon />
                            Nova cesta
                        </button>
                    } position="right center" modal>
                        <CreateCesta APIToken={APIToken} loadDefault={loadDefaultCestas} />
                    </Popup>
                </div>
                <div>
                    <Popup trigger={
                        <button onClick={() => setIsShowUpdateCesta(!isShowUpdateCesta)} className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-orange border-2 border-neon-orange text-white'>
                            <ChangeCircleIcon></ChangeCircleIcon>
                            Alterar dados de cesta
                        </button>
                    } position="right center" modal>
                        <UpdateCesta APIToken={APIToken} />
                    </Popup>
                </div>
            </div>
            <div className='mt-4'>
                <table className='rounded-sm bg-white'>
                    <thead>
                        <tr className='text-center'>
                            <th className='px-2'></th>
                            <th className='px-2'>Identificador</th>
                            <th className='px-2'>Nome</th>
                            <th className='px-2'>Descrição</th>
                            <th className='px-2'>Quantidade em estoque</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cestasList.map((cesta, index) =>
                                <tr className='text-sm' key={index}>
                                    <td className='px-2 border-[1px] border-gray-600'>
                                        <Popup trigger={
                                            <button onClick={() => handleDeleteCesta(cesta.id)}>
                                                <DeleteIcon className='text-red-500'></DeleteIcon>
                                            </button>
                                        } position="right center">
                                            <div className='p-4'>
                                                <p>Tem certeza de que deseja excluir a cesta {"\"" + cesta.nome + "\""}?</p>
                                                <div className='mt-2 flex flex-col gap-2'>
                                                    <Button variant='contained' onClick={() => handleDeleteCesta(cesta.id)} className='bg-red-500 text-white'>
                                                        Confirmar
                                                    </Button>
                                                </div>
                                            </div>
                                        </Popup>
                                    </td>
                                    <td className='px-2 border-[1px] border-gray-600'>{cesta.id}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{cesta.nome}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{cesta.descricao}</td>
                                    <td className='px-2 border-[1px] border-gray-600'>{cesta.quantidade_estoque}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}