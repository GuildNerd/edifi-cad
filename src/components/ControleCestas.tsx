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

type DistribuicaoFormData = {
    data_hora: Date,
    id_cesta : number,
    id_voluntario : number,
    id_beneficiario : number
}

interface ControleCestasProps {
    APIToken: string
}

export default function ControleCestas({APIToken}: ControleCestasProps) {
    const [inputContent, setInputContent] = useState("");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [controleCestasList, setControleCestaList] = useState<DistribuicaoCesta[]>([]);

    const [openPopup, setOpenPopup] = useState(false);
    const [formData, setFormData] = useState<DistribuicaoFormData>({
        id_cesta: 0,
        id_beneficiario: 0,
        id_voluntario: 0,
        data_hora: new Date()
    });

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


    const handleFormSubmit = async () => {
        const dataToSend = {
            cesta: { id: formData.id_cesta },
            voluntario: { id: formData.id_voluntario },
            beneficiario: { id: formData.id_beneficiario},
            data_hora: formData.data_hora.toISOString()
        };
    
        try {
            const response = await fetch('https://edificad-production.up.railway.app/api/distribuicao-cesta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: APIToken
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                handleClosePopup();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao enviar a solicitação:', error);
        }
    };

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        //setNovoVoluntario(emptyVoluntario);
    };

    

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
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-blue border-2 border-neon-blue text-white'
                        onClick={handleOpenPopup}>
                        <AddIcon></AddIcon>
                        Novo registro
                    </button>

                    <Popup open={openPopup} onClose={handleClosePopup}>
                        <div className='p-4'>
                            <h1 className='text-center'>Novo Registro</h1>
                            <form >
                                <div className='mt-2'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                        
                                        </Grid>
                                    </Grid>
                                </div>
                                
                                <div className='mt-5 flex justify-around'>
                                    
                                    <Button variant='contained' >
                                        Cadastrar
                                    </Button>
                                      
                                    <Button variant='contained' className='!bg-red-500'
                                    onClick={handleClosePopup}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Popup>


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