import { Routes, Route, Link } from 'react-router-dom';
import PGCard from './components/PGCard';
import FeatureCard from './components/FeatureCard';
import BrowseStays from './pages/BrowseStay'
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AddListing from './pages/AddListing';


function App() {
 

  return (
    <Routes>
      <Route path="/" element={
        <div className='min-h-screen bg-[#f47735] text-white'>     
          <Navbar/>
          <main className='min-h-[calc(100vh-72px)] px-6 py-12 md:px-20 md:py-8 '>
            <section className="grid grid-cols-1 items-center gap-2 md:grid-cols-[45fr_55fr] md:gap-0">
             <div className="md:-translate-y-6">
                <p className='text-sm font-semibold uppercase tracking-wideset'>
                  STUDENT STAYS, MADE SIMPLE
                </p> 
                <h1 className='text-6xl font-black leading-tight tracking-tight max-w-xl'>
                  Find a room that feels right.
                </h1>   
                <p className='mt-6 max-w-md leading-7 font-semibold'>
                  Compare verfied PGs and hostels, check live seat availability, and send a request in minutes.  
                </p>
                <div className='mt-8'>
                  <Link to='/listings' className='bg-black text-[#f47735] px-6 py-3 rounded-full   font-semibold cursor-pointer'>
                    Browse stays →
                  </Link>

                </div> 
              </div>
              
              <div className="relative w-full h-[350px] rounded-3xl overflow-hidden md:h-[550px]">
                <img className='h-full w-full object-cover' src="/images/hostel1.png"  alt="student accomodation rounded-3xl"/>
                <div className="absolute bottom-5 left-5 rounded-2xl bg-black p-5 text-white right-5 max-w-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400">
                        Recommended near PDEU
                      </p>
                      <h3 className="mt-2 text-xl font-bold">
                        Sunrise Residency
                      </h3>
                    </div> 
                    <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'>
                      5 seats left
                    </span>

                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <p>
                      ₹7,800 <span className="text-sm font-normal text-gray-400" >/ month</span>
                    </p>
                    <button className="font-semibold text-orange-400 cursor-pointer">
                        View stay →
                    </button>
                  </div>
                </div>
              </div>
            
            </section>
          </main>
          <section className="bg-black px-6 py-16 text-white md:px-20">  

            <div className='flex items-center justify-between'>          
              <div>
                <h2 className="text-3xl font-bold text-[#f47735]">
                  Popular Right Now
                </h2>
                <p className='mt-3 max-w-lg text-gray-600'>
                  Explore student-friendly PGs and hostels near your campus.
                </p>
              </div> 
              <button className='text-3sm font-semibold text-[#f47735] cursor-pointer'>
                View all stays →
              </button>
            </div>
            
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <PGCard
                  name="Sunrise Residency"
                  rent={7800}
                  image="/images/hostel1.png"
                  location="kudasan, Gandhinagar"
                  rating={4.8}
                  type="co-living"
                  category="PG"
                  availableSeats={5}
                />
                
                <PGCard
                  name="Green View Hostel"
                  rent={7500}
                  image="/images/hostel1.png"
                  location="Raisan, Gandhinagar"
                  rating={4.6}
                  type="Co-living"
                  category="Hostel"
                  availableSeats={3}
                />

                <PGCard
                  name="Comfort Homes"
                  rent={9000}
                  image="/images/hostel1.png"
                  location="Kudasan, Gandhinagar"
                  rating={4.9}
                  type="Private Room"
                  category="PG"
                  availableSeats={2}
                />
                
              </div>
            </section>
            <section className='w-full border-t border-white/10 bg-[#191919] px-20 py-20'>
                  <div className="mx-auto   grid grid-cols-1 gap-12 md:grid-cols-3">
                    <FeatureCard 
                      icon="⌕"
                      title="Discover"
                      description="Search by city, budget , room type, and amenities"
                    />
                    <FeatureCard
                      icon="⇄"
                      title="compare"
                      description="Compare rent, amenities, and location side by side"
                    />
                    <FeatureCard 
                      icon="➤"
                      title="request"
                      description='send a booking request and track your stay in one place'
                    />
                  </div>
                </section>
                <footer className="border-t border-white/10 bg-[#111111] px-6 py-8 md:px-20 ">
                  
                    <h2 className='text-lg font-bold text-white'>
                      Hostel PG Tracker
                    </h2>
                    
                </footer>
        </div>
      } />
      <Route path='/listings' element={<BrowseStays />} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-listing" element={<AddListing/>}/>
    </Routes>
    
    
  )
}

export default App;
