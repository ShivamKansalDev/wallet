const CardHolder = ({
    icon = "",
    title = "",
    value = "",
    progress = null,
    titleBg = "",
    valueBg = ""
}) => {
    return (
        <div className="w-full border rounded shadow-md mb-4 xl:mb-0">
            <div className={`flex items-center justify-between gap-4 border-b-2 p-3 text-white`} style={{background:titleBg}}>
                <a href="#">
                    <h5 className="text-[16px] font-medium">{title}</h5>
                </a>
                {icon}
            </div>
            <div className={`p-3 text-center bg-[${valueBg}]`}>
                <p class="font-normal text-[60px]">{value}</p>
            </div>
            {progress}
        </div>
    );
}

export default CardHolder;