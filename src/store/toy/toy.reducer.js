import { toyService } from "../../services/toy.service";

export const SET_TOYS = 'SET_TOYS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const UPDATE_TOY = 'UPDATE_TOY'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const START_ACTION = 'START_ACTION'
export const ERROR = 'ERROR'
export const SET_PAGES = 'SET_PAGES'
export const UPDATE_PAGE = 'UPDATE_PAGE'
export const UPDATE_PAGE_SIZE = 'UPDATE_PAGE_SIZE'

const initialState = {
    toys: [],
    filterBy: toyService.getDefaultFilter(),
    pages: 0,
    isLoading: false,
    error: null,
}

export function toyReducer(state = initialState, cmd) {
    switch (cmd.type) {
        case SET_TOYS:
            return {
                ...state,
                toys: cmd.toys
            }
        case REMOVE_TOY:
            return {
                ...state,
                toys: state.toys.filter(toy => toy._id !== cmd.toyId),
            }
        case ADD_TOY:
            return {
                ...state,
                toys: [...state.toys, cmd.savedToy]
            }
        case UPDATE_TOY:
            return {
                ...state,
                toys: state.toys.map(toy => toy._id === cmd.savedToy._id ? cmd.savedToy : toy),
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...cmd.filterBy }
            }
        case UPDATE_PAGE:
            return {
                ...state,
                filterBy: {
                    ...state.filterBy,
                    pagination: { 
                        ...state.filterBy.pagination,
                        page: cmd.page
                    }
                }
            }
        case UPDATE_PAGE_SIZE:
            return {
                ...state,
                filterBy: {
                    ...state.filterBy,
                    pagination: { 
                        ...state.filterBy.pagination,
                        pageSize: cmd.pageSize
                    }
                }
            }
        case SET_PAGES:
            return { ...state, pages: cmd.pages }    
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