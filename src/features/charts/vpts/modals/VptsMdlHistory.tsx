import { useState, lazy } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { useVptsHistData } from "../hooks/useData/useVptsHistData";
import { useVptsImageQuery } from "../hooks/useQuery/useVptsImageQuery";

const BaseChartModal = lazy(() => import("../../common/BaseChartModal"));
const VptsHeatmapChart = lazy(() => import("../../../../shared/components/charts/HighchartsVpts"));

const VptsMdlHistory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

        // handler to open the modal
    const handleToggleModal = () => {
            setIsModalOpen(!isModalOpen);
    }


    // Data
    const { isLoading, data, error } = useVptsHistData(isModalOpen);
    const { vptsPayload } = useAppSelector(state => state.vpts_histchart)
    const { data: vptsImageData, isLoading: vptsImageLoading, error: vptsImageError } = useVptsImageQuery(vptsPayload, displayMode === 'png');
  


        // Display mode handlers
    const handleDisplayImage = () => {
            setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
            setDisplayMode('interactive');
    }

    const capitalize = (s: string | undefined) => {
        if( s === undefined) return "";
        return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
    }
  return (
    <BaseChartModal
        title={`${capitalize(data?.query_spec)} ${data?.name ?? ''}`}
        data={data}
        dataError={error}
        dataImage={vptsImageData}
        dataLoading={isLoading}
        displayMode={displayMode}
        handleDisplayImage={handleDisplayImage}
        handleDisplayInteractiveChart={handleDisplayInteractiveChart}
        imageError={vptsImageError}
        imageLoading={vptsImageLoading}
        isModalOpen={isModalOpen}
        toggleModal={handleToggleModal}

        downloadFilename={`${vptsPayload.species}_${vptsPayload.parameter}-${vptsPayload.startTime}_${vptsPayload.endTime}`}

        renderImage={(imgRef) => (
            <img ref={imgRef} src={vptsImageData} alt="vpts-image-history" />
        )}

        renderInteractive={(chartRef) => (
            <VptsHeatmapChart 
                ref={chartRef}
                data={data!}
                legend
                title
            />
        )}
        
    />
  )
}

export default VptsMdlHistory
