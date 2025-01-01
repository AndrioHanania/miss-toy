import { useSelector } from "react-redux"
import { closeModal } from "../store/app/app.actions.js"

export function DynamicModal() {
    const modalData = useSelector(storeState => storeState.appModule.modalData)

    if (!modalData) return <></>

    const { cmp: Cmp = <></>, props = null, style = null } = modalData

    return (
        <>
            <section onClick={closeModal} className='modal-backdrop'></section>
            <section style={{ ...style }} className='modal-content'>
                <Cmp {...props} />
                <button className='btn close-btn' onClick={closeModal}>X</button>
            </section>
        </>
    )
}

