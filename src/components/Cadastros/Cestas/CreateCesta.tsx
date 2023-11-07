import AddIcon from '@mui/icons-material/Add';

import { useState } from 'react';

interface CreateCestaProps {
    APIToken: string
}

export default function CreateCesta({ APIToken }: CreateCestaProps) {
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
        let requestBody = {...newCesta}
        try{
            let request = await fetch(`https://edificad-production.up.railway.app/api/cesta`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', Authorization: APIToken },
                body: JSON.stringify(requestBody)
            })

            if(request.ok)
                alert("Cesta criada com sucesso!");
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
                    <label htmlFor="inputNome" className='mt-2'>Nome</label>
                    <input type="text" name="inputNome" id="inputNome" onChange={(e) => onChangeNome(e.target.value)} className='text-center min-h-[30px] rounded-md border-[1px] border-black' />
                    <label htmlFor="inputDescricao" className='mt-2'>Descrição</label>
                    <input type="text" name="inputDescricao" id="inputDescricao" onChange={(e) => onChangeDescricao(e.target.value)} className='text-center min-h-[30px] rounded-md border-[1px] border-black' />
                    <label htmlFor="inputQuantEstoque" className='mt-2'>Quantidade em estoque</label>
                    <input type="number" name="inputQuantEstoque" id="inputQuantEstoque" onChange={(e) => onChangeQuantEstoque(e.target.value)} className='text-center min-h-[30px] rounded-md border-[1px] border-black' />
                    <button onClick={createCesta} className='p-1 mt-2 flex justify-center rounded border-[1px] bg-neon-orange text-white'>
                        <AddIcon />
                        Salvar nova cesta
                    </button>
                </form>
            </div>

            { updatingError != "" ? <p className='font-bold text-lg text-red-600'>{updatingError}</p> : null}
        </div>
    )
}