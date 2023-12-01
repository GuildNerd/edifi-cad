import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import {Grid, TextField, Button} from '@mui/material';
import {useState, useEffect} from 'react';

import {Admin, emptyAdmin} from "./AdminTypes";
import {handleDelete, handleGet, handlePost, handlePut} from "./commons/Requests";
import {API_URL_ADMIN} from "../apiConfig";
//--------------
import Autocomplete from '@mui/material/Autocomplete';

interface AdminProps {
    APIToken: string
}

export default function Admins({APIToken}: AdminProps) {
    const [inputContent, setInputContent] = useState("");
    const [searchingAttribute, setSearchingAttribute] = useState("email");
    const [isLoadDefault, setIsLoadDefault] = useState(true);
    const [adminList, setAdminList] = useState<Admin[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(emptyAdmin);//verificar-------------------------------------------------------------------
    const [openPopup, setOpenPopup] = useState(false);
    const [openPopupUpdate, setOpenPopupUpdate] = useState(false);
    const [novoAdmin, setNovoAdmin] = useState(emptyAdmin);
    //-------------
    //const [rolesOptions, setRolesOptions] = useState([""]);
    const [rolesOptions, setRolesOptions] = useState<string []>([]);
    const [selectedRole, setSelectedRole] = useState("");

    async function loadRoles() {
        let urlResumo = `${API_URL_ADMIN}/available-roles`;
        let data = await handleGet(urlResumo, APIToken);
        setRolesOptions(data);
        
        setRolesOptions(prevState => [...prevState, selectedRole] )//---------------------------------------------------------------------------
    }

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputContent(event.currentTarget.value);
        if (inputContent.length == 0)
            setIsLoadDefault(true);
        else
            setIsLoadDefault(false);
    }

    const handleSearchBtn = async () => {
        if (inputContent.length != 0) {
            let searchResults: Admin[] = await getAdmin(inputContent);
            setAdminList(searchResults);
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

    async function getAdmin(adminBuscado: string) {
        let url = `${API_URL_ADMIN}?${searchingAttribute}=${adminBuscado}`;
        return await handleGet(url, APIToken)
    }

    async function loadDefaultAdmin() {
        let response = await handleGet(API_URL_ADMIN, APIToken);
        setAdminList(response);
    }

    const handleOpenPopup = () => {
        setOpenPopup(true);
        loadRoles();//-------------------------------------------------------------
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setNovoAdmin(emptyAdmin);
    };

    const handleOpenPopupUpdate = () => {
        setOpenPopupUpdate(true);
    };

    const handleClosePopupUpdate = () => {
        setOpenPopupUpdate(false);
    }

    // adicionar admin
    async function handleAddAdmin() {
        let successAdd = () => {
            loadDefaultAdmin();
            
            setOpenPopup(false);
            setAdminToDelete(emptyAdmin);
        }

        await handlePost(API_URL_ADMIN, novoAdmin, APIToken, successAdd, () => {});
    }

    // editando admin
    const handleEditAdmin = (admin) => {
        setNovoAdmin(admin);
        setOpenPopupUpdate(true);
    };


    async function handleUpdateAdmin(){
        let successUpdate = () => {
            loadDefaultAdmin();
            setOpenPopupUpdate(false);
        }
        await handlePut(API_URL_ADMIN, novoAdmin, APIToken, successUpdate, () => {})
    }

    // removendo admin
    const handleDeleteAdmin = (admin) => {
        setAdminToDelete(admin);//verificar---------------------------------------------------------------------------------------------------------------
        setConfirmDelete(true);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(false);
        setAdminToDelete(emptyAdmin);//verificar---------------------------------------------------------------------------------------------------------
    };

    async function handleConfirmDelete () {
        if (adminToDelete) {
            let url = `${API_URL_ADMIN}/${adminToDelete.id}`;
            let successDelete = () => {
                loadDefaultAdmin();
                setConfirmDelete(false);
            }
            await handleDelete(url,  APIToken, successDelete, () => {})
        }
    }

    useEffect(() => {
        if (isLoadDefault)
            loadDefaultAdmin();
    }, [isLoadDefault])


    return (
        <div className='h-[100vh] flex flex-col items-center'>
            <h1 className='my-8 text-3xl'>Cadastro de Usuários</h1>
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
                        <input type="search" placeholder="Buscar usuário" value={inputContent}
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
                        Novo usuário
                    </button>

                    <Popup open={openPopup} onClose={handleClosePopup}>
                        <div className='p-4'>
                            <h1 className='text-center'>Cadastrando Usuário</h1>
                            <form>
                                <div className='mt-2'>
                                    <h3 className='my-2'>Dados</h3>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Nome completo"
                                                value={novoAdmin.full_name}
                                                onChange={(e) => setNovoAdmin({
                                                    ...novoAdmin,
                                                    full_name: e.target.value
                                                })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Usuário"
                                                value={novoAdmin.username}
                                                onChange={(e) => setNovoAdmin({
                                                    ...novoAdmin,
                                                    username: e.target.value
                                                })}
                                                fullWidth
                                                style={{marginTop: '16px'}}
                                            />
                                            
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Email"
                                                value={novoAdmin.email}
                                                onChange={(e) => setNovoAdmin({
                                                    ...novoAdmin,
                                                    email: e.target.value
                                                })}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Password"
                                                type="password"
                                                value={novoAdmin.password}
                                                onChange={(e) => setNovoAdmin({
                                                    ...novoAdmin,
                                                    password: e.target.value
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
                                            <Autocomplete
                                                //id="cesta"
                                                className="col-6"
                                                options={rolesOptions}
                                                getOptionLabel={(option) => option}
                                                onChange={(e) => setSelectedRole(e)}
                                                renderInput={(params) =>
                                                <TextField {...params} label="Perfil"/>}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className='mt-5 flex justify-around'>
                                    <Button variant='contained' onClick={handleAddAdmin}>
                                        Cadastrar
                                    </Button>

                                    <Button variant='contained' onClick={handleClosePopup} className='!bg-red-500'>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Popup>    

                </div>
            </div>
            <div className='mt-4 w-100 px-5'>
                <table className='table table-striped'>
                    <thead>
                    <tr className='text-center'>
                        <th></th>
                        <th >Nome completo</th>
                        <th >Usuário</th>
                        <th >Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        adminList.map((admin, index) =>
                            <tr key={admin.id}>
                                <td className='px-2'>
                                    <button onClick={() => handleEditAdmin(admin)}>
                                        <EditIcon className='text-baby-blue'></EditIcon>
                                    </button>
                                    
                                    <button onClick={() => handleDeleteAdmin(admin)}>
                                        <DeleteIcon className='text-red-500'></DeleteIcon>
                                    </button>
                                </td>
                                <td >{admin.full_name}</td>
                                <td >{admin.username}</td>
                                <td >{admin.email}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}