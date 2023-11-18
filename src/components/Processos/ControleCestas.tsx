import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';

import 'reactjs-popup/dist/index.css';
import {TextField} from '@mui/material';
import {useEffect, useState} from 'react';
import {handleGet, handlePost, handlePut} from "../commons/Requests";
import {
    Beneficiario,
    Cesta,
    DistribuicaoCesta,
    DistribuicaoFormData,
    emptyFormData,
    emptyResumo,
    ResumoDistribuicao
} from './ControleCestasTypes'
import {Voluntario} from '../Cadastros/Voluntarios/VoluntariosTypes'
import {currentDateTime, currentDateTimeStr, formatDate, formatDateISO} from '../commons/Utils'
import {
    API_URL_BENEFICIARIO,
    API_URL_CESTA,
    API_URL_DIST_CESTA,
    API_URL_RELATORIO_RESUMO_DISTRIBUICAO,
    API_URL_VOLUNTARIO
} from "../../apiConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
    const [resumo, setResumo] = useState<ResumoDistribuicao>(emptyResumo)
    const [formData, setFormData] = useState<DistribuicaoFormData>(emptyFormData);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);

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
        if (isLoadDefault) {
            loadDefaultDistribuicaoCesta();
            loadResumoDistribuicaoCestas();
        }
    }, [isLoadDefault])

    function getJsonToSendAPI(_formData: DistribuicaoFormData) {
        return {
            id: _formData.id,
            cesta: {id: _formData.id_cesta},
            voluntario: {id: _formData.id_voluntario},
            beneficiario: {id: _formData.id_beneficiario},
            data_hora: formatDate(_formData.data_hora)
        };
    }

    async function handleFormSubmit() {
        const successSubmit = (resp) => {
            loadDefaultDistribuicaoCesta();
            handleCloseModal();
        }

        const errorSubmit = (resp) => { }
        await handlePost(API_URL_DIST_CESTA, getJsonToSendAPI(formData), APIToken, successSubmit, errorSubmit)
    }

    const handleOpenModal = () => {
        setOpenModal(true);
        loadCestas();
        loadBeneficiarios();
        loadVoluntarios();

        formData.data_hora = currentDateTime();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    async function loadCestas() {
        let data = await handleGet(API_URL_CESTA, APIToken);
        setCestaOptions(data);
    }

    async function loadBeneficiarios() {
        let data = await handleGet(API_URL_BENEFICIARIO, APIToken);
        setBeneficiarioOptions(data);
    }


    async function loadVoluntarios() {
        let data = await handleGet(API_URL_VOLUNTARIO, APIToken);
        setVoluntarios(data);
    }

    async function loadResumoDistribuicaoCestas() {
        let urlResumo = `${API_URL_RELATORIO_RESUMO_DISTRIBUICAO}/resumo-distribuicao`;
        let resumo = await handleGet(urlResumo, APIToken);
        setResumo(resumo);
    }

    function handleEditarControle(controle: DistribuicaoCesta){
        handleOpenEditModal(controle);
    }

    function handleDeleteControle(controle: DistribuicaoCesta){

    }

    const handleOpenEditModal = (controle: DistribuicaoCesta) => {
        loadCestas();
        loadBeneficiarios();
        loadVoluntarios();
        setFormData({
            id: controle.id,
            id_cesta: controle.cesta.id,
            id_beneficiario: controle.beneficiario.id,
            id_voluntario: controle.voluntario.id,
            data_hora: new Date(controle.data_hora)
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };


    const handleEditSubmit = async () => {
        const successUpdate = (response) => {
            loadDefaultDistribuicaoCesta();
            handleCloseEditModal();
        }
        await handlePut(API_URL_DIST_CESTA, getJsonToSendAPI(formData)  , APIToken, successUpdate, (resp) => {} )

        setFormData(emptyFormData);
    };


    return (
        <div className='h-[100vh] flex flex-col items-center bg-white'>
            <h1 className='my-8 text-gray-800 text-3xl'>Controle e Distribuição de Cestas</h1>
            <div className='my-4 ml-8 self-start'>
                <h3 className='text-gray-800 text-xl'>Dados do último mês</h3>
                <div className='flex justify-center gap-16 text-gray-800'>
                    <p>Cestas distribuídas: {resumo.cestas_distribuidas}</p>
                    <p>Beneficiários assistidos: {resumo.beneficiarios_assistidos}</p>
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

                    <Modal open={openModal} onClose={handleCloseModal}
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
                                                    onChange={(event, value) => formData.id_beneficiario = value?.id as number}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Beneficiário"/>}/>

                                                <Autocomplete
                                                    id="cesta"
                                                    className="col-6"
                                                    options={cestaOptions}
                                                    getOptionLabel={(option) => option.nome}
                                                    onChange={(event, value) => formData.id_cesta = value?.id as number}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Cesta"/>}/>

                                                <Autocomplete
                                                    id="voluntario-autocomplete"
                                                    className="col-6"
                                                    options={voluntarios}
                                                    getOptionLabel={(option) => option.nome}
                                                    onChange={(event, value) => formData.id_voluntario = value?.id as number}
                                                    renderInput={(params) =>
                                                        <TextField {...params} label="Voluntarios"/>}/>

                                                <div className="col-6">
                                                    <TextField
                                                        id="data_hora"
                                                        label="Registro"
                                                        type="datetime-local"
                                                        className="col-12"
                                                        value={currentDateTimeStr()}
                                                        defaultValue={currentDateTimeStr()}
                                                        InputLabelProps={{shrink: true}}
                                                        onChange={(e) => formData.data_hora = new Date(e.target.value)}
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
                        <th className='px-2'>Action</th>
                        <th className='px-2'>Cesta</th>
                        <th className='px-2'>Recebido por</th>
                        <th className='px-2'>Voluntário responsável</th>
                        <th className='px-2'>Entrega</th>
                    </tr>
                    </thead>
                    <tbody>
                    {controleCestasList.map((controle, index) =>
                        <tr key={controle.id}>
                            <td className='px-2'>
                                <button onClick={() => handleEditarControle(controle)}>
                                    <EditIcon className='text-baby-blue'></EditIcon>
                                </button>

                                <Modal open={openEditModal} onClose={handleCloseEditModal}
                                       className="d-flex align-items-center justify-content-center">
                                    <div className='p-4 flex flex-col items-center bg-white w-50'>
                                        <div className='modal-dialog w-100'>
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5">Atualizar Registro</h1>
                                                    <button className="btn-close" onClick={handleCloseEditModal}></button>
                                                </div>
                                                <div className="modal-body mt-3">
                                                    <form>
                                                        <div className="row g-3">
                                                            <Autocomplete
                                                                id="beneficiario-autocomplete"
                                                                className="col-6"
                                                                options={beneficiarioOptions}
                                                                value={beneficiarioOptions.find(option => option.id === formData.id_beneficiario )}
                                                                getOptionLabel={(option) => option.nome}
                                                                onChange={(event, value) => formData.id_beneficiario = value?.id as number}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Beneficiário"/>}/>

                                                            <Autocomplete
                                                                id="cesta"
                                                                className="col-6"
                                                                options={cestaOptions}
                                                                value={cestaOptions.find(option => option.id === formData.id_cesta)}
                                                                getOptionLabel={(option) => option.nome}
                                                                onChange={(event, value) => formData.id_cesta = value?.id as number}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Cesta"/>}/>

                                                            <Autocomplete
                                                                id="voluntario-autocomplete"
                                                                className="col-6"
                                                                options={voluntarios}
                                                                value={voluntarios.find(option => option.id === formData.id_voluntario)}
                                                                getOptionLabel={(option) => option.nome}
                                                                onChange={(event, value) => formData.id_voluntario = value?.id as number}
                                                                renderInput={(params) =>
                                                                    <TextField {...params} label="Voluntarios"/>}/>

                                                            <div className="col-6">
                                                                <TextField
                                                                    id="data_hora"
                                                                    label="Registro"
                                                                    type="datetime-local"
                                                                    className="col-12"
                                                                    defaultValue={formatDate(formData.data_hora)}
                                                                    InputLabelProps={{shrink: true}}
                                                                    onChange={(e) => setFormData({...formData, data_hora: new Date(e.target.value) })}
                                                                />
                                                            </div>

                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer mt-5">
                                                    <button className="btn btn-secondary mr-2" onClick={handleCloseEditModal}>Cancelar</button>
                                                    <button className="btn btn-primary" onClick={handleEditSubmit}>Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>

                                <button onClick={() => handleDeleteControle(controle)}>
                                    <DeleteIcon className='text-red-500'></DeleteIcon>
                                </button>
                            </td>
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