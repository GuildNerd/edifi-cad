import {currentDateTimeStr} from '../commons/Utils'

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
    id: number,
    data_hora: Date,
    id_cesta : number,
    id_voluntario : number,
    id_beneficiario : number
}

export type ResumoDistribuicao = {
    cestas_distribuidas: number,
    beneficiarios_assistidos: number
}

export const emptyResumo: ResumoDistribuicao = {
    cestas_distribuidas: 0,
    beneficiarios_assistidos: 0
}

export const emptyFormData: DistribuicaoFormData = {
    id: 0,
    id_cesta: 0,
    id_beneficiario: 0,
    id_voluntario: 0,
    data_hora: new Date(currentDateTimeStr())
}

