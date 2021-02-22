import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import { Footer, Navbar } from "./components";
import { Blog, Create, PostCategory, Createcategory, Miperfil, Post } from "./blog";
import { HomePage } from "./HomePage";
import { Register } from "./auth";
import { Categories } from "./categories";
import styled from "styled-components";

const urlApi = 'http://localhost:8000/api/';

const Prefooter = styled.div`
  background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJhuoVijMteWxAuEjTRi9QAIcBk3JuZn8KEQ&usqp=CAU');
  background-size: contain;
  margin-top: 50px;
  height: 180px;
  width: 100%;
`

const AuthExample = () => {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <Navbar />
          <AuthButton />

          <Switch>
            <Route path="/" children={<HomePage />} exact />
            <Route path="/login" children={<LoginPage />} />
            <Route path="/registro" children={<Register />} />
            {/* rutas protegidas */}
            <PrivateRoute path="/protected" children={<ProtectedPage />} />
            <PrivateRoute path="/perfil" children={<Miperfil />} />
            <PrivateRoute path="/blog" children={<Blog />} />
            <PrivateRoute path="/crear/post" children={<Create />} />
            <PrivateRoute path="/post/:slug" children={<Post />} />
            <PrivateRoute path="/categorias" children={<Categories />} />
            <PrivateRoute path="/crear/categoria" children={<Createcategory />} />
            <PrivateRoute path="/categoria/:slug" children={<PostCategory />} />
          </Switch>
          <Prefooter className='container-fluid'></Prefooter>
          <Footer />
        </div>
      </Router>
    </ProvideAuth>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const authContext = createContext();

function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useProvideAuth() {
  const token = window.localStorage.getItem("token") ? JSON.parse([window.localStorage.getItem("token")]) : null
  const [user, setUser] = useState(token);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser(token);
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
      //window.localStorage.clear();
      setUser(null);
      cb();
    });
  };

  return {
    user,
    signin,
    signout
  };
}

function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <div className='container-fluid'>
      <p>
        Bienvenido!{" "}
        <button
          className='btn btn-danger btn-sm'
          onClick={() => {
            auth.signout(() => history.push("/"));
          }}
        >
          Salir
      </button>
      </p>
    </div>
  ) : (
      <div className='container-fluid'>
        <p>No te has logueado aún.</p>
      </div>
    );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

function BlogPage() {
  return <h3>Blog</h3>;
}

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  let status = false;
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };

  let login = async () => {
    const token = JSON.parse([window.localStorage.getItem("token")])
    const request = await fetch(urlApi + 'login?token=' + token, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        "email": username,
        "password": password
      })
    });

    const data = await request.json();
    await accessDashboard(data)
    console.log(data)

  };

  const accessDashboard = (token) => {
    window.localStorage.setItem("token", JSON.stringify(token))
    if (token) {
      auth.signin(() => {
        history.replace(from);
      });
    }
  }

  return (
    <div className='container-fluid'>
      <h1 className='text-center'> Ingreso</h1> <hr />
      <div className='row justify-content-center'>
        <div className='col-md-3 mt-5'>
          <p>Necesitas loguearte para acceder al {from.pathname}</p>
          <input type='text' className='form-control' placeholder='username' onChange={(e) => setUsername(e.target.value)} /><br />
          <input type='password' className='form-control' placeholder='password' onChange={(e) => setPassword(e.target.value)} /> <br />
          <button className='btn btn-primary btn-sm btn-block' onClick={login}>Ingresar</button>
        </div>
      </div>
    </div>
  );
}

export default AuthExample