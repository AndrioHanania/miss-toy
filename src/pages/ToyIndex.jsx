import { ToyFilter } from "../components/ToyFilter.jsx"
import { ToyList } from "../components/ToyList.jsx"
import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadToys, removeToy, setFilterBy, updatePage, updatePageSize } from "../store/toy/toy.actions.js";
import { useEffectUpdate } from "../hooks/useEffectUpdate.jsx"
import { utilService } from "../services/util.service.js"
import { Loader } from "../components/Loader.jsx"
import { Pagination } from "../components/Pagination.jsx"
import { useEffect } from "react"
import { Link, Outlet, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { onToggleModal } from '../store/app/app.actions.js'

export default function ToyIndex() {
    const toys = useSelector(storeState => storeState.toyModule.toys);
    const pages = useSelector(storeState => storeState.toyModule.pages);
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy);
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading);
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter = toyService.getFilterFromSearchParams(searchParams)
    const user = useSelector(storeState => storeState.userModule.user);
    const isLoggedinUserAdmin = user?.isAdmin;

    useEffect(() => {
        setFilterBy(defaultFilter)
    }, [])

    useEffectUpdate(() => {
        setSearchParams(utilService.getTruthyValues(filterBy))

        try{
            loadToys(filterBy);
        }
        catch(error){
            showErrorMsg('Could not load toys');
        }
    }, [filterBy])

    function RemoveToyModal({ toyId }) {
        return (
            <section>
                <p>Are you sure you want to delete  toy with id of {toyId}?</p>
                <button onClick={async () => {
                    onToggleModal(null)

                    try{
                        await removeToy(toyId);
                        showSuccessMsg(`Toy removed`);
                    }
                    catch(error){
                        console.log('err:', err);
                        showErrorMsg('Cannot remove toy ' + toyId);
                    } 
                }}>Yes</button>
            </section>
        );
    }

    async function onRemoveToy(toyId) {
        onToggleModal({
            cmp: RemoveToyModal,
            props: {
                toyId
            },
            style: {
                border: '5px solid red'
            }
        })    
    }

    return (
        <section className="toy-index">
            <ToyFilter filterBy={filterBy} onSetFilter={setFilterBy}/>
            
            <h2>Toys List</h2>

            {!isLoading && (
                <div>
                    <ToyList
                        toys={toys}
                        onRemoveToy={onRemoveToy}
                        isLoggedinUserAdmin={isLoggedinUserAdmin}
                    />
                    
                    <Pagination 
                        pagination={filterBy.pagination}
                        totalPages={pages}
                        onChangePageSize={updatePageSize}
                        onChangePage={updatePage}
                    />
                </div>
            )}
            <Outlet />
            <Loader isLoading={isLoading} text="Loading toys..."/>
        </section>
    )
}