
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AddListing() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        monthlyRent: "",
        description: "",
        roomType: "Shared Room",
        availableSeats: "1",
        amenities: "",
        image: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5002/api/listings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        monthlyRent: Number(formData.monthlyRent),
                        availableSeats: Number(formData.availableSeats),
                        amenities: formData.amenities
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create listing.");
            }

            setMessage("PG listing created successfully!");
            setFormData({
                name: "",
                location: "",
                monthlyRent: "",
                description: "",
                roomType: "Shared Room",
                availableSeats: "1",
                amenities: "",
                image: "",
            });
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 text-white">            
            <Navbar variant="glass" />

            <section className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="text-4xl font-bold text-[#f47735]">
                    Add your PG listing
                </h1>

                <p className="mt-4 text-gray-400">
                    Share your accommodation with students looking for a stay.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-[#191919] p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            PG name
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Sunrise Residency"
                            className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Location
                        </label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Kudasan, Gandhinagar"
                            className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Monthly rent (₹)
                            </label>
                            <input
                                type="number"
                                name="monthlyRent"
                                value={formData.monthlyRent}
                                onChange={handleChange}
                                min="0"
                                required
                                placeholder="7800"
                                className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Available seats
                            </label>
                            <input
                                type="number"
                                name="availableSeats"
                                value={formData.availableSeats}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                required
                                className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Room type
                        </label>
                        <select
                            name="roomType"
                            value={formData.roomType}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none"
                        >
                            <option>Private Room</option>
                            <option>Shared Room</option>
                            <option>Co-living</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Amenities (comma-separated)
                        </label>
                        <input
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleChange}
                            placeholder="Wi-Fi, Laundry, Food"
                            className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Image path (optional)
                        </label>
                        <input
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="/images/hostel1.png"
                            className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe your PG..."
                            className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-white outline-none focus:border-[#f47735]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#f47735] px-5 py-3 font-semibold text-black transition hover:bg-orange-400"
                    >
                        {submitting ? "Creating listing..." : "Create listing"}
                    </button>
                    {message && (
                        <p className="text-sm text-gray-300" role="status">
                            {message}
                        </p>
                    )}
                </form>
            </section>
        </div>
    );
}

export default AddListing;
