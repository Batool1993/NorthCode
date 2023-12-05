import { createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { propertiesApi } from '../api/PropertiesApi';
import Amplify, { Auth } from 'aws-amplify';
import { amplifyConfig } from '../config';
import {Storage} from 'aws-amplify';

Amplify.configure(amplifyConfig);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state) => ({ ...state }),
  VERIFY_CODE: (state) => ({ ...state }),
  RESEND_CODE: (state) => ({ ...state }),
  PASSWORD_RECOVERY: (state) => ({ ...state }),
  PASSWORD_RESET: (state) => ({ ...state })
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

const AuthContext = createContext({
  ...initialState,
  platform: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
 
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);


 
  
   useEffect(() => {
    const initialize = async () => {
      try {
  
        const user = await Auth.currentAuthenticatedUser();
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.sub,
              avatar: user.attributes.picture,
              email: user.attributes.email,
              name: user.attributes.name,
              phone: user.attributes["custom:phone"],
              address: user.attributes.address,
              country: user.attributes["custom:country"],
              picture: user.avatarUrl,
              plan: user.attributes["custom:plan"]
            }
          }
          
        });
   
      
     } catch (error) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    
    };
  


    initialize();
  }, []);


  const login = async (email, password) => {
    const user = await Auth.signIn(email, password);
    if (user.challengeName) {
      console.error(`Unable to login, because challenge "${user.challengeName}" is mandated and we did not handle this case.`);
      return;
      
    }
  
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: user.attributes.sub,
          avatar: user.attributes.picture,
          email: user.attributes.email,
          name: user.attributes.name,
          phone: user.attributes["custom:phone"],
          address: user.attributes.address,
          country: user.attributes["custom:country"],
          picture: user.avatarUrl,
          plan: user.attributes["custom:plan"]
        }
      }
    });
  };

  const logout = async () => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT'
    });
  };

 

  const register = async (email, password) => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email }
    });
   
    dispatch({
      type: 'REGISTER'
    });
    
  };

  const verifyCode = async (username, code) => {
    await Auth.confirmSignUp(username, code);
    dispatch({
      type: 'VERIFY_CODE'
    });
  };

  const resendCode = async (username) => {
    await Auth.resendSignUp(username);
    dispatch({
      type: 'RESEND_CODE'
    });
  };

  const passwordRecovery = async (username) => {
    await Auth.forgotPassword(username);
    dispatch({
      type: 'PASSWORD_RECOVERY'
    });
  };

  const passwordReset = async (username, code, newPassword) => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    dispatch({
      type: 'PASSWORD_RESET'
    });
  };

  return (
 
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Amplify',
        login,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        //updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
