import { store } from './../store';
import { SET_MODAL_DATA } from './app.reducer';

export function onToggleModal(modalData = null) {
    store.dispatch({
        type: SET_MODAL_DATA,
        modalData,
    })
}

export function closeModal() {
    store.dispatch({
        type: SET_MODAL_DATA,
        modalData: null,
    })
}