import Navbar from "../components/Navbar";
import PGCard from "../components/PGCard";
import {useState, useEffect} from "react";


function BrowseStays() {
   const [pgListings, setPgListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
   
    const[seatsOpen, setSeatsOpen]=useState(false)
    const[searchText, setSearchText]=useState("")
    const[selectedCity,setSelectedCity]=useState("all")
    const [selectedType, setSelectedType]=useState("everyone");
    const [selectedBudget, setSelectedBudget]= useState("any");   
    
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5002/api/listings"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch PG listings.");
                }

                const data = await response.json();

                setPgListings(data.listings);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const filteredPGs= pgListings.filter((pg)=> {
        const matchesSearch = pg.name.toLowerCase().includes(searchText.toLowerCase())||pg.location.toLowerCase().includes(searchText.toLowerCase());

        const matchesCity=selectedCity==="all" ||  pg.location.toLowerCase().includes(selectedCity);

        const matchesType= selectedType==="everyone" || pg.roomType.toLowerCase()===selectedType;

        const matchesBudget= selectedBudget==="any"||
        (selectedBudget==="under-5000" && pg.rent<5000)||
        (selectedBudget==="5000-8000" && pg.rent >=5000 && pg.rent <= 8000) ||
        (selectedBudget === "8000-12000" && pg.rent>8000 && pg.rent <= 12000)||
        (selectedBudget === "above-12000" && pg.rent>12000);

        const matchesSeats= !seatsOpen || pg.availableSeats>0; 

        return matchesSearch && matchesCity && matchesType && matchesBudget && matchesSeats;;
    });
    return (
        <div className="min-h-screen bg-black pt-24 text-white">
            <Navbar variant="glass"/>
            <section className="border-b border-white/10 px-6 pb-8 pt-8 md:px-20">
                <h1 className=" mt-3 text-4xl font-bold text-[#f47735]">
                    Find your next stay.
                </h1>
                <p className="mt-4 text-gray-400">
                    Explore PGs and hostels that fit your needs.
                </p>
            </section>
            <section className="min-h-screen w-full bg-[#1C1C1C] px-6 py-10 md:px-20">
                {/* Search and Filters */}
                <div className="mt-10 grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-[#191919] p-4 sm:grid-cols-2 lg:grid-cols-5">

                    {/* Search input */}
                    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[#111111] px-3">
                        <span className="text-lg text-gray-400">⌕</span>
                        <input
                        type="text"
                        placeholder="Search name or location"
                        className="min-w-0 w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-gray-400"
                        value={searchText}
                        onChange={(e)=>setSearchText(e.target.value)}
                        />
                    </div>

                    {/* City filter */}
                    <select
                        defaultValue="all"
                        className="rounded-xl border border-white/10 bg-[#111111] px-3 py-4 text-sm text-white outline-none"
                        value={selectedCity}
                        onChange={(e)=> setSelectedCity(e.target.value)}
                    >
                        <option value="all">All cities</option>
                        <option value="gandhinagar">Gandhinagar</option>
                        <option value="ahmedabad">Ahmedabad</option>
                    </select>

                    {/* Room type filter */}
                    <select
                        defaultValue="everyone"
                        className="rounded-xl border border-white/10 bg-[#111111] px-3 py-4 text-sm text-white outline-none"
                        value={selectedType}
                        onChange={(e)=>setSelectedType(e.target.value)}
                    >
                        <option value="everyone">All room types</option>
                        <option value="private room">Private Room</option>
                        <option value="shared room">Shared Room</option>
                        <option value="co-living">Co-living</option>
                    </select>

                    {/* Budget filter */}
                    <select
                        defaultValue="any"
                        className="rounded-xl border border-white/10 bg-[#111111] px-3 py-4 text-sm text-white outline-none"
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        
                    >
                        <option value="any">Any budget</option>
                        <option value="under-5000">Under ₹5,000</option>
                        <option value="5000-8000">₹5,000–₹8,000</option>
                        <option value="8000-12000">₹8,000–₹12,000</option>
                        <option value="above-12000">Above ₹12,000</option>
                    </select>

                    {/* Seats open button */}
                    <button
                        type="button"
                        className={`flex items-center justify-center gap-2 rounded-xl  px-4 py-3 text-sm font-semibold  transition ${seatsOpen ? 'bg-[#f47735] text-black': 'bg-[#333333] text-white'}  `}
                        onClick={()=>setSeatsOpen(!seatsOpen)}
                    >
                        <span>⚑</span>
                        Seats open
                    </button>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                
                    {loading ? (
                        <p className="mt-8 text-center text-gray-400">
                            Loading PG listings...
                        </p>
                    ) : error ? (
                        <p className="mt-8 text-center text-red-400">
                            {error}
                        </p>
                    ) : (
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredPGs.length > 0 ? (
                                filteredPGs.map((pg) => (
                                    <PGCard
                                        key={pg._id}
                                        name={pg.name}
                                        rent={pg.monthlyRent}
                                        image={pg.image || "/images/hostel1.png"}
                                        location={pg.location}
                                        rating={pg.rating ?? 4.5}
                                        type={pg.roomType}
                                        category="PG"
                                        availableSeats={pg.availableSeats}
                                    />
                                ))
                            ) : (
                                <p className="col-span-full py-12 text-center text-gray-400">
                                    No PGs found
                                </p>
                            )}
                        </div>
)}   
                    
                </div>
            </section>
            
        </div>
        
    );
}

export default BrowseStays;