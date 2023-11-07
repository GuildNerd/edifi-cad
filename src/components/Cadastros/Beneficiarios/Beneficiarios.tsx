import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import 'reactjs-popup/dist/index.css';
import { Grid, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';


const URL = "https://edificad-production.up.railway.app/api/beneficiario";

type Beneficiario = {
    id: number ,
    nome: string,
    email?: string,
    cpf: string,
    telefone?: string,
    data_nascimento: string,
    endereco?: {
        id: number ,
        logradouro: string,
        numero: string,
        cep: string,
        bairro: string,
        cidade: string,
        estado: string
    },
    dependentes: [{
        id: number,
        nome: string,
        email?: string,
        cpf: string,
        telefone?: string,
        data_nascimento: string
    }];
}

let emptyBeneficiario  = {
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    endereco: {
        id: 0,
        logradouro: "",
        numero: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: ""
    },
    dependentes: []
}

interface BeneficiariosProps {
    APIToken: string
}

export default function Beneficiarios({ APIToken }: BeneficiariosProps) {
    const [inputContent, setInputContent] = useState("");
    const [searchingAttribute, setSearchingAttribute] = useState("cpf");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [beneficiariosList, setBeneficiariosList] = useState<Beneficiario[]>([])

    const [openPopup, setOpenPopup] = useState(false);
    const [novoBeneficiario, setNovoBeneficiario] = useState<Partial<Beneficiario>>({})

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<Partial<Beneficiario>>({});

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
            let response = await fetch(`${URL}?${searchingAttribute}=${beneficiarioBuscado}`, {
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
            let response = await fetch(`${URL}`, {
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


    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setNovoBeneficiario(emptyBeneficiario);
    };

    const handleAddBeneficiario = async () => {
        try {
            const response = await fetch(`${URL}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: APIToken,
                },
                body: JSON.stringify(novoBeneficiario),
            });

            if (response.ok) {
                loadDefaultBeneficarios();
                setOpenPopup(false);
                // Mostrar uma mensagem de sucesso na tela
                // TODO: Pendente implementar a lógica para exibir a mensagem de sucesso aqui
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar novo beneficiario:', error);
        }
    }

    const handleEditandoBeneficiario = (beneficiario : Beneficiario) => {
        setNovoBeneficiario(beneficiario);
        setOpenPopup(true);
    }

    const handleUpdateBeneficiario =async () => {
        try {
            const response = await fetch(`${URL}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: APIToken,
                },
                body: JSON.stringify(novoBeneficiario),
            });

            if (response.ok) {
                loadDefaultBeneficarios();
                setOpenPopup(false);
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar beneficiário:', error);
        }
    }

    const handleDeleteBeneficiario = (beneficiario : Beneficiario) =>{
        setEntityToDelete(beneficiario);
        setConfirmDelete(true);
    }

    const handleCancelDelete = () => {
        setConfirmDelete(false);
        setEntityToDelete({});
    }

    const handleConfirmDelete = async () => {
        if (entityToDelete) {
            try {
                const response = await fetch(`${URL}/${entityToDelete.id}`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        Authorization: APIToken,
                    },
                });

                if (response.ok) {
                    loadDefaultBeneficarios();
                    setConfirmDelete(false);
                } else {
                    throw new Error(`${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error('Erro ao excluir beneficiario:', error);
            }
        }
    };


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
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-neon-pink border-2 border-neon-pink text-white'
                    onClick={handleOpenPopup}>
                        <AddIcon></AddIcon>
                        Novo beneficiário
                    </button>

                    <Popup open={openPopup} onClose={handleClosePopup}>
                        <div className='p-4'>
                            <h1 className='text-center'>{novoBeneficiario.id ? 'Editando Beneficiário' : 'Cadastrando Beneficiário'}</h1>
                            <form >
                                <div className='mt-2'>
                                    <h3 className='my-2'>Dados Pessoais</h3>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Nome"
                                                value={novoBeneficiario.nome}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, nome: e.target.value })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Email"
                                                value={novoBeneficiario.email}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, email: e.target.value })}
                                                fullWidth
                                                style={{ marginTop: '16px' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Telefone"
                                                value={novoBeneficiario.telefone}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, telefone: e.target.value })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="CPF"
                                                value={novoBeneficiario.cpf}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, cpf: e.target.value })}
                                                fullWidth
                                                style={{ marginTop: '16px' }}
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
                                                value={novoBeneficiario.endereco?.logradouro || ''}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco: { ...novoBeneficiario.endereco, logradouro: e.target.value, id: novoBeneficiario.endereco?.id || null } })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Número"
                                                value={novoBeneficiario.endereco?.numero || ''}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco: { ...novoBeneficiario.endereco, numero: e.target.value, id: novoBeneficiario.endereco?.id || null } })}
                                                fullWidth
                                                style={{ marginTop: '16px' }}
                                            />
                                            <TextField
                                                label="CEP"
                                                value={novoBeneficiario.endereco?.cep || ''}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco: { ...novoBeneficiario.endereco, cep: e.target.value, id: novoBeneficiario.endereco?.id || null } })}
                                                fullWidth
                                                style={{ marginTop: '16px' }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Bairro"
                                                value={novoBeneficiario.endereco?.bairro || ''}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco: { ...novoBeneficiario.endereco, bairro: e.target.value, id: novoBeneficiario.endereco?.id || null } })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Cidade"
                                                value={novoBeneficiario.endereco?.cidade || ''}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco: { ...novoBeneficiario.endereco, cidade: e.target.value, id: novoBeneficiario.endereco?.id || null } })}
                                                fullWidth
                                                style={{ marginTop: '16px' }}
                                            />
                                            <TextField
                                                label="Estado"
                                                value={novoBeneficiario.endereco?.estado || ''}
                                                onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco: { ...novoBeneficiario.endereco, estado: e.target.value, id: novoBeneficiario.endereco?.id || null } })}
                                                fullWidth
                                                style={{ marginTop: '16px' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className='mt-5 flex justify-around'>
                                    {novoBeneficiario.id ?
                                        (
                                            <Button variant='contained' onClick={handleUpdateBeneficiario}>
                                                Confirmar
                                            </Button>
                                        ) :
                                        (
                                            <Button variant='contained' onClick={handleAddBeneficiario}>
                                                Cadastrar
                                            </Button>
                                        )}
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
                            <p>Tem certeza de que deseja excluir o beneficiário "{entityToDelete.nome}"?</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <Button variant='contained' onClick={handleConfirmDelete} className='bg-red-500 text-white'>
                                    Confirmar
                                </Button>
                                <Button variant='contained' onClick={handleCancelDelete}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </Popup>

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
                            <th className='px-2'></th>
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
                                    <td className='px-2 border-[1px] border-gray-600'>
                                        <div className='flex'>
                                            <button onClick={() => handleEditandoBeneficiario(beneficiario)}>
                                                <EditIcon className='text-baby-blue'></EditIcon>
                                            </button>

                                            <button onClick={() => handleDeleteBeneficiario(beneficiario)}>
                                                <DeleteIcon className='text-red-500'></DeleteIcon>
                                            </button>
                                        </div>
                                    </td>
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