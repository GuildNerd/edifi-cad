import SearchIcon from '@mui/icons-material/Search';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useState } from 'react';

import { Cesta } from "./Cestas"

interface AlterarCestaProps {
    APIToken: string
}

export default function AlterarCesta({APIToken}: AlterarCestaProps) {
    const [inputCesta, setInputCesta] = useState("");
    const [cesta, setCesta] = useState<Cesta>({id: 0, nome: "", descricao: "", quantidade_estoque: 0});
    const [isShowSearchError, setIsShowSearchError] = useState(false);
    const [isShowSearchDone, setIsShowSearchDone] = useState(false);
    const [isShowCesta, setIsShowCesta] = useState(false);

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setInputCesta(event.currentTarget.value);
    }

    const handleSearchBtn = async () => {
        if(inputCesta.length != 0) {
            let searchResults = await getCesta(inputCesta);
            if(searchResults != null && searchResults != undefined){
                setCesta(searchResults[0]);
                setIsShowCesta(true);
            }
            else
                setIsShowSearchError(true);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter')
            handleSearchBtn();
    }

    function onChangeNome(novoNome) {
        let cestaTemp = { ...cesta };
        console.log(cestaTemp);
        cestaTemp.nome = novoNome;

        setCesta(cestaTemp);
    }

    function onChangeDescricao(novaDescricao) {
        let cestaTemp = { ...cesta };
        cestaTemp.descricao = novaDescricao;

        setCesta(cestaTemp);
    }
    
    const onChangeQuantEstoque = (novaQuantEstoque) => {
        let cestaTemp = {...cesta};
        cestaTemp.quantidade_estoque = novaQuantEstoque;

        setCesta(cestaTemp);
    }

    async function changeCesta() {
        let requestBody = {...cesta}
        try{
            let request = await fetch(`https://edificad-production.up.railway.app/api/cesta`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })

            if(request.ok)
                setIsShowSearchDone(true)
            else
                throw new Error();
        }
        catch (error) {
            setIsShowSearchError(true);
        }
    }

    async function getCesta(cestaBuscada: string) {
        try{
            let response = await fetch(`https://edificad-production.up.railway.app/api/cesta?id=${cestaBuscada}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    Authorization: APIToken,
                }
            })
            if (response.ok) {
                let data: Cesta = await response.json();
                return(data);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }
        catch (error) {
            return null
        }
    }

    return(
        <div className="flex flex-col items-center">
            <p className="font-bold">Digite o identificador da cesta que deseja alterar</p>
            <div className="mt-2 flex gap-1 justify-end rounded-md border-2 bg-white border-neon-orange">
                    <input type="number" placeholder="Buscar cesta por identificador" id="inputSearchCesta" value={inputCesta} onChange={handleInputChange} onKeyDown={(event) => handleKeyDown(event)} className="p-1 rounded-md text-center outline-none" />
                    <button onClick={handleSearchBtn}>
                        <SearchIcon className='text-neon-orange'></SearchIcon>
                    </button>
            </div>
            {
                (cesta != undefined && cesta != null  && isShowCesta) ?
                <div className='flex flex-col mt-4 text-black'>
                    <p>Identificador:</p>
                    <div className='text-center min-h-[30px] rounded-md border-[1px] border-black'>
                        <p>{cesta.id}</p>
                    </div>
                    <form className='flex flex-col'>
                        <label htmlFor="inputNome" className='mt-2'>Nome</label>
                        <input type="text" name="inputNome" id="inputNome" value={cesta.nome} onChange={onChangeNome} className='text-center min-h-[30px] rounded-md border-[1px] border-black' />
                        <label htmlFor="inputDescricao" className='mt-2'>Descrição</label>
                        <input type="text" name="inputDescricao" id="inputDescricao" value={cesta.descricao} onChange={onChangeDescricao} className='text-center min-h-[30px] rounded-md border-[1px] border-black' />
                        <label htmlFor="inputQuantEstoque" className='mt-2'>Quantidade em estoque</label>
                        <input type="number" name="inputQuantEstoque" id="inputQuantEstoque" value={cesta.quantidade_estoque} onChange={onChangeQuantEstoque} className='text-center min-h-[30px] rounded-md border-[1px] border-black' />
                        <button onClick={changeCesta} className='p-1 mt-2 flex justify-center rounded border-[1px] bg-neon-orange text-white'>
                            <ChangeCircleIcon />
                            Alterar dados
                        </button>
                        <button onClick={() => setIsShowCesta(false)} className='p-1 mt-2 flex justify-center rounded border-[1px] bg-red-500 text-white'>
                            <CancelIcon />
                            Cancelar
                        </button>
                    </form>
                </div>
                :
                null
            }
            
            {   isShowSearchError ? <p className='font-bold text-lg text-red-600'>Erro: não foi possível encontrar a cesta buscada</p> : null   }
            {   isShowSearchDone ? <p className='font-bold text-lg text-green-600'>Cesta alterada com sucesso!</p> : null   }
        </div>
    )
}