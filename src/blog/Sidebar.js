import { Link } from "react-router-dom";
import styled from 'styled-components';

export const Sidebar = () => {
    return (
        <div>
            <ul className=''>
                <li className='nav-link'><Link to="/perfil">Mi perfil 📁</Link></li>
                <li className='nav-link'><Link to="/blog">Blog 📁</Link></li>
                <li className='nav-link'><Link to="/crear/post">Crear Post 📁</Link></li>
                <li className='nav-link'><Link to="/categorias">Categorias 📁</Link></li>
                <li className='nav-link'><Link to="/crear/categoria">Crear Categoria 📁</Link></li>
                {/* <li className='nav-link'><Link to="/favoritos">Mis Favoritos</Link></li> */}
            </ul>
        </div>
    )
}

