import { toyService } from "../../services/toy.service";
import { store } from "../store";
import { ADD_TOY, UPDATE_TOY, REMOVE_TOY, SET_FILTER_BY, SET_IS_LOADING, SET_TOYS, SET_PAGES, UPDATE_PAGE, START_ACTION, ERROR, UPDATE_PAGE_SIZE } from "./toy.reducer";

export async function loadToys() {
    store.dispatch({
        type: START_ACTION,
    })

    try {
        const filterBy = store.getState().toyModule.filterBy
        const { toys, pages } = await toyService.query(filterBy)
        store.dispatch({ type: SET_TOYS, toys })
        _setToysData(pages)
        return toys
    } 
    catch (error) {
        console.error('Cannot load toys:', error)
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

export async function removeToy(toyId) {
    store.dispatch({
        type: START_ACTION,
    })

    try {
        const { pages } = await toyService.remove(toyId)
        store.dispatch({ type: REMOVE_TOY, toyId })
        _setToysData(pages)
    } 
    catch (error) {
        console.error('Cannot remove toy:', error)
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

export async function saveToy(toyToSave) {
    store.dispatch({
        type: START_ACTION,
    })

    try {
        const type = toyToSave._id ? UPDATE_TOY : ADD_TOY
        const { savedToy, pages } = await toyService.save(toyToSave)
        store.dispatch({ type, savedToy })
        _setToysData(pages)
        return savedToy
    } 
    catch (error) {
        console.error('Cannot save toy:', error)
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

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export function updatePage(page) {
    store.dispatch({ type: UPDATE_PAGE, page })
}

export function updatePageSize(pageSize) {
    store.dispatch({ type: UPDATE_PAGE_SIZE, pageSize })
}

function _setToysData(pages) {
    store.dispatch({
        type: SET_PAGES,
        pages
    })
}