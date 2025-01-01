import { Link } from "react-router-dom";

export function ToyPreview({ toy }) {

    return (
        <article>
            <Link to={`/toy/${toy._id}`} className="toy-preview">
                <h2>{toy.name}</h2>
                <h4>{toy.price}</h4>
                <img className="toy-img" src={toy.imageUrl} alt={toy.txt} />
                {toy.inStock && <img className="in-stock" src="/miss-toy/in-stock.png" alt="in stock"/>}
            </Link>
        </article>
    )
}
