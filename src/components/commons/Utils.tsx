import {format, parseISO} from 'date-fns'

export function formatDate(date: Date){
    return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}

export function formatDateISO(date: Date){
    return format(parseISO(date.toLocaleString("pt-BR")), "dd-MM-yyyy HH:mm:ss")
}