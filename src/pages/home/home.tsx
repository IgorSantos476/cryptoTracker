import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

export interface CoinProps {
    id: string,
    name: string,
    symbol: string,
    marketCapUsd: string,
    priceUsd: string,
    volumeUsd24Hr: string,
    changePercent24Hr: string,
    formattedMarketCapUsd: string,
    formattedPriceUsd: string,
    formattedVolumeUsd24Hr: string
}

interface DataProps {
    data: CoinProps[]
}

export function Home() {

    const [coin, setCoin] = useState<CoinProps[]> ([]);
    const [input, setInput] = useState("");
    const [filteredName, setFilteredName] = useState<CoinProps[]>([]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        function searchCoin() {
            let filtering = coin.filter(item => {
                let nameCoin = item.name.toLowerCase();
                return nameCoin.startsWith(input.toLowerCase());
            });

            setFilteredName(filtering);
        }

        searchCoin();
    }, [input]);

    useEffect(() => {
        ApiCoin();
    }, [offset]);

    async function ApiCoin() {
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
            const response = await fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=${URI_API}`);
            const data: DataProps = await response.json();
            const responseCoin = data.data;

            const priceFormatted = responseCoin.map(item => {
                const formattedCurrency = {
                    ...item,
                    formattedMarketCapUsd: price.format(Number(item.priceUsd)),
                    formattedPriceUsd: priceCompact.format(Number(item.priceUsd)),
                    formattedVolumeUsd24Hr: priceCompact.format(Number(item.volumeUsd24Hr))
                }

                return formattedCurrency
            });

            const getAllCoins = [...coin, ...priceFormatted];
            setCoin(getAllCoins);
            
        } catch(err) {
            console.log(err);
        }
    }

    function getMoreCoin() {
        if(offset == 0) {
            setOffset(10);
            return;
        }

        setOffset(offset + 10);
    }

    return(
        <main>
            <form className="form">
                <input
                    id="input"
                    type="text"
                    className="form-control"
                    placeholder="Exemplo: Bitcoin"
                    onInput={(e) => setInput((e.target as HTMLInputElement).value)}
                />
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Moeda</th>
                        <th>Valor Mercado</th>
                        <th>Preço</th>
                        <th>Volume</th>
                        <th>Mudança 24h</th>
                    </tr>
                </thead>
                
                <tbody>

                    { filteredName.length == 0 ? (
                        coin?.map(el => (
                            <tr key={el.id}>
                                <td data-label="Moeda:">
                                    <Link to={`/details/${el.id}`}>{el.name} | {el.symbol}</Link>
                                </td>
                                <td data-label="Valor Mercado:"> {el.formattedMarketCapUsd} </td>
                                <td data-label="Preço:"> {el.formattedPriceUsd} </td>
                                <td data-label="Volume:">{el.formattedVolumeUsd24Hr}</td>
                                <td data-label="Mudança 24h:" className={Number(el.changePercent24Hr) > 0 ? 'tdMore' : 'tdLess'}>
                                    {Number(el.changePercent24Hr).toFixed(2)}
                                </td>
                            </tr>
                        ))
                    ) : ( filteredName.map(element => (
                            <tr key={element.id}>
                                <td data-label="Moeda:">
                                    <Link to={`/details/${element.id}`}>{element.name} | {element.symbol}</Link>
                                </td>
                                <td data-label="Valor Mercado:"> {element.formattedMarketCapUsd} </td>
                                <td data-label="Preço:"> {element.formattedPriceUsd} </td>
                                <td data-label="Volume:">{element.formattedVolumeUsd24Hr}</td>
                                <td data-label="Mudança 24h:" className={Number(element.changePercent24Hr) > 0 ? 'tdMore' : 'tdLess'}>
                                    {Number(element.changePercent24Hr).toFixed(2)}
                                </td>
                            </tr>
                    )) ) }
                </tbody>
            </table>
 
            <div className='container text-center'>
                <button className='btnMoreCoin' onClick={getMoreCoin}>Carregar mais</button>
            </div>

                
        </main>
    )
}