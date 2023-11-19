import {format, parseISO} from 'date-fns'

export function formatDate(date: Date){
    return format(date, "yyyy-MM-dd'T'HH:mm:ss")
}

export function currentDateTimeStr(){
    return format(new Date(Date.now()), "yyyy-MM-dd'T'HH:mm")
}

export function currentDateTime(){
    return new Date(currentDateTimeStr());
}


export function formatDateISO(date: Date){
    return format(parseISO(date.toLocaleString("pt-BR")), "dd-MM-yyyy HH:mm:ss")
}