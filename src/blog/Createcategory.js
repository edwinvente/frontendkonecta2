import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Redirect } from "react-router-dom";
import styled from 'styled-components';
import { FiltersCategories } from "./FiltersCategories";
import { Sidebar } from "./Sidebar";

export const Createcategory = () => {

    const [status, setStatus] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState({});

    const handleSubmit = (e) => {
        const formData = new FormData()
        let token = JSON.parse([window.localStorage.getItem("token")]);

        if (title !== '' || file !== '') {
            formData.append("file", file, file.name)
            formData.append("title", title)
            setStatus(true)
        } else {
            return alert('Por favor completa el formulario')
        }

        fetch("http://localhost:8000/api/categories?token=" + token.token, {
            method: "POST",
            body: formData
        }).then(result => {
            setTitle('');
            console.log(result)
        }).catch(e => console.error(e))
    }

    if (status) {
        return <Redirect to="/categorias" />
    }

    return (
        <div className='container-fluid'>
            <h1 className='text-center m-4'>Crear Categoria</h1> <hr />

            <div className='row bg-default'>
                <div className='col-md-3'>
                    <Sidebar />
                </div>
                <div className='col-md-6'>
                    <div className="mb-3">
                        <label className="form-label">Titulo de la categoria</label>
                        <input type="text" name='title' className="form-control" onChange={(evt) => setTitle(evt.currentTarget.value)} placeholder="Escribe el titulo..." value={title} />
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
                        <button className='btn btn-primary btn-sm btn-block' onClick={handleSubmit}>Crear Categoria</button>
                    </div>
                </div>
                <div className='col-md-3'>
                    <FiltersCategories />
                </div>
            </div>
        </div>
    )
}
