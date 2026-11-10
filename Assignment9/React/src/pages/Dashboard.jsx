import Navbar from "../components/Navbar";
import SavedPGCard from "../components/SavePGCard";
import RequestCard from '../components/RequestCard';
import { useNavigate } from "react-router-dom";

const requests = [
    {
        id: 1,
        name: "Sunrise Residency",
        type: "Co-living",
        location: "Kudasan, Gandhinagar",
        moveInDate: "1 November 2026",
        status: "Pending"
    },
    {
        id: 2,
        name: "Green View Hostel",
        type: "Co-living",
        location: "Raisan, Gandhinagar",
        moveInDate: "5 November 2026",
        status: "Accepted"
    }
];

const savedPGs = [
    {
        id: 1,
        name: "Sunrise Residency",
        location: "Kudasan, Gandhinagar",
        rent: 7800
    },
    {
        id: 2,
        name: "Green View Hostel",
        location: "Raisan, Gandhinagar",
        rent: 7500
    }
];

const totalRequests = requests.length;

const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
).length;

const acceptedRequests = requests.filter(
    (request) => request.status === "Accepted"
).length;

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    }
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar variant="glass" />

            <section className="border-b border-white/10 px-6 pb-8 pt-32 md:px-20">
                <div>
                    <h1 className="text-4xl font-bold">
                        Welcome back, {user?.name || "Student"}
                    </h1>
                    <p className="mt-3 text-gray-400">
                        Track requests and keep exploring student stays.
                    </p>
                </div>
                 <button onClick={handleLogout} className="w-fit rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:bg-white/10">
                    Logout
                </button>
            </section>
            <section className="bg-[#1C1C1C] px-6 py-8 md:px-20">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Total requests</span>
                            <span className="text-3xl font-bold">{totalRequests}</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Pending</span>
                            <span className="text-3xl font-bold">{pendingRequests}</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Accepted</span>
                            <span className="text-3xl font-bold">{acceptedRequests}</span>
                        </div>
                    </div>

                </div>    
            </section>
            
            <section className="bg-[#1C1C1C] px-6 pb-12 md:px-20">
                <div className="mx-auto max-w-6xl border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-bold">
                        Recent Requests
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Keep track of your PG booking requests.
                    </p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-[#191919] p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Sunrise Residency
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Co-living · Kudasan, Gandhinagar
                                </p>
                                <p className="mt-2 text-sm text-gray-400">
                                    Move-in date: 1 November 2026
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400">
                                Pending
                            </span>
                        </div>
                    </div>

                    {requests.map((request) => (
                        <RequestCard
                            key={request.id}
                            name={request.name}
                            type={request.type}
                            location={request.location}
                            moveInDate={request.moveInDate}
                            status={request.status}
                        />
                    ))}
                </div>
            </section>
            
            <section className="bg-[#1C1C1C] px-6 pb-12 md:px-20">
                <div className="mx-auto max-w-6xl border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-bold">
                        Saved PGs
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Your favourite places to stay.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {savedPGs.map((pg) => (
                            <SavedPGCard
                                key={pg.id}
                                id={pg.id}
                                name={pg.name}
                                location={pg.location}
                                rent={pg.rent}
                            />
                        ))}    
                    </div>
                </div>
            </section>


        </div>
    );
}

export default Dashboard;