import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {Button, Grid, TextField} from '@mui/material';
import {useEffect, useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {Beneficiario, emptyBeneficiarioPost} from "./BeneficiariosTypes";
import {handleDelete, handleGet, handlePost, handlePut} from "../../commons/Requests";
import {API_URL_BENEFICIARIO} from "../../../apiConfig";

interface BeneficiarioProps {
    APIToken: string
}

export default function Beneficiarios({APIToken}: BeneficiarioProps) {
    const [inputContent, setInputContent] = useState("");
    const [searchingAttribute, setSearchingAttribute] = useState("cpf");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [entityList, setEntityList] = useState<Beneficiario[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState(emptyBeneficiarioPost);

    const [openPopup, setOpenPopup] = useState(false);
    const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
    const [newEntity, setNewEntity] = useState(emptyBeneficiarioPost)

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
        if (inputContent.length == 0)
            setIsLoadDefault(true);
        else
            setIsLoadDefault(false);
    }

    const handleSearchBtn = async () => {
        if (inputContent.length != 0) {
            let searchResults: Beneficiario[] = await getEntities(inputContent);
            setEntityList(searchResults);
        } else
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

    async function getEntities(voluntarioBuscado: string) {
        try {
            let url = `${API_URL_BENEFICIARIO}?${searchingAttribute}=${voluntarioBuscado}`;
            return await handleGet(url, APIToken)
        } catch (error) {
            return ([]);
        }
    }

    async function loadDefaultEntities() {
        try {
            let response = await handleGet(API_URL_BENEFICIARIO, APIToken);
            setEntityList(response);
        } catch (error) {

        }
    }

    const handleOpenPopup = () => {
        setOpenPopup(true);
        setNewEntity(emptyBeneficiarioPost);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setNewEntity(emptyBeneficiarioPost);
    };

    const handleOpenPopupUpdate = () => {
        setOpenPopupUpdate(true);
    };

    const handleClosePopupUpdate = () => {
        setOpenPopupUpdate(false);
    }

    // adicionar voluntário
    const handleAddBeneficiario = async () => {
        let successAdd = () => {
            loadDefaultEntities();
            setOpenPopup(false);
            setEntityToDelete(emptyBeneficiarioPost);
        }

        await handlePost(API_URL_BENEFICIARIO, newEntity, APIToken, successAdd, () => {
        });
    };

    // editando beneficiario
    const handleEditBeneficiario = (beneficiario) => {
        setNewEntity(beneficiario);
        setOpenPopupUpdate(true);
    };

    const handleUpdateBeneficiario = async () => {
        console.log(newEntity)
        let successUpdate = () => {
            loadDefaultEntities();
            setOpenPopupUpdate(false);
        }

        await handlePut(API_URL_BENEFICIARIO, newEntity, APIToken, successUpdate, () => {
        })
    };

    // removendo beneficiario
    const handleDeleteVoluntario = (beneficiario) => {
        setEntityToDelete(beneficiario);
        setConfirmDelete(true);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(false);
        setEntityToDelete(emptyBeneficiarioPost);
    };

    const handleConfirmDelete = async () => {
        if (entityToDelete) {
            let url = `${API_URL_BENEFICIARIO}/${entityToDelete.id}`;
            let successDelete = () => {
                loadDefaultEntities();
                setConfirmDelete(false);
            }
            await handleDelete(url, APIToken, successDelete, () => {
            })
        }
    };

    useEffect(() => {
        if (isLoadDefault)
            loadDefaultEntities();
    }, [isLoadDefault])


    return (
        <div className='h-[100vh] flex flex-col items-center'>
            <h1 className='my-8 text-3xl'>Cadastro de Beneficiários</h1>
            <div className='w-full flex justify-center gap-16'>
                <div className='flex items-center gap-2'>
                    <div>
                        <select name="searchingAttribute" id="searchingAttributeSelect" value={searchingAttribute}
                                onChange={(event) => handleSelectOnChange(event)}>
                            <option value="cpf">CPF</option>
                            <option value="nome">Nome</option>
                        </select>
                    </div>
                    <div className="flex gap-1 justify-end rounded-md border-2 bg-white border-baby-blue">
                        <input type="search" placeholder="Buscar voluntário" value={inputContent}
                               onChange={handleInputChange} onKeyDown={(event) => handleKeyDown(event)}
                               className="p-1 rounded-md text-center outline-none"/>
                        <button onClick={handleSearchBtn}>
                            <SearchIcon className='text-baby-blue'></SearchIcon>
                        </button>
                    </div>
                </div>

                <div>
                    <button
                        className='py-1 px-2 rounded-md flex items-center align-middle bg-baby-blue border-2 border-baby-blue text-white'
                        onClick={handleOpenPopup}>
                        <AddIcon></AddIcon>
                        Novo beneficiário
                    </button>
                    <Popup open={openPopup} onClose={handleClosePopup}>
                        <div className='p-4'>
                            <h1 className='text-center'>Cadastrando Voluntário</h1>
                            <form>
                                <div className='mt-2'>
                                    <h3 className='my-2'>Dados Pessoais</h3>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Nome"
                                                value={newEntity.nome}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    nome: e.target.value
                                                })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Email"
                                                value={newEntity.email}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    email: e.target.value
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Telefone"
                                                value={newEntity.telefone}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    telefone: e.target.value
                                                })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="CPF"
                                                value={newEntity.cpf}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    cpf: e.target.value
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className='mt-4'>
                                    <h3 className='my-2'>Endereço</h3>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Logradouro"
                                                value={newEntity.endereco?.logradouro || ''}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    endereco: {
                                                        ...newEntity.endereco,
                                                        logradouro: e.target.value,
                                                        id: newEntity.endereco?.id || null
                                                    }
                                                })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Número"
                                                value={newEntity.endereco?.numero || ''}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    endereco: {
                                                        ...newEntity.endereco,
                                                        numero: e.target.value,
                                                        id: newEntity.endereco?.id || null
                                                    }
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                            <TextField
                                                label="CEP"
                                                value={newEntity.endereco?.cep || ''}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    endereco: {
                                                        ...newEntity.endereco,
                                                        cep: e.target.value,
                                                        id: newEntity.endereco?.id || null
                                                    }
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Bairro"
                                                value={newEntity.endereco?.bairro || ''}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    endereco: {
                                                        ...newEntity.endereco,
                                                        bairro: e.target.value,
                                                        id: newEntity.endereco?.id || null
                                                    }
                                                })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Cidade"
                                                value={newEntity.endereco?.cidade || ''}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity, endereco: {
                                                        ...newEntity.endereco, cidade: e.target.value,
                                                        id: newEntity.endereco?.id || null
                                                    }
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                            <TextField
                                                label="Estado"
                                                value={newEntity.endereco?.estado || ''}
                                                onChange={(e) => setNewEntity({
                                                    ...newEntity,
                                                    endereco: {
                                                        ...newEntity.endereco,
                                                        estado: e.target.value,
                                                        id: newEntity.endereco?.id || null
                                                    }
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className='mt-5 flex justify-around'>
                                    <Button variant='contained' onClick={handleAddBeneficiario}>
                                        Cadastrar
                                    </Button>
                                    <Button variant='contained' onClick={handleClosePopup} className='!bg-red-500'>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Popup>
                    <Popup open={confirmDelete} onClose={handleCancelDelete}>
                        <div className='p-4'>
                            <h1>Confirmação de Exclusão</h1>
                            <p>Tem certeza de que deseja excluir o voluntário {entityToDelete.nome}?</p>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                                <Button variant='contained' onClick={handleConfirmDelete}
                                        className='bg-red-500 text-white'>
                                    Confirmar
                                </Button>
                                <Button variant='contained' onClick={handleCancelDelete}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </Popup>

                </div>
            </div>
            <div className='mt-4'>
                <table className='table table-striped'>
                    <thead>
                    <tr className='text-center'>
                        <th></th>
                        <th>CPF</th>
                        <th>Nome</th>
                        <th>Contato</th>
                        <th>Dependentes</th>
                        <th>Endereço</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        entityList.map((beneficiario, index) =>
                            <tr key={index}>
                                <td style={{ width: '70px' }}>
                                    <button onClick={() => handleEditBeneficiario(beneficiario)}>
                                        <EditIcon className='text-baby-blue'></EditIcon>
                                    </button>
                                    <Popup open={openPopupUpdate}>
                                        <div className='p-4'>
                                            <h1 className='text-center'>Editando Beneficiario</h1>
                                            <form>
                                                <div className='mt-2'>
                                                    <h3 className='my-2'>Dados Pessoais</h3>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Nome"
                                                                value={newEntity.nome}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    nome: e.target.value
                                                                })}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="Email"
                                                                value={newEntity.email}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    email: e.target.value
                                                                })}
                                                                fullWidth
                                                                style={{marginTop: '16px'}}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Telefone"
                                                                value={newEntity.telefone}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    telefone: e.target.value
                                                                })}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="CPF"
                                                                value={newEntity.cpf}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    cpf: e.target.value
                                                                })}
                                                                fullWidth
                                                                style={{marginTop: '16px'}}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                                <div className='mt-4'>
                                                    <h3 className='my-2'>Endereço</h3>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Logradouro"
                                                                value={newEntity.endereco?.logradouro || ''}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    endereco: {
                                                                        ...newEntity.endereco,
                                                                        logradouro: e.target.value,
                                                                        id: newEntity.endereco?.id || null
                                                                    }
                                                                })}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="Número"
                                                                value={newEntity.endereco?.numero || ''}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    endereco: {
                                                                        ...newEntity.endereco,
                                                                        numero: e.target.value,
                                                                        id: newEntity.endereco?.id || null
                                                                    }
                                                                })}
                                                                fullWidth
                                                                style={{marginTop: '16px'}}
                                                            />
                                                            <TextField
                                                                label="CEP"
                                                                value={newEntity.endereco?.cep || ''}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    endereco: {
                                                                        ...newEntity.endereco,
                                                                        cep: e.target.value,
                                                                        id: newEntity.endereco?.id || null
                                                                    }
                                                                })}
                                                                fullWidth
                                                                style={{marginTop: '16px'}}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Bairro"
                                                                value={newEntity.endereco?.bairro || ''}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    endereco: {
                                                                        ...newEntity.endereco,
                                                                        bairro: e.target.value,
                                                                        id: newEntity.endereco?.id || null
                                                                    }
                                                                })}
                                                                fullWidth
                                                            />
                                                            <TextField
                                                                label="Cidade"
                                                                value={newEntity.endereco?.cidade || ''}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    endereco: {
                                                                        ...newEntity.endereco,
                                                                        cidade: e.target.value,
                                                                        id: newEntity.endereco?.id || null
                                                                    }
                                                                })}
                                                                fullWidth
                                                                style={{marginTop: '16px'}}
                                                            />
                                                            <TextField
                                                                label="Estado"
                                                                value={newEntity.endereco?.estado || ''}
                                                                onChange={(e) => setNewEntity({
                                                                    ...newEntity,
                                                                    endereco: {
                                                                        ...newEntity.endereco,
                                                                        estado: e.target.value,
                                                                        id: newEntity.endereco?.id || null
                                                                    }
                                                                })}
                                                                fullWidth
                                                                style={{marginTop: '16px'}}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                                <div className='mt-5 flex justify-around'>
                                                    <Button variant='contained' onClick={handleUpdateBeneficiario}>
                                                        Confirmar
                                                    </Button>
                                                    <Button variant='contained' onClick={handleClosePopupUpdate}
                                                            className='!bg-red-500'>
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </Popup>
                                    <button onClick={() => handleDeleteVoluntario(beneficiario)}>
                                        <DeleteIcon className='text-red-500'></DeleteIcon>
                                    </button>
                                </td>
                                <td>{beneficiario.cpf}</td>
                                <td>{beneficiario.nome}</td>
                                <td>
                                    <div className="phone">{beneficiario.telefone}</div>
                                    <div className="phone">{beneficiario.email}</div>
                                </td>

                                <td>
                                    {
                                        beneficiario.dependentes != undefined && beneficiario.dependentes.length > 0 ?
                                            <Popup trigger={<button className='font-bold'><VisibilityIcon
                                                className='mr-2'/>Exibir</button>} position="right center" modal>
                                                <table className='table table-striped'>
                                                    <thead>
                                                    <tr className='text-center'>
                                                        <th>CPF</th>
                                                        <th>Nome</th>
                                                        <th>Data de nascimento</th>
                                                        <th>Telefone</th>
                                                        <th>Email</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        beneficiario.dependentes.map((dependente, index) =>
                                                            <tr className='text-sm' key={index}>
                                                                <td>{dependente.cpf}</td>
                                                                <td>{dependente.nome}</td>
                                                                <td>{dependente.data_nascimento}</td>
                                                                <td>{dependente.telefone}</td>
                                                                <td>{dependente.email}</td>
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
                                <td>{`${beneficiario.endereco?.logradouro}, ${beneficiario.endereco?.numero}, ${beneficiario.endereco?.bairro}, ${beneficiario.endereco?.cidade} - ${beneficiario.endereco?.estado}, ${beneficiario.endereco?.cep}`}</td>

                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}