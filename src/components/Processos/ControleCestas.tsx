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
import Cestas from '../Cadastros/Cestas/Cestas';

import {handleDelete, handleGet, handlePost, handlePut} from "../commons/Requests";
import {DistribuicaoCesta, DistribuicaoFormData, Beneficiario, Cesta} from './ControleCestasTypes'
import {API_URL_DIST_CESTA, API_URL_BENEFICIARIO, API_URL_CESTA} from "../../apiConfig";

interface ControleCestasProps {
    APIToken: string
}

export default function ControleCestas({APIToken}: ControleCestasProps) {
    const [inputContent, setInputContent] = useState("");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [controleCestasList, setControleCestaList] = useState<DistribuicaoCesta[]>([]);
    const [cestaOptions, setCestaOptions] = useState<Cesta[]>([]);
    const [beneficiarioOptions, setBeneficiarioOptions] = useState<Beneficiario[]>([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [formData, setFormData] = useState<DistribuicaoFormData>({
        id_cesta: 0,
        id_beneficiario: 0,
        id_voluntario: 0,
        data_hora: new Date()
    });

    async function loadDefaultDistribuicaoCesta() {
        let data = await handleGet(API_URL_DIST_CESTA, APIToken);
        setControleCestaList(data);
    }

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
    }

    const handleSearchBtn = () => {
        getCesta(inputContent);
    }

    async function getCesta(controleBuscado: string) {
        await fetch(`${API_URL_CESTA}/${controleBuscado}`)
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


    async function handleFormSubmit() {
        const dataToSend = {
            cesta: { id: formData.id_cesta },
            voluntario: { id: formData.id_voluntario },
            beneficiario: { id: formData.id_beneficiario},
            data_hora: formData.data_hora.toISOString()
        };
        await handlePost(API_URL_DIST_CESTA, dataToSend, APIToken, () =>{}, () => {})
    }

    const handleOpenPopup = () => {
        setOpenPopup(true);
        loadCestaOptions();
        loadBeneficiarioOptions();
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
    };

  
    async function loadCestaOptions() {
        let data = await handleGet(API_URL_DIST_CESTA, APIToken);
        setCestaOptions(data);
    }
    
    const handleCestaChange = (event: React.ChangeEvent<{}>, value: Cesta | null) => {
        if (value) {
            console.log(value)
            setFormData({ ...formData, id_cesta: value.id });
        }
    };

    async function loadBeneficiarioOptions() {
        let data = await handleGet(API_URL_BENEFICIARIO, APIToken);
        setBeneficiarioOptions(data);
    }
    
    const handleBeneficiarioChange = (event: React.ChangeEvent<{}>, value: Beneficiario | null) => {
        if (value) {
            setFormData({ ...formData, id_beneficiario: value.id });
        }
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
                        <form>
                            <div className='mt-2'>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            id="cesta-autocomplete"
                                            options={cestaOptions}
                                            getOptionLabel={(option) => option.nome}
                                            onChange={handleCestaChange}
                                            renderInput={(params) => <TextField {...params} label="Cesta" />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            id="beneficiario-autocomplete"
                                            options={beneficiarioOptions}
                                            getOptionLabel={(option) => option.nome}
                                            onChange={handleBeneficiarioChange}
                                            renderInput={(params) => <TextField {...params} label="Beneficiário" />}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="data_hora"
                                            label="Registro"
                                            type="datetime-local"
                                            defaultValue={formData.data_hora.toISOString().slice(0, 16)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={(e) => setFormData({ ...formData, data_hora: new Date(e.target.value) })}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className='mt-5 flex justify-around'>
                                <Button variant='contained' onClick={handleFormSubmit }>
                                    Cadastrar
                                </Button>
                                <Button variant='contained' className='!bg-red-500' onClick={handleClosePopup}>
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