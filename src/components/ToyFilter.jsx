import { utilService } from "../services/util.service.js"
import { useEffectUpdate } from "../hooks/useEffectUpdate.jsx"
import { useState, useRef } from "react";
import { toyService } from "../services/toy.service.js"
import { Toggle } from "./Toggle.jsx";

export function ToyFilter({ filterBy, onSetFilter }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
    const debouncedSetFilterRef = useRef(utilService.debounce(onSetFilter))

    useEffectUpdate(() => {
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit]);
    
    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterByToEdit({ ...filterByToEdit, [field]: value })
    }

    function handleLabelsChange(event) {
        const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value)
        setFilterByToEdit(prevfilterByToEdit => ({
            ...prevfilterByToEdit,
            labels: selectedOptions
        }))
    }

    const { name, price, priceSort, labels, statusStock } = filterByToEdit;

    return (
        <section className="toy-filter">
            <h2>Filter Tody</h2>

            <form onSubmit={e => e.preventDefault()}>
                <div className="label-input-form">
                    <label htmlFor="name">Name</label>
                    <input value={name} onChange={handleChange}
                        type="search" id="name" name="name"
                    />
                </div>

                <div className="label-input-form">
                    <label htmlFor="price">Price</label>
                    <input onChange={handleChange} value={price} type="number" id="price" name="price" min={0}/>
                    <Toggle
                    onChange={handleChange}
                    isChecked={priceSort}
                    id="priceSort"
                    name="priceSort"
                    label1="Below"
                    label2="Above"
                    />
                </div>

                <div className="label-input-form">
                    <label htmlFor="labels">Labels</label>
                    <select 
                        onChange={handleLabelsChange}
                        value={labels}
                        id="labels"
                        name="labels"
                        size={5}
                        className="labels-select"
                        multiple
                    >
                        <option disabled value="">Choose a Label</option>
    
                        {toyService.getLabels().map(label => 
                            <option key={label} value={label}>
                                {label}
                            </option>
                        )}
                    </select>
                </div>

                <div className="label-input-form">
                    <label htmlFor="statusStock">Status Stock: </label>
                    <select
                        id="statusStock"
                        name="statusStock"
                        value={statusStock}
                        onChange={handleChange}
                    >
                        <option value="all">All</option>
                        <option value="IN_STOCK">In Stock</option>
                        <option value="NOT_IN_STOCK">Out of Stock</option>
                    </select>
                </div>
            </form>
        </section>
    )
}