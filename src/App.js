import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import { Navbar } from "./components/index";
import { Blog } from "./blog";

const urlApi = 'http://localhost:8000/api/';

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
            {/* rutas protegidas */}
            <PrivateRoute path="/protected" children={<ProtectedPage />} />
            <PrivateRoute path="/blog" children={<Blog />} />
          </Switch>
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
  const [user, setUser] = useState(null);

  const signin = cb => {
    return fakeAuth.signin(() => {
      setUser("user");
      cb();
    });
  };

  const signout = cb => {
    return fakeAuth.signout(() => {
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
        Welcome!{" "}
        <button
          onClick={() => {
            auth.signout(() => history.push("/"));
          }}
        >
          Sign out
      </button>
      </p>
    </div>
  ) : (
      <div className='container-fluid'>
        <p>You are not logged in.</p>
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

function HomePage() {
  return <h3>Home</h3>;
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

    const request = await fetch(urlApi + 'login', {
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
    await accessDashboard(data.token)

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
      <div className='row'>
        <div className='col-md-3'>
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