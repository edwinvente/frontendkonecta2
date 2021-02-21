import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components';
import { FiltersCategories } from './FiltersCategories';
import { Sidebar } from './Sidebar';

const urlBackend = 'http://localhost:8000/api/';
const tokens = JSON.parse([window.localStorage.getItem("token")]);

const Card = styled.div`
    padding: 0;
    box-shadow: 4px 9px 38px -5px rgba(0,0,0,0.54);
`
const Imagen = styled.img`
    height: 100%;
    width: 100%;
    padding: 0;
`

export const Post = () => {

    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [token, setToken] = useState(tokens)
    const [inFetching, setFetch] = useState(true)


    let params = useParams()

    useEffect(() => {
        fetch(urlBackend + 'posts/' + params.slug + '?token=' + token.token, {
            method: 'GET'
        }).
            then(res => res.json()).
            then(data => {
                setPost(data)
                setFetch(false)
                console.log(data);
            }).
            catch(err => {
                console.log('Hay un error http');
            })
    }, [])

    console.log(params.slug)

    return (
        <div className='container-fluid my-3'>
            <h2 className='text-center'>Slug del post {params.slug} </h2> <hr />
            <div className='row'>
                <div className='col-12 col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-12 col-md-6'>
                    {!inFetching ?
                        <Card className='col-12 p-3'>
                            <h1>{post.title}</h1>
                            <Imagen src={`http://localhost:8000/api/post/file/${post.image}`} className="card-img-top" alt={post.title} />
                            <p>{post.short_text}</p>
                            <p>{post.description}</p>
                        </Card>
                        : <p>cargando</p>
                    }
                    <Card className='card my-3 p-3'>
                        <div>
                            <p>Agrega tu comentario</p>
                            <textarea className='form-control' rows={4}></textarea>
                            <button className='btn btn-dark btn-sm btn-block'>Comentar</button>
                        </div>
                        <h4 className='mt-4'>comentarios</h4>
                        {comments.length > 0
                            ? <p>mapiar data</p>
                            : <small>No hay comentarios...</small>
                        }
                    </Card>
                </div>
                <div className='col-12 col-md-3'>
                    <FiltersCategories />
                </div>
            </div>
        </div>
    )
}
