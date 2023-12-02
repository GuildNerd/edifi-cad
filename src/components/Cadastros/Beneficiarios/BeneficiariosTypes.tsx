import { formatOnlyDate } from "../../commons/Utils"

export type Beneficiario = {
    id: number | null,
    nome: string,
    email?: string,
    cpf: string,
    telefone?: string,
    data_nascimento: string,
    endereco?: {
        id: number | null,
        logradouro: string,
        numero: string,
        cep: string,
        bairro: string,
        cidade: string,
        estado: string
    },
    dependentes: [{
        id: number | null,
        nome: string,
        email?: string,
        cpf: string,
        telefone?: string,
        data_nascimento: string
    }]
}


export const emptyBeneficiarioPost = {
    id: null,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    endereco: {
        id: null,
        logradouro: "",
        numero: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: ""
    }
}

export const emptyBeneficiario = {
    id: null,
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    endereco: {
        id: null,
        logradouro: "",
        numero: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: ""
    },
    dependentes: [{
        id: null,
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
        data_nascimento: ""
    }]
}

export type Dependente = {
    nome: string,
    email: string,
    cpf: string,
    telefone: string,
    data_nascimento: string,
    id_responsavel: number | null
}

export const emptyDependente = {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: formatOnlyDate(new Date()),
    id_responsavel: 0
}