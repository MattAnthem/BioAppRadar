import GlassHeader from "../../shared/components/cards/GlassHeader";
import SectionCard from "../../shared/components/cards/SectionCard";


const VpChart = () => {
  return (
    <SectionCard className='w-full lg:h-full h-[60vh] col-span-2 p-1'>

        {/* Heading */}
        <GlassHeader className=" w-full">
            <h3 className='text-white tracking-wider'>VP</h3>
            <h2 className='text-white tracking-wider'>Vertical Profile</h2>
        </GlassHeader>           

        {/* Chart */}
        <div className="flex mt-7 w-full h-full items-center justify-center ">

        </div>

    </SectionCard>
  )
}

export default VpChart;
