import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { FiltersCategories } from "../blog/FiltersCategories";
import { Sidebar } from "../blog/Sidebar";

const urlBackend = 'http://localhost:8000/api/';

const Card = styled.div`
    padding: 0;
    box-shadow: 4px 9px 38px -5px rgba(0,0,0,0.54);
`

export const Categories = () => {
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
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='container-fluid'>
            <h1 className='text-center'>Categorias del Blog</h1><hr />
            <div className='row justify-content-center'>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className="col-sm-6">
                    <div className='row'>
                        {categories.length > 0 ?
                            categories.map((cat) => (
                                <div className="col-sm-6 my-3">
                                    <Card className="card">
                                        <div className="card-body">
                                            <h5 className="card-title text-center">{cat.title}</h5>
                                            <Link className='btn btn-primary btn-sm btn-block btn-cards' to={`/categoria/${cat.slug}`}>Ver posts </Link>
                                        </div>
                                    </Card>
                                </div>
                            ))
                            : <p>Cargando categorias ...</p>
                        }
                    </div>
                </div>
                <div className='col-md-3'>
                    <FiltersCategories />
                </div>
            </div>
        </div>
    )
}
