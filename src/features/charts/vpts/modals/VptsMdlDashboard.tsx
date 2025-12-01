import { useState, lazy } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { useVptsData } from "../hooks/useData/useVptsData";
import { useVptsImageQuery } from "../hooks/useQuery/useVptsImageQuery";

const BaseChartModal = lazy(() => import('../../common/BaseChartModal'));
const VptsHeatmapChart = lazy(() => import('../../../../shared/components/charts/HighchartsVpts'));

const VptsMdlDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

      // handler to open the modal
    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    // Redux
    const { vptsPayload } = useAppSelector(state => state.vptschart);

    // Tanstack
    const { isLoading, data, error } = useVptsData(isModalOpen);
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
      title={`${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})`}
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
        <img ref={imgRef} src={vptsImageData} alt="vpts-image-dashboard" />
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

export default VptsMdlDashboard
