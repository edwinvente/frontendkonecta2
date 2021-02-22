import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { FiltersCategories } from './FiltersCategories';
import { Sidebar } from './Sidebar';

const urlBackend = 'http://localhost:8000/api/';

const Card = styled.div`
    box-shadow: 4px 9px 38px -5px rgba(0,0,0,0.54);
`

export const Miperfil = () => {
    const [perfil, setPerfil] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        fetchingProfile()
    }, [])

    const fetchingProfile = async () => {
        let token = JSON.parse([window.localStorage.getItem("token")]);
        try {
            const res = await fetch(urlBackend + 'user/profile?token=' + token.token, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            const data = await res.json();
            setPerfil(data.user)
            setFetching(false)
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='container-fluid'>
            <h1 className='text-center'>Mi Perfil</h1> <hr />
            <div className='row justify-content-center'>
                <div className='col-12 col-md-3'>
                    <Sidebar />
                </div>
                <Card className='col-md-6 p-3 card'>
                    {fetching ?
                        <p>Cargando...</p>
                        :
                        <div>
                            <h3 className='text-center'>{perfil.name}</h3> <hr />
                            <p>{perfil.email}</p>
                            <p>{perfil.type_user}</p>
                            <p>{perfil.phone}</p>
                        </div>
                    }
                </Card>
                <div className='col-12 col-md-3'>
                    <FiltersCategories />
                </div>
            </div>
        </div>
    )
}
