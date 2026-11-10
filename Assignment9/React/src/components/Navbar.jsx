import { Link } from "react-router-dom";

function Navbar({variant='default'}){
    const navclass= variant=='glass'? 'fixed inset-x-0 top-0 border-b border-white/10 bg-[#262626]/40 shadow-lg backdrop-blur-xl':''
    return(
        <nav className={`${navclass} md:flex items-center justify-between px-6 py-4 text-white md:px-20`}>
            <Link to="/" className="text-xl font-bold tracking-tight text-white">
                Hostel PG Tracker
            </Link>
            <div className='flex items-center gap-6'>
              <Link to="/listings" className="rounded-xl px-4 py-2 font-bold text-white transition hover:bg-orange-400">Browse Stays</Link>
              <Link to="/dashboard" className="rounded-xl px-4 py-2 font-bold text-white transition hover:bg-orange-400">Dashboard</Link>
              <Link to="/add-listing" className="rounded-xl px-4 py-2 font-bold text-white transition hover:bg-orange-400">Add Listing</Link>
              <Link to="/login" className='bg-black text-white px-5 py-2.5 rounded-full font-semibold cursor-pointer'>Get Started</Link>
              
            </div>
            
          </nav>
    );
}

export default Navbar