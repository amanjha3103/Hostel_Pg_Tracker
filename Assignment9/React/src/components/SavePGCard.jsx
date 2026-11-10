
import { Link } from "react-router-dom";
function SavedPGCard({id, name, location, rent }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#191919] p-6">
            <h3 className="text-lg font-semibold">
                {name}
            </h3>

            <p className="mt-2 text-sm text-gray-400">
                {location}
            </p>

            <p className="mt-4 text-xl font-bold text-[#f47735]">
                ₹{rent}
                <span className="text-sm font-normal text-gray-400">
                    {" "}/ month
                </span>
            </p>

            <Link
                to={`/listings/${id}`}
                className="mt-5 rounded-full bg-[#f47735] px-5 py-2 text-sm font-semibold text-black"
            >
                View Details
            </Link>
        </div>
    );
}

export default SavedPGCard;
