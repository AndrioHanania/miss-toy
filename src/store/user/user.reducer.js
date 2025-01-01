import { userService } from "../../services/user.service"

export const SET_USER = 'SET_USER'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const START_ACTION = 'START_ACTION'
export const ERROR = 'ERROR'

const initialState = {
    user: userService.getLoggedinUser(),
    isLoading: false,
    error: null,
}

export function userReducer(state = initialState, cmd) {
    switch (cmd.type) {
        case SET_USER:
            return { ...state, user: cmd.user }
        case SET_IS_LOADING:
            return {
                ...state, isLoading: cmd.isLoading
            }
        case START_ACTION:
            return {
                ...state, isLoading: true, error: null,
            }
        case ERROR:
            return {
                ...state, error: cmd.error
            }
        default:
            return state
    }
}