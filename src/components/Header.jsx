import {useAuth} from "../utils/AuthContext.jsx";
import {LogOut} from "react-feather";

const Header = () => {
    const {user, handleUserLogout} = useAuth()
    return (
        <div id="header--wrapper">
            {user? <><h1>Welcome {user.email}</h1><LogOut onClick={handleUserLogout} className="header--link" /></>
                : <button>Login</button>}
        </div>
    );
};

export default Header;