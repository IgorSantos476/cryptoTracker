import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CoinProps } from '../home/home';
import './details.css';

interface ErrorProps {
    error: string
}

interface responseData {
    data: CoinProps
}

type DataProps = responseData | ErrorProps;

export function Details() {

    const { cripto } = useParams();
    const navigate = useNavigate();
    const [coin, setCoin] = useState<CoinProps>();

    useEffect(() => {
        getCoin();
    }, []);

    async function getCoin() {
        const URI_API = import.meta.env.VITE_API_URL;

        const price = Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            })

            const priceCompact = Intl.NumberFormat('en-US',{
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 2
            })

        try {
            const response = await fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=${URI_API}`);
            const data: DataProps = await response.json();

            if('error' in data) {
                navigate('/');
                return;
            }

            const priceFormatted = {
                ...data.data,
                formattedPriceUsd: price.format(Number(data.data.priceUsd)),
                formattedMarketCapUsd: priceCompact.format(Number(data.data.marketCapUsd)),
                formattedVolumeUsd24Hr: priceCompact.format(Number(data.data.volumeUsd24Hr))
            }

            setCoin(priceFormatted);

        } catch(err) {
            console.log(err);
        }
    }

    return(
        <div className='container content'>
            <h1 className='text-center'>{coin?.name} | {coin?.symbol}</h1>

            <main id='card-coin'>
                <section className='mt-4 text-center'>
                    <img src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} />
                    <h3>{coin?.name} | {coin?.symbol}</h3>
                    <p><strong>Preço: </strong> {coin?.formattedPriceUsd}</p>
                    <p><strong>Mercado: </strong> {coin?.formattedMarketCapUsd}</p>
                    <p><strong>Volume: </strong> {coin?.formattedVolumeUsd24Hr}</p>
                    <p className={Number(coin?.changePercent24Hr) > 0 ? 'more' : 'less'}>
                        <strong>Mudança 24H: </strong> {Number(coin?.changePercent24Hr).toFixed(2)}
                    </p>
                </section>
            </main>
            
        </div>
    )
}