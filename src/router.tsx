import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Header } from './pages/header/header';
import { Home } from './pages/home/home';
import { NotFound } from './pages/notFound/notFound';
import { Details } from './pages/details/details';

export const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Header/>}>
                    <Route index element={<Home/>} />
                    <Route path='/details/:cripto' element={<Details/>} />
                    <Route path='*' element={<NotFound/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}