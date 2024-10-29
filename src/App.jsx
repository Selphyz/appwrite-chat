import './App.css'
import Room from './pages/Room'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import {AuthProvider} from "./utils/AuthContext.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<PrivateRoutes />} >
                    <Route path="/" element={<Room />} />
                < /Route>
            </Routes>
        </AuthProvider>
    </Router>
  )
}

export default App
