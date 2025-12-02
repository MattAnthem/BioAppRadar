import { useState, lazy } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { useVtipData } from '../hooks/useData/useVtipData';
import { useVtipImageQuery } from '../hooks/useQuery/useVtipImageQuery';

const BaseChartModal = lazy(() => import('../../common/BaseChartModal'));
const VtipChart = lazy(() => import('../../../../shared/components/charts/HighchartsVTIP'));

const VtipMdlDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    // handler to open the modal
    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    const { vtipPayload } = useAppSelector(state => state.vtipchart);
    // Tanstack
    const { isLoading, data, error } = useVtipData(isModalOpen);
    const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, displayMode === 'png');

    // Display mode handlers
    const handleDisplayImage = () => {
        setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    }
    const capitalize = (s: string | undefined) => {
        if( s === undefined) return "--";
        return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
    }
  return (
    <BaseChartModal
        title={`${capitalize(data?.query_spec)} ${data?.name ?? '--'}`}
        data={data}
        dataError={error}
        dataImage={vtipImageData}
        dataLoading={isLoading}
        displayMode={displayMode}
        handleDisplayImage={handleDisplayImage}
        handleDisplayInteractiveChart={handleDisplayInteractiveChart}
        imageError={vtipImageError}
        imageLoading={vtipImageLoading}
        isModalOpen={isModalOpen}
        toggleModal={handleToggleModal}

        downloadFilename={`${vtipPayload.species}_${vtipPayload.parameter}-${vtipPayload.startTime}_${vtipPayload.endTime}`}

        renderImage={(imgRef) => (
            <img ref={imgRef} src={vtipImageData} alt="vtip-image-dashboard" />
        )}

        renderInteractive={(chartRef) => (
            <VtipChart
                ref={chartRef}
                data={data!}
                title
            />
        )}
    />
  )
}

export default VtipMdlDashboard;
