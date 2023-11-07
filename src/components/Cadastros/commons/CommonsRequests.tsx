
export const handlePost = async (url: string, body : any, APIToken: string) => {
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
            return await response.json();
        } else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null;
    }
}


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
            let data  = await response.json();
            return data;
        }
        else
            throw new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
        console.error('Erro na requisição:', error);
        return([]);
    }
}