import { BrowserRouter as Router, Link } from "react-router-dom";
import styled from 'styled-components';

const Image = styled.img`
    width: 100px;
`

export const Navbar = () => {
    return (
        <ul className='navbar navbar-expand-lg navbar-light bg-light'>
            <li className='nav-link'>
                <Image src='https://static.wixstatic.com/media/ccc085_72ca18eb2fa04263b98e91168369db4a~mv2.png/v1/fill/w_220,h_130,al_c,q_85,usm_0.66_1.00_0.01/LOGOS%20WEB%20ITCON%20(2).webp' alt='Konecta' />
            </li>
            <li className='nav-link'>
                <Link to="/">Home</Link>
            </li>
            <li className='nav-link'>
                <Link to="/protected">Protected</Link>
            </li>
            <li className='nav-link'>
                <Link to="/blog">Blog</Link>
            </li>
        </ul>
    )
}

