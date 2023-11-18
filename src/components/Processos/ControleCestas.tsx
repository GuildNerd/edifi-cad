import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';

import 'reactjs-popup/dist/index.css';
import {TextField} from '@mui/material';
import {useEffect, useState} from 'react';

import {handleGet, handlePost} from "../commons/Requests";
import {Beneficiario, Cesta, DistribuicaoCesta, DistribuicaoFormData} from './ControleCestasTypes'
import {Voluntario} from '../Cadastros/Voluntarios/VoluntariosTypes'
import {formatDate, formatDateISO} from '../commons/Utils'
import {API_URL_BENEFICIARIO, API_URL_CESTA, API_URL_DIST_CESTA, API_URL_VOLUNTARIO} from "../../apiConfig";

interface ControleCestasProps {
    APIToken: string
}


export default function ControleCestas({APIToken}: ControleCestasProps) {
    const [inputContent, setInputContent] = useState("");
    const [isLoadDefault, setIsLoadDefault] = useState(true);

    const [controleCestasList, setControleCestaList] = useState<DistribuicaoCesta[]>([]);
    const [cestaOptions, setCestaOptions] = useState<Cesta[]>([]);
    const [beneficiarioOptions, setBeneficiarioOptions] = useState<Beneficiario[]>([]);
    const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
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

        let beneficiarios = await handleGet(API_URL_BENEFICIARIO, APIToken);
        setBeneficiarioOptions(beneficiarios);
    }

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
    }

    const handleSearchBtn = () => {
        getCesta(inputContent);
    }

    async function getCesta(controleBuscado: string) {
        let cestas = await handleGet(`${API_URL_CESTA}/${controleBuscado}`, APIToken);
        controleCestasList.push(cestas);
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
            cesta: {id: formData.id_cesta},
            voluntario: {id: formData.id_voluntario},
            beneficiario: {id: formData.id_beneficiario},
            data_hora: formatDate(formData.data_hora)
        };

        console.log(dataToSend);

        const successSubmit = (resp) => {
            loadDefaultDistribuicaoCesta();
            handleCloseModal();
        }

        const errorSubmit = (resp) => {
        }

        await handlePost(API_URL_DIST_CESTA, dataToSend, APIToken, successSubmit, errorSubmit)
    }

    const handleOpenModal = () => {
        setOpenPopup(true);
        loadCestas();
        loadBeneficiarios();
        loadVoluntarios();
    };

    const handleCloseModal = () => {
        setOpenPopup(false);
    };

    async function loadCestas() {
        let data = await handleGet(API_URL_CESTA, APIToken);
        setCestaOptions(data);
    }

    const handleCestaChange = (value: Cesta | null) => {
        formData.id_cesta = value?.id as number;
    };

    async function loadBeneficiarios() {
        let data = await handleGet(API_URL_BENEFICIARIO, APIToken);
        setBeneficiarioOptions(data);
    }

    const handleBeneficiarioChange = (value: Beneficiario | null) => {
        formData.id_beneficiario = value?.id as number;
    };

    async function loadVoluntarios() {
        let data = await handleGet(API_URL_VOLUNTARIO, APIToken);
        setVoluntarios(data);
    }

    function handleVoluntarioChange(value: Voluntario | null) {
        formData.id_voluntario = value?.id as number;
    }

    return (
        <div className='h-[100vh] flex flex-col items-center bg-white'>
            <h1 className='my-8 text-gray-800 text-3xl'>Controle e Distribuição de Cestas</h1>
            <div className='my-4 ml-8 self-start'>
                <h3 className='text-gray-800 text-xl'>Dados do último mês</h3>
                <div className='flex justify-center gap-16 text-gray-800'>
                    <p>Cestas distribuídas: {controleCestasList.length}</p>
                    <p>Beneficiários assistidos: 28</p>
                </div>
            </div>

            <div className='w-full mt-8 flex justify-center gap-16'>
                <div className="flex gap-1 justify-end rounded-md border-2 bg-white border-neon-blue">
                    <input type="text" placeholder="Buscar registro" value={inputContent} onChange={handleInputChange}
                           onKeyDown={(event) => handleKeyDown(event)}
                           className="p-1 rounded-md text-center outline-none"/>
                    <button onClick={handleSearchBtn}>
                        <SearchIcon className='text-neon-blue'></SearchIcon>
                    </button>
                </div>
                <div>
                    <button
                        className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-blue border-2 border-neon-blue text-white'
                        onClick={handleOpenModal}>
                        <AddIcon></AddIcon>
                        Novo registro
                    </button>

                    <Modal open={openPopup} onClose={handleCloseModal}
                           className="d-flex align-items-center justify-content-center">
                        <div className='p-4 flex flex-col items-center bg-white w-50'>
                            <div className='modal-dialog w-100'>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5">Registrar nova distribuição</h1>
                                        <button className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body mt-3">
                                        <form>
                                            <div className="row g-3">
                                                <Autocomplete
                                                    id="beneficiario-autocomplete"
                                                    className="col-6"
                                                    options={beneficiarioOptions}
                                                    getOptionLabel={(option) => option.nome}
                                                    onChange={(event, value) => handleBeneficiarioChange(value)}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Beneficiário"/>}/>

                                                <Autocomplete
                                                    id="cesta"
                                                    className="col-6"
                                                    options={cestaOptions}
                                                    getOptionLabel={(option) => option.nome}
                                                    onChange={(event, value) => handleCestaChange(value)}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Cesta"/>}/>

                                                <Autocomplete
                                                    id="voluntario-autocomplete"
                                                    className="col-6"
                                                    options={voluntarios}
                                                    getOptionLabel={(option) => option.nome}
                                                    onChange={(event, value) => handleVoluntarioChange(value)}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Voluntarios"/>}/>

                                                <div className="col-6">
                                                    <TextField
                                                        id="data_hora"
                                                        label="Registro"
                                                        type="datetime-local"
                                                        className="col-12"

                                                        defaultValue={formData.data_hora.toISOString().slice(0, 16)}
                                                        InputLabelProps={{shrink: true}}
                                                        onChange={(e) => setFormData({
                                                            ...formData,
                                                            data_hora: new Date(e.target.value)
                                                        })}
                                                    />
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer mt-5">
                                        <button className="btn btn-secondary mr-2" onClick={handleCloseModal}>Cancelar
                                        </button>
                                        <button className="btn btn-primary" onClick={handleFormSubmit}>Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
            <div className='mt-4 w-75'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='px-2'>Cesta</th>
                            <th className='px-2'>Recebido por</th>
                            <th className='px-2'>Voluntário responsável</th>
                            <th className='px-2'>Entrega</th>
                        </tr>
                    </thead>
                    <tbody>
                        {controleCestasList.map((controle, index) =>
                                <tr key={controle.id}>
                                    <td>{controle.cesta.nome}</td>
                                    <td>{controle.beneficiario.nome}</td>
                                    <td>{controle.voluntario.nome}</td>
                                    <td>{formatDateISO(controle.data_hora)}</td>
                                </tr>
                            )
                        }
                    </tbody>

                </table>
            </div>
        </div>
    )
}