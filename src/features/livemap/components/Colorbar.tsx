
type ColorbarProps = {
    colorCodes: string[];
    className: string;
    valueScale: number[] | string[];
}

const Colorbar = ({ colorCodes, className, valueScale }: ColorbarProps) => {

    const gradientStyle = {
        background: `linear-gradient(to right, ${colorCodes.join(", ")})`,
        width: "100%",
        opacity: "0.8"
    };


  return (
    <div className={`${className} w-full px-1 h-5 flex justify-center items-start rounded-b-sm`}>
      <div className="w-full h-4 rounded-b-sm border-t-gray-800/65 px-1 flex justify-between items-center pointer-events-none" style={gradientStyle}>
        {
            valueScale.map((val) => (
                <small key={val} className="text-white [text-shadow:-1px_-0.5px_1px_black,0.5px_1px_1px_black]">{val}</small>
            ))
        }
        
      </div>
    </div>
  )
}

export default Colorbar;
