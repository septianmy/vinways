import {createContext, useReducer} from 'react';

export const AppContext = createContext();

const initialState = {
    isLogin: false,
    isLoading: true,
    isApproved: false,
    payment: false,
    player:false,
    user: null,
    title:"",
};

const reducer = (state, action) => {
    switch (action.type){
        case "USER_LOADED":
            return {
                ...state,
                isLogin: true,
                isLoading: false,
                user : {
                    id : action.payload.id,
                    name : action.payload.fullName,
                    email : action.payload.email,
                    role : action.payload.role,
                    profilePicture : action.payload.profilePicture,
                },
            };
        case "LOGIN":
            localStorage.setItem("token", action.payload.token);
            return{
                ...state,
                isLogin:true,
                isLoading: false,
                user : {
                    id : action.payload.id,
                    name : action.payload.fullName,
                    email : action.payload.email,
                    role : action.payload.role,
                    profilePicture : action.payload.profilePicture,
                },
            };
        case "EDITPROFILE":
            localStorage.setItem("token", action.payload.token);
            return{
                    ...state,
                    isLogin:true,
                    isLoading: false,
                    user : {
                        id : action.payload.id,
                        name : action.payload.fullName,
                        email : action.payload.email,
                        role : action.payload.role,
                        profilePicture : action.payload.profilePicture,
                    },
            };
        case "AUTH_ERROR":
        case "LOGOUT":
            localStorage.removeItem("token")
            return {
                ...state,
                isLogin: false,
                isLoading: false,
                isApproved:false,
                player:false,
                title:"",
            };
        case "PAYMENT":
            return {
                ...state,
                isApproved: true,
            };
        case "PAYOUT":
            return {
                ...state,
                payment: false,
            };
        case "PLAYER_ON":
            return {
                ...state,
                 player: true,
                 title: action.payload,
            };
        default:
            throw new Error();
    }
};

export const AppContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return(
        <AppContext.Provider value={[state, dispatch]}>
            {props.children}
        </AppContext.Provider>
    );
};