import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toyService } from "../services/toy.service";
import { saveToy } from "../store/toy/toy.actions";
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { Loader } from "../components/Loader.jsx";
import { useSelector } from "react-redux";
import { ImgUploader } from '../components/ImgUploader.jsx';

export default function ToyEdit() {
    const isLoading =  useSelector(storeState => storeState.toyModule.isLoading);
    const [toy, setToy] = useState(toyService.getDefaultToy())
    const navigate = useNavigate()
    const { toyId } = useParams()

    useEffect(() => {
        if (toyId) {
            loadToy()
        }
    }, [toyId])

    async function loadToy() {
        try {
            const toy = await toyService.getById(toyId)
            setToy(toy)
        } catch (error) {
            showErrorMsg('Cannot load toy')
            console.log('error:', error)
        }
    }

    function handleChange({ target }) {
        let { name: field, value, type } = target
        switch (type) {
            case 'number':
            case 'range':
                value = +value
                break;
            case 'checkbox':
                value = target.checked
            default:
                break;
        }
        setToy((prevToy) => ({ ...prevToy, [field]: value }))
    }

    function handleLabelsChange(event) {
        const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value)
        setToy(prevToy => ({
            ...prevToy,
            labels: selectedOptions
        }))
    }


    async function onSubmitToy(ev) {
        ev.preventDefault()

        try {
            await saveToy(toy)
            navigate('/toy')
            showSuccessMsg('Toy saved')
        } catch (err) {
            showErrorMsg('Cannot save toy')
            console.log('err:', err)
        }
    }

    const { name, price, inStock, labels, imageUrl } = toy

    return (
        <section className="toy-edit">
            <Link to="/toy"><button className="close-btn">X</button></Link>

            <h1>{toyId ? 'Edit' : 'Add'} Toy</h1>

            <form onSubmit={onSubmitToy}>
                <label htmlFor="name">Name</label>
                <input onChange={handleChange} value={name} type="text" id="name" name="name" />

                <label htmlFor="price">Price</label>
                <input onChange={handleChange} value={price} type="number" id="price" name="price" />

                <label htmlFor="inStock">In Stock</label>
                <input onChange={handleChange} checked={inStock} type="checkbox" id="inStock" name="inStock" />

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
                    <option disabled value="">Choose a label</option>

                    {toyService.getLabels().map(label => 
                        <option key={label} value={label}>
                            {label}
                        </option>
                    )}
                </select>

                <ImgUploader handleChange={handleChange} imageUrl={imageUrl} id="imageUrl" className="upload-preview"/>


                <section className="btns">
                    <button className="btn">Save</button>
                </section>
            </form>

            <Loader isLoading={isLoading} text="saving..."/>
        </section>
    )
}
