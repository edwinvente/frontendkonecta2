import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
import styled from 'styled-components';
import { FiltersCategories } from "./FiltersCategories";
import { Sidebar } from "./Sidebar";

export const Create = () => {

    const [status, setStatus] = useState(false);
    const [categories, setCategories] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [shortText, setShortText] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState({});

    useEffect(() => {
        fetchingCategories()
    }, [])

    const fetchingCategories = async () => {
        const token = JSON.parse([window.localStorage.getItem("token")]);
        console.log(token)
        try {
            const res = await fetch('http://localhost:8000/api/' + 'categories?token=' + token.token, {
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

    const handleSubmit = (e) => {
        const formData = new FormData()
        let token = JSON.parse([window.localStorage.getItem("token")]);

        if (title !== '' && category !== 0 && shortText !== '' && description !== '') {
            formData.append("file", file, file.name)
            formData.append("title", title)
            formData.append("category", category)
            formData.append("shortText", shortText)
            formData.append("description", description)
            setStatus(true)
        } else {
            return alert('Por favor completa el formulario')
        }

        fetch("http://localhost:8000/api/posts?token=" + token.token, {
            method: "POST",
            body: formData
        }).then(result => {
            setCategory('');
            setTitle('');
            setShortText('');
            setDescription('');
            console.log(result)
        }).catch(e => console.error(e))
    }

    if (status) {
        return <Redirect to="/blog" />
    }

    return (
        <div className='container-fluid'>
            <h1 className='text-center m-4'>Crear Post</h1> <hr />

            <div className='row bg-default'>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <label className="form-label">Titulo del post</label>
                        <input type="text" name='title' className="form-control" onChange={(evt) => setTitle(evt.currentTarget.value)} placeholder="Escribe el titulo..." value={title} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Categoria</label>
                        <select className='form-control' name='category' onChange={(e) => setCategory(e.target.value)}>
                            <option value='0'>Selecciona una categoria</option>
                            {categories.length > 0
                                ? categories.map((cat, i) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                    >
                                        {cat.title}
                                    </option>
                                )) :
                                <li>No hay Categorias...</li>
                            }
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción corta</label>
                        <textarea name='shortText' className="form-control" rows={2} onChange={(e) => setShortText(e.target.value)} value={shortText} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea name='description' className="form-control" rows={5} onChange={(e) => setDescription(e.target.value)} value={description} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Imagen</label>
                        <input type="file" name='path' className="form-control" onChange={(e) => setFile(e.currentTarget.files[0])} />
                    </div>
                    <div className="mb-3">
                        <img src='' className='path_post' alt='' width='100px' />
                    </div>
                    <div className="mb-3">
                        {status ? <small></small> : <p>Tienes que llenar todos los campos del formulario</p>}
                        <button className='btn btn-primary btn-sm btn-block' onClick={handleSubmit}>Crear Post</button>
                    </div>
                </div>
                <div className='col-md-3'>
                    <FiltersCategories />
                </div>
            </div>
        </div>
    )
}
