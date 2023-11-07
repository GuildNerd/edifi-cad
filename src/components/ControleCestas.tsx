import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Popup from 'reactjs-popup';
import Autocomplete from '@mui/material/Autocomplete';

import 'reactjs-popup/dist/index.css';

import 'reactjs-popup/dist/index.css';
import { Grid, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';

type ControleCesta = {
    id: number,
    cesta: string,
    recebido_por: string,
    voluntario_responsavel: string,
    data_hora: Date
}

type DistribuicaoCesta = {
    id:number,
    data_hora: Date,
    cesta : {
        id : number,
        nome : string
    },
    voluntario : {
        id : number,
        nome : string,
        cpf : string
    },
    beneficiario :{
        id : number,
        nome : string,
        cpf : string
    }
}

interface ControleCestasProps {
    APIToken: string
}

export default function ControleCestas({APIToken}: ControleCestasProps) {
    const [inputContent, setInputContent] = useState("");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [controleCestasList, setControleCestaList] = useState<DistribuicaoCesta[]>([]);

    let controleCestasList2: ControleCesta[] = [{
        id: 1,
        cesta: "Cesta básica",
        recebido_por: "João da Silva Santos",
        voluntario_responsavel: "Fernanda Dandara Pereira",
        data_hora: new Date("10/31/2023, 07:55")
    },
    {
        id: 2,
        cesta: "Cesta junina",
        recebido_por: "Tomas de Aquino",
        voluntario_responsavel: "Tamara Dias Ximenes",
        data_hora: new Date("10/25/2023, 16:16")
    },
    {
        id: 3,
        cesta: "Cesta natal",
        recebido_por: "Paula Matos",
        voluntario_responsavel: "Daniel Gomes",
        data_hora: new Date("10/12/2023, 20:34")
    },
    {
        id: 4,
        cesta: "Cesta XG",
        recebido_por: "João da Silva Santos",
        voluntario_responsavel: "Fernanda Dandara Pereira",
        data_hora: new Date("11/05/2022, 11:20")
    }];

    async function loadDefaultDistribuicaoCesta() {
        try {
            let response = await fetch(`https://edificad-production.up.railway.app/api/distribuicao-cesta`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: DistribuicaoCesta[] = await response.json();
                setControleCestaList(data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }

        catch (error) {

        }
    }

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
    }

    const handleSearchBtn = () => {
        getCesta(inputContent);
    }

    async function getCesta(controleBuscado: string) {
        await fetch(`https://edificad-production.up.railway.app/api/cesta/${controleBuscado}`)
        .then((resposta) => resposta.json())
        .then((data) => {
            controleCestasList.push(data);
        })
    }
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {    
        if (event.key === 'Enter') {
          handleSearchBtn();
        }
    };

    useEffect(() => {
        if (isLoadDefault)
            loadDefaultDistribuicaoCesta();
    }, [isLoadDefault])

    return (
        <div className='h-[100vh] flex flex-col items-center bg-white'>
            <h1 className='my-8 text-gray-800 text-3xl'>Controle de distribuição de cestas</h1>
            <div className='my-4 ml-8 self-start'>
                <h3 className='text-gray-800 text-xl'>Dados do último mês</h3>
                <div className='flex justify-center gap-16 text-gray-800'>
                    <p>Cestas distribuídas: {controleCestasList.length}</p>
                    <p>Beneficiários assistidos: 28</p>
                </div>
            </div>

            <div className='w-full mt-8 flex justify-center gap-16'>
                <div className="flex gap-1 justify-end rounded-md border-2 bg-white border-neon-blue">
                    <input type="text" placeholder="Buscar registro" value={inputContent} onChange={handleInputChange} onKeyDown={(event) => handleKeyDown(event)} className="p-1 rounded-md text-center outline-none" />
                    <button onClick={handleSearchBtn}>
                        <SearchIcon className='text-neon-blue'></SearchIcon>
                    </button>
                </div>
                <div>
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-blue border-2 border-neon-blue text-white'>
                        <AddIcon></AddIcon>
                        Novo registro
                    </button>
                </div>
            </div>
            <div className='mt-4'>
                <table className='rounded-sm bg-white'>
                    <tr>
                        <th className='px-2'>Cesta</th>
                        <th className='px-2'>Recebido por</th>
                        <th className='px-2'>Voluntário responsável</th>
                        <th className='px-2'>Entrega</th>
                    </tr>
                    {
                        controleCestasList.map((controle, index) =>
                            <tr className='text-sm'>
                                <td className='px-2 border-[1px] border-gray-600'>{controle.cesta.nome}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{controle.beneficiario.nome}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{controle.voluntario.nome}</td>
                                <td className='px-2 border-[1px] border-gray-600'>{controle.data_hora.toLocaleString("pt-BR")}</td>
                            </tr>
                        )
                    }
                </table>
            </div>
        </div>
    )
}