import React, { useContext, useState } from 'react';

const AuthRequired = ({ children }) => {
  const { userKeys } = useContext(AuthContext);
  var [storedLoginState, setLoginState] = useState({});
  const [isLoginStateChecked, setIsLoginStateChecked] = useState(false);

  useEffect(() => {
    const checkLoginState = () => {
      storedLoginState = JSON.parse(window.localStorage.getItem('login_state'));
      if (storedLoginState) {
        setIsLoginStateChecked(true); // Set to true if loginState exists, false otherwise
      } else {
        window.setTimeout(() => {
          checkLoginState();
        }, 1000);
        setIsLoginStateChecked(false);
      }
    };
    checkLoginState(); // Check on component mount
    return () => {
      window.removeEventListener('storage', checkLoginState);
    };
  }, []);

  if (!isLoginStateChecked) {
    return (
      <div className='loader-container'>
        <Spinner style={{ width: '3rem', height: '3rem' }} />
        <p>Hello, we're just confirming your login details. Hang tight!!!</p>
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthRequired;
