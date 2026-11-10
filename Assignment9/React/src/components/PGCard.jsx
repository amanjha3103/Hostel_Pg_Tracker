function PGCard(props){
    return(
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:border-orange-400/60 hover:shadow-xl">
            <img
                src={props.image}
                alt={props.name}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-400">
                        {props.location}
                    </p>
                    <p className="mt-1 text-sm text-yellow-400">
                        ★ {props.rating}   
                    </p>
                </div>
                
                <h3 className="text-lg font-bold text-white">
                    {props.name}
                </h3>   
                <div className="flex flex-wrap gap-2 py-4 ">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300">
                        {props.type}
                    </span>
                    <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">
                        {props.availableSeats} seats left
                    </span>
                </div>             
                <div className="flex items-center justify-between gap-2 border-t border-white/10">
                    <p className="mt-3 font-semibold text-white-400 "  >
                        ₹{props.rent} / month
                    </p>  
                    <button className='bg-[#f47735] text-white px-4 py-3 rounded-xl font-extrabold  cursor-pointer mt-2'>
                        →
                    </button>
                </div>
                
            </div>             
        </div>
    )
}

export default PGCard;