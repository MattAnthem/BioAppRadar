import DataLoading from "../../shared/components/loader/DataLoading";
import FetchError from "../../shared/components/loader/FetchError";
import { useVcrossBioclassData } from "./useData/useVcrossBioclassData"

const VcrossHeatmap = () => {

    const { data, error, isLoading } = useVcrossBioclassData();



    if (isLoading) return (
        <div className='w-full h-full'>
            <DataLoading/>
        </div>
    )
    if (error) return (
        <div className='w-full h-full'>
            <FetchError/>
        </div>
    )

  return (
    <div className='w-full h-full'>
        <p>{data?.info.name}</p>
    </div>
  )
}

export default VcrossHeatmap
