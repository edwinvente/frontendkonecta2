import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components';
import { FiltersCategories } from './FiltersCategories';
import { Sidebar } from './Sidebar';

const urlBackend = 'http://localhost:8000/api/';
const tokens = JSON.parse([window.localStorage.getItem("token")]);

const Imagen = styled.img`
    height: 100%;
    width: 100%;
    padding: 0;
`
const Card = styled.div`
    padding: 0;
    box-shadow: 4px 9px 38px -5px rgba(0,0,0,0.54);
`

export const PostCategory = () => {

    const [posts, setPosts] = useState([])
    const [token, setToken] = useState(tokens)
    const [inFetching, setFetch] = useState(true)

    let params = useParams()

    useEffect(() => {
        fetch(urlBackend + 'categories/' + params.slug + '?token=' + token.token, {
            method: 'GET'
        }).
            then(res => res.json()).
            then(data => {
                setPosts(data)
                setFetch(false)
                console.log(data);
            }).
            catch(err => {
                console.log('Hay un error http');
            })
    }, [params.slug])

    return (
        <div className='container-fluid'>
            <h1 className='text-center m-4'>Blog</h1> <hr />
            <div className='row bg-default'>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-6'>
                    <div className='row justify-content-center'>
                        {posts.length > 0
                            ?
                            posts.map((post) => {
                                return (
                                    <Card className="card col-12 col-md-12 my-3" style={{ maxWidth: '600px' }}>
                                        <div className="row g-0">
                                            <div className="col-md-6">
                                                <Imagen src={`http://localhost:8000/api/post/file/${post.image}`} className="card-img-top" alt={post.title} />
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card-body">
                                                    <h5 className="card-title">{post.title}</h5>
                                                    <p className="card-text">{post.short_text}</p>
                                                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                                                    <Link className='btn btn-primary btn-block btn-sm' to={`/post/${post.slug}`}>Ver post completo</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })
                            :
                            <p>Cargando resultados...</p>
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
