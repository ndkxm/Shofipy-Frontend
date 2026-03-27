const Status = ({text, icon:Icon, bg, color}) => {
    return (
        <div className={`${bg} ${color} p-2 font-medium rounded flex items-center gap-1 my-3`}>   
            {text} <Icon size={16} className="p-0 m-0"/>
        </div>
    )
}

export default Status;