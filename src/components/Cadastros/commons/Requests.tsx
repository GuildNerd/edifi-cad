import {API_URL_VOLUNTARIO} from "../../../apiConfig";

export const handleGet = async (url: string, APIToken: string) => {
    try {
        let response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: APIToken,
            }
        })
        if (response.ok) {
            return await response.json();
        } else
            throw new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
        console.error('Erro na requisição:', error);
        return ([]);
    }
}

export const handlePost = async (url: string,
                                 body: any,
                                 APIToken: string,
                                 successFunction: (response: Response) => void,
                                 errorFunction: (response: Response) => void) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: APIToken,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            successFunction(response)
        } else {
            if (errorFunction !== null)
                errorFunction(response);
            else
                throw new Error(`${response.status} ${response.statusText}`);
            //TODO: adicionar uma mensagem mais significativa para ser exibida na tela.
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

export const handlePut = async (url: string,
                                body: any,
                                APIToken: string,
                                successFunction: (response: Response) => void,
                                errorFunction: (response: Response) => void) => {

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: APIToken,
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            successFunction(response)
        } else {
            if (errorFunction !== null)
                errorFunction(response);
            else
                throw new Error(`${response.status} ${response.statusText}`);
            //TODO: adicionar uma mensagem mais significativa para ser exibida na tela.
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

export const handleDelete = async (url: string,
                                   APIToken: string,
                                   successFunction: (response: Response) => void,
                                   errorFunction: (response: Response) => void) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: APIToken,
            },
        });

        if (response.ok) {
            successFunction(response);
        } else {
            if (errorFunction !== null)
                errorFunction(response);
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao excluir voluntário:', error);
    }
}