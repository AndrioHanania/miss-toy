import { userService } from "../../services/user.service.js";
import { SET_USER, START_ACTION, SET_IS_LOADING, ERROR } from "./user.reducer"
import { store } from "../store"

export async function login(credentials) {
    store.dispatch({
        type: START_ACTION,
    })

    try {
        const user = await userService.login(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } 
    catch (error) {
        console.log('Cannot login', error)
        store.dispatch({
            type: ERROR,
            error
        })
        throw error
    }
    finally {
        store.dispatch({
            type: SET_IS_LOADING,
            isLoading: false,
        })
    }
}

export async function signup(credentials) {
    store.dispatch({
        type: START_ACTION,
    })

    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: SET_USER,
            user
        })
        return user
    } 
    catch (err) {
        console.log('Cannot signup', error)
        store.dispatch({
            type: ERROR,
            error
        })
        throw error
    }
    finally {
        store.dispatch({
            type: SET_IS_LOADING,
            isLoading: false,
        })
    }
}

export async function logout() {
    store.dispatch({
        type: START_ACTION,
    })

    try {
        await userService.logout()
        store.dispatch({
            type: SET_USER,
            user: null
        })
    } 
    catch (err) {
        console.log('Cannot logout', error)
        store.dispatch({
            type: ERROR,
            error
        })
        throw error  
    }
    finally {
        store.dispatch({
            type: SET_IS_LOADING,
            isLoading: false,
        })
    }
}