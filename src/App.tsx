import { useState } from "react";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css'

import Login from './components/Login/Login'
import Home from './components/Home'
import Beneficiarios from './components/Cadastros/Beneficiarios/Beneficiarios'
import Cestas from "./components/Cadastros/Cestas/Cestas";
import Voluntarios from "./components/Cadastros/Voluntarios/Voluntarios";
import ControleCestas from "./components/Processos/ControleCestas";
import Admin from "./components/Admin";

function App() {
  const [shownPage, setShownPage] = useState("login");
  const [APIToken, setAPIToken] = useState("");

  function handleChangePage(newPage: string) {
    setShownPage(newPage);
  }

  function handleSetAPIToken(token: string) {
    setAPIToken(token);
  }

  return (
    <div>
      <div>
        {
          shownPage != "login" ?
            <nav>
              <Navbar expand="lg" className='w-full bg-gradient-to-r from-baby-pink to-yellow-300'>
                <Container>
                  <Navbar.Collapse id="basic-navbar-nav" className="flex justify-center">
                    <Nav className="gap-3 text-white text-lg">
                      <Nav.Link className='px-2 hover:text-white' onClick={() => handleChangePage("home")}>Início</Nav.Link>
                      <NavDropdown title="Cadastros" id="basic-nav-dropdown" className='px-2'>
                        <NavDropdown.Item onClick={() => handleChangePage("beneficiarios")} className="hover:text-neon-pink">Beneficiários</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleChangePage("cestas")} className="hover:text-neon-orange">Cestas</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => handleChangePage("voluntarios")} className="hover:text-baby-blue">Voluntários</NavDropdown.Item>
                      </NavDropdown>
                      <Nav.Link className='px-2 hover:text-white' onClick={() => handleChangePage("controleCestas")}>Controle de cestas</Nav.Link>
                      <Nav.Link className='px-2 hover:text-white' onClick={() => handleChangePage("admin")}>Admin</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </nav>
            :
            null
        }
      </div>
      {
        // operadores ternários aninhados para fazer controle das páginas exibidas (necessário para que a aplicação seja SPA)
        shownPage == "home" ? <Home></Home>
          :
          shownPage == "beneficiarios" ? <Beneficiarios APIToken={APIToken}></Beneficiarios>
          :
          shownPage == "cestas" ? <Cestas APIToken={APIToken}></Cestas>
          :
          shownPage == "voluntarios" ? <Voluntarios APIToken={APIToken}></Voluntarios>
          :
          shownPage == "controleCestas" ? <ControleCestas APIToken={APIToken}></ControleCestas>
          :
          shownPage == "admin" ? <Admin APIToken={APIToken}></Admin>
          :
          shownPage == "login" ? <Login handleChangePage={() => handleChangePage("home")} handleSetAPIToken={handleSetAPIToken}></Login>
          :
          null
      }
    </div>
  )
}

export default App
