export type Voluntario = {
    id: number | null,
    nome: string,
    email?: string,
    cpf: string,
    telefone?: string,
    endereco?: {
        id: number | null,
        logradouro: string,
        numero: string,
        cep: string,
        bairro: string,
        cidade: string,
        estado: string
    }
}

export const emptyVoluntario  = {
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
