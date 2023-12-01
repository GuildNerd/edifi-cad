import { BarChart } from '@mui/x-charts/BarChart';

const uData = [25, 35, 20];

function mesAnterior(quantMeses){
    const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const date = new Date();
    const index = ((date.getMonth() - (quantMeses%12)) + 12) % 12;
    return meses[index];
}

export default function Home() {
    return (
        <div className='flex flex-col items-center gap-4'>
            <h2 className='mt-4 text-2xl font-bold'>Relatórios dos últimos 3 meses</h2>
            <div className='flex justify-around'>
                <div className='flex flex-col items-center'>
                    <h4 className='text-lg font-bold'>Distribuição</h4>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: [ mesAnterior(3), mesAnterior(2), mesAnterior(1) ] }]}
                        series={[{ data: [25, 35, 20] }]}
                        width={500}
                        height={300}
                    />
                </div>
                <div className='flex flex-col items-center'>
                    <h4 className='text-lg font-bold'>Beneficiários assistidos</h4>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: [ mesAnterior(3), mesAnterior(2), mesAnterior(1) ] }]}
                        series={[{ data: [5, 70, 38] }]}
                        width={500}
                        height={300}
                    />
                </div>
            </div>


            <h2 className='mt-4 text-2xl font-bold'>Relatórios do último ano</h2>
            <div className='flex justify-around'>
                <div className='flex flex-col items-center'>
                    <h4 className='text-lg font-bold'>Distribuição</h4>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: [mesAnterior(12), mesAnterior(11), mesAnterior(10), mesAnterior(9), mesAnterior(8), mesAnterior(7), mesAnterior(6), mesAnterior(5), mesAnterior(4), mesAnterior(3), mesAnterior(2), mesAnterior(1)] }]}
                        series={[{ data: [10, 23, 38, 45, 36, 30, 42, 15, 25, 35, 20, 48] }]}
                        width={500}
                        height={300}
                    />
                </div>
                <div className='flex flex-col items-center'>
                    <h4 className='text-lg font-bold'>Beneficiários assistidos</h4>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: [mesAnterior(12), mesAnterior(11), mesAnterior(10), mesAnterior(9), mesAnterior(8), mesAnterior(7), mesAnterior(6), mesAnterior(5), mesAnterior(4), mesAnterior(3), mesAnterior(2), mesAnterior(1)] }]}
                        series={[{ data: [15, 44, 85, 96, 76, 68, 89, 38, 58, 70, 38, 98] }]}
                        width={500}
                        height={300}
                    />
                </div>
            </div>
        </div>
    )
}