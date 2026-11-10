function RequestCard({name, type, location, moveInDate,status}) {
    const statusStyle=
        status==="Accepted"
            ?"bg-green-50/10 text-green-400"
            :"bg-yellow-500/10 text-yellow-400"
    return(
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#191919] p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h3>{name}</h3>
                    <p>
                        {type}.{location}
                    </p>
                </div>
                <span className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${statusStyle}`}>
                    {status}
                </span>
            </div>
        </div>
    );
}

export default RequestCard;