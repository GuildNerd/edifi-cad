import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Grid, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';

const URL = "https://edificad-production.up.railway.app/api/voluntario/";

type Voluntario = {
    id: number | null,
    nome: string,
    email?: string,
    cpf: string,
    telefone?: string,
    endereco?: {
        id:  number | null,
        logradouro: string,
        numero: string,
        cep: string,
        bairro: string,
        cidade: string,
        estado: string
    }
}

let emptyVoluntario = {
    id: null,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: {
        id: null,
        logradouro: "",
        numero: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
    },
};


interface VoluntariosProps {
    APIToken: string
}

export default function Voluntarios({ APIToken }: VoluntariosProps) {
    const [inputContent, setInputContent] = useState("");
    const [searchingAttribute, setSearchingAttribute] = useState("cpf");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [voluntariosList, setVoluntariosList] = useState<Voluntario[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [voluntarioToDelete, setVoluntarioToDelete] = useState<Partial<Voluntario>>({});
    
    const [openPopup, setOpenPopup] = useState(false);
    const [novoVoluntario, setNovoVoluntario] = useState<Partial<Voluntario>>({});


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

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setNovoVoluntario(emptyVoluntario);
    };


    
    // adicionar voluntário
    const handleAddVoluntario = async () => {
        try {
            const response = await fetch(`${URL}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: APIToken,
                },
                body: JSON.stringify(novoVoluntario),
            });

            if (response.ok) {
                loadDefaultVoluntarios();
                setOpenPopup(false);
                // Mostrar uma mensagem de sucesso na tela
                // Implemente a lógica para exibir a mensagem de sucesso aqui
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar novo voluntário:', error);
        }
    };

    const handleEditVoluntario = async (id: number) => {
        try {
            let response = await fetch(`${URL}${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                },
            });

            if (response.ok) {
                let data: Voluntario = await response.json();
                setNovoVoluntario(data); 
                setOpenPopup(true);
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao buscar voluntário para edição:', error);
        }
    };

    //editar voluntário
    const handleUpdateVoluntario = async () => {
        try {
            const response = await fetch(`${URL}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: APIToken,
                },
                body: JSON.stringify(novoVoluntario),
            });

            if (response.ok) {
                loadDefaultVoluntarios();
                setOpenPopup(false);
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao atualizar voluntário:', error);
        }
    };

    const handleDeleteVoluntario = (voluntario: Voluntario) => {
        setVoluntarioToDelete(voluntario);
        setConfirmDelete(true);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(false);
        setVoluntarioToDelete(emptyVoluntario);
    };

    const handleConfirmDelete = async () => {
        if (voluntarioToDelete) {
            try {
            const response = await fetch(`${URL}${voluntarioToDelete.id}`, {
                method: 'DELETE',
                headers: {
                Accept: 'application/json',
                Authorization: APIToken,
                },
            });
        
            if (response.ok) {
                loadDefaultVoluntarios();
                setConfirmDelete(false);
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            } catch (error) {
            console.error('Erro ao excluir voluntário:', error);
            }
        }
    };



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
                    <button className='py-1 px-2 rounded-md flex items-center align-middle bg-baby-blue border-2 border-baby-blue text-white'
                        onClick={handleOpenPopup}>
                        <AddIcon></AddIcon>
                        Novo voluntário
                    </button>
                    <Popup open={openPopup} onClose={handleClosePopup}>
                    <div className='p-4'>
                    <h1>{novoVoluntario.id ? 'Editando Voluntário' : 'Cadastrando Voluntário'}</h1>
                        <form >
                        <div>
                                <h3>Dados Pessoais</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Nome"
                                            value={novoVoluntario.nome}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, nome: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Email"
                                            value={novoVoluntario.email}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, email: e.target.value })}
                                            fullWidth
                                            style={{ marginTop: '16px' }}
                                        />
                                        <TextField
                                            label="CPF"
                                            value={novoVoluntario.cpf}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, cpf: e.target.value })}
                                            fullWidth
                                            style={{ marginTop: '16px' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Telefone"
                                            value={novoVoluntario.telefone}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, telefone: e.target.value })}
                                            fullWidth
                                        
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
                                <h3>Endereço</h3>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Logradouro"
                                            value={novoVoluntario.endereco?.logradouro || ''}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, endereco: { ...novoVoluntario.endereco, logradouro: e.target.value, id: novoVoluntario.endereco?.id || null } })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Número"
                                            value={novoVoluntario.endereco?.numero || ''}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, endereco: { ...novoVoluntario.endereco, numero: e.target.value, id: novoVoluntario.endereco?.id || null } })}
                                            fullWidth
                                            style={{ marginTop: '16px' }}
                                        />
                                        <TextField
                                            label="CEP"
                                            value={novoVoluntario.endereco?.cep || ''}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, endereco: { ...novoVoluntario.endereco, cep: e.target.value, id: novoVoluntario.endereco?.id || null } })}
                                            fullWidth
                                            style={{ marginTop: '16px' }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Bairro"
                                            value={novoVoluntario.endereco?.bairro || ''}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, endereco: { ...novoVoluntario.endereco, bairro: e.target.value, id: novoVoluntario.endereco?.id || null } })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Cidade"
                                            value={novoVoluntario.endereco?.cidade || ''}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, endereco: { ...novoVoluntario.endereco, cidade: e.target.value, id: novoVoluntario.endereco?.id || null } })}
                                            fullWidth
                                            style={{ marginTop: '16px' }}
                                        />
                                        <TextField
                                            label="Estado"
                                            value={novoVoluntario.endereco?.estado || ''}
                                            onChange={(e) => setNovoVoluntario({ ...novoVoluntario, endereco: { ...novoVoluntario.endereco, estado: e.target.value, id: novoVoluntario.endereco?.id || null } })}
                                            fullWidth
                                            style={{ marginTop: '16px' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    {novoVoluntario.id ? 
                                    (
                                        <Button variant='contained' onClick={handleUpdateVoluntario}>
                                            Confirmar
                                        </Button>
                                    ) : 
                                    (
                                        <Button variant='contained' onClick={handleAddVoluntario}>
                                            Cadastrar
                                        </Button>
                                    )}
                                <Button variant='contained' onClick={handleClosePopup}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </Popup>

                    
                    <Popup open={confirmDelete} onClose={handleCancelDelete}>
                        <div className='p-4'>
                            <h1>Confirmação de Exclusão</h1>
                            <p>Tem certeza de que deseja excluir o voluntário {voluntarioToDelete.nome}?</p>
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
                            <th></th> {/* Coluna para o ícone de lápis */}
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
                                <td className='px-2 border-[1px] border-gray-600'>
                                    <button onClick={() => handleEditVoluntario(voluntario.id)}>
                                        <EditIcon className='text-baby-blue'></EditIcon>
                                    </button>

                                    <button onClick={() => handleDeleteVoluntario(voluntario)}>
                                        <DeleteIcon className='text-red-500'></DeleteIcon>
                                    </button>
                                </td>
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