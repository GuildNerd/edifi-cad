
export type DistribuicaoCesta = {
    id:number,
    data_hora: Date,
    cesta : {
        id : number,
        nome : string
    },
    voluntario : {
        id : number,
        nome : string,
        cpf : string
    },
    beneficiario :{
        id : number,
        nome : string,
        cpf : string
    }
}

export type Beneficiario = {
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

export type Cesta = {
    id: number,
    nome: string,
    descricao: string,
    quantidade_estoque: number,
}



export type DistribuicaoFormData = {
    data_hora: Date,
    id_cesta : number,
    id_voluntario : number,
    id_beneficiario : number
}
