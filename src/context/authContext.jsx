import { createContext, useContext, useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { SIGN_IN } from "../constants/endpoints.constant"
import { PATH_NAMES } from '../constants/paths.constant';
import { toast } from 'react-toastify';

export const AuthContext = createContext({
  authorized: false,
  token: null,
  userId: null,
  userName: null,
  searchValue: "",
  setSearchValue: "",
  eventCategory: "",
  setEventCategory: "",
  firstName: null,
  notification: "",
  setnotification: "",
  eventData: "",
  setEventData: "",
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || null);
  const [firstName, setfirstName] = useState(localStorage.getItem('firstName') || null);
  const [notification, setnotification] = useState("");
  const [authorized, setAuthorized] = useState(Boolean(token));
  const [searchValue, setSearchValue] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventData, setEventData] = useState(null);

  const { sendRequest } = useFetch();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('firstName', firstName);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
    }
  }, [token, userId, userName]);

  const login = async (credentials, modal) => {
    //const responseData = await sendRequest(SIGN_IN, 'POST', credentials);

    const { access_token, user_id, user_name, expires_in, firstName } = credentials;
    setToken(access_token);
    setUserId(user_id)
    setUserName(user_name)
    setAuthorized(true);
    setfirstName(firstName)

    // Set token expiration time to 'expires_in' seconds from now
    const expirationTime = new Date().getTime() + expires_in * 1000;

    localStorage.setItem('tokenExpiration', expirationTime);
    // console.log(expirationTime); 

      setTimeout(() => !modal ? "" :window.location.replace(PATH_NAMES.explore), 1000) 
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration'); 
    window.location.replace(PATH_NAMES.root); 
  };

  // Check if the token has expired when the component mounts or updates
  useEffect(() => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime > parseInt(expirationTime)) {
      // Token has expired, logout and redirect to login page
      logout();
    }
  }, [authorized]);

  return (
    <AuthContext.Provider value={{
      token,
      login,
      logout,
      authorized,
      userId,
      userName,
      firstName,
      searchValue,
      setSearchValue,
      notification,
      setnotification,
      eventCategory,
      setEventCategory,
      eventData,
      setEventData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
