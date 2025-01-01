import { ToyPreview } from "./ToyPreview.jsx"
import { Link } from "react-router-dom"

export function ToyList({ toys, onRemoveToy, isLoggedinUserAdmin }) {
    return (
        <ul className="toy-list">
            <li key="add-toy" className="add-toy">
                <Link to="/toy/edit">
                    <img src="/miss-toy/plus-icon.svg" alt="add toy"/>
                </Link>
            </li>

            {toys.map(toy =>
                <li key={toy._id}>
                    <ToyPreview toy={toy}/>
                        
                    {isLoggedinUserAdmin && (
                        <section className="admin-dashboard">
                            <button onClick={() => onRemoveToy(toy._id)}>Remove</button>
                            <button><Link to={`/toy/edit/${toy._id}`}>Edit</Link></button>
                        </section>
                )}
                </li>
            )}
        </ul>
    )
}