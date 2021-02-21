import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';

const urlBackend = 'http://localhost:8000/api/';

export const FiltersCategories = () => {
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchingCategories()
    }, [])

    const fetchingCategories = async () => {
        const token = JSON.parse([window.localStorage.getItem("token")]);
        console.log(token)
        try {
            const res = await fetch(urlBackend + 'categories?token=' + token.token, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            const data = await res.json();
            setCategories(data)
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <ul className=''>
                {categories.length > 0
                    ? categories.map((cat, i) => (
                        <li className='nav-link' key={cat.id}><Link to={`/${cat.slug}`}>{cat.title} test</Link></li>
                    )) :
                    <li>No hay Categorias...</li>
                }
            </ul>
        </div>
    )
}
