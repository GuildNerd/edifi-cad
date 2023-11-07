import AddIcon from '@mui/icons-material/Add';
import { Grid, TextField, Button } from '@mui/material';

import { useState } from 'react';

const URL = "https://edificad-production.up.railway.app/api/cesta";

interface CreateCestaProps {
    APIToken: string,
    loadDefault: () => void
}

export default function CreateCesta({ APIToken, loadDefault }: CreateCestaProps) {
    const [newCesta, setNewCesta] = useState({ nome: "", descricao: "", quantidade_estoque: 0 });
    const [updatingError, setUpdatingError] = useState("");

    function onChangeNome(novoNome) {
        let cestaTemp = { ...newCesta };
        cestaTemp.nome = novoNome;

        setNewCesta(cestaTemp);
    }

    function onChangeDescricao(novaDescricao) {
        let cestaTemp = { ...newCesta };
        cestaTemp.descricao = novaDescricao;

        setNewCesta(cestaTemp);
    }

    const onChangeQuantEstoque = (novaQuantEstoque) => {
        let cestaTemp = { ...newCesta };
        cestaTemp.quantidade_estoque = novaQuantEstoque;

        setNewCesta(cestaTemp);
    }

    const createCesta = async () => {
        let requestBody = { ...newCesta }
        try {
            let request = await fetch(`${URL}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', Authorization: APIToken },
                body: JSON.stringify(requestBody)
            })

            if (request.ok){
                alert("Cesta criada com sucesso!");
                loadDefault();
            }
            else
                throw new Error();
        }
        catch (error) {
            setUpdatingError("Não foi possível salvar a nova cesta. Tente novamente, por favor.");
        }
    }

    return (
        <div className="flex flex-col items-center">
            <p className="font-bold text-xl">Nova cesta</p>
            <div className='flex flex-col mt-4 text-black'>
                <form onSubmit={(event) => event.preventDefault()} className='flex flex-col'>
                    <h3>Dados de cesta</h3>
                    <div className='mt-2'>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Nome"
                                    onChange={(e) => onChangeNome(e.target.value)}
                                    fullWidth
                                />
                                <TextField
                                    label="Quantidade em estoque"
                                    onChange={(e) => onChangeQuantEstoque(e.target.value)}
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                />
                            </Grid>
                            <Grid item xs={6} className='pt-0'>
                                <TextField
                                    label="Descrição"
                                    onChange={(e) => onChangeDescricao(e.target.value)}
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                />
                            </Grid>
                        </Grid>
                        <div className='mt-4 flex justify-between'>
                            <Button variant='contained' onClick={createCesta}>
                                Cadastrar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {updatingError != "" ? <p className='font-bold text-lg text-red-600'>{updatingError}</p> : null}
        </div>
    )
}