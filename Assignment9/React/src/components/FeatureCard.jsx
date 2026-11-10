function FeatureCard(props) {
    return(
        <div >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f47735] text-white">
                <span className="text-2xl">{props.icon}</span>
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">
                {props.title}
            </h3>
            <p className="mt-3 leading-7 text-gray-400">
                {props.description}
            </p>
        </div>
    );
}

export default FeatureCard;