import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

export const Register = () => {

    const [name, setname] = useState('')
    const [status, setStatus] = useState(false)
    const [message, setMessage] = useState('')
    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPassword_confirmation] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (name == '' || username == '' || phone == '' || password == '' || password_confirmation == '') {
            setMessage('Debes llenar todos los campos para continuar')
            return false;
        }
        fetchSaveUser()
    }

    const fetchSaveUser = () => {
        const formData = new FormData()
        let token = JSON.parse([window.localStorage.getItem("token")]);

        formData.append("name", name)
        formData.append("email", username)
        formData.append("password", password)
        formData.append("phone", phone)
        formData.append("password_confirmation", password_confirmation)

        fetch("http://localhost:8000/api/register?token=" + token.token, {
            method: "POST",
            body: formData
        }).then(result => {
            setname('');
            setUsername('');
            setPhone('');
            setPassword('');
            setPassword_confirmation('');
            if (result.status == 201) {
                setStatus(true)
            } else {
                setMessage('Error de registro de usuario, por favor valida tus datos')
            }

        }).catch(e => console.error(e))
    }

    if (status) {
        return <Redirect to='/login' />
    }

    return (
        <div className='container-fluid'>
            <h1 className='text-center'> Registrate</h1> <hr />
            <div className='row justify-content-center'>
                <div className='col-md-4 mt-5'>
                    <input type='text' className='form-control' placeholder='name' onChange={(e) => setname(e.target.value)} value={name} /><br />
                    <input type='email' className='form-control' placeholder='username' onChange={(e) => setUsername(e.target.value)} value={username} /><br />
                    <input type='number' className='form-control' placeholder='phone' onChange={(e) => setPhone(e.target.value)} value={phone} /><br />
                    <input type='password' className='form-control' placeholder='password' onChange={(e) => setPassword(e.target.value)} value={password} /> <br />
                    <input type='password' className='form-control' placeholder='password_confirmation' onChange={(e) => setPassword_confirmation(e.target.value)} value={password_confirmation} /> <br />
                    {status ?
                        <div>
                            <h2>{message}</h2>
                        </div>
                        : <small>{message}</small>
                    }
                    <button className='btn btn-primary btn-sm btn-block' onClick={handleSubmit}>Registro</button>
                </div>
            </div>
        </div>
    )
}
