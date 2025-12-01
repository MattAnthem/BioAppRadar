import { useState, lazy,memo } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { useVtipHistData } from '../hooks/useData/useVtipHistData';
import { useVtipImageQuery } from '../hooks/useQuery/useVtipImageQuery';

const BaseChartModal = lazy(() => import('../../common/BaseChartModal'));
const VtipChart = lazy(() => import('../../../../shared/components/charts/HighchartsVTIP'));

const VtipMdlHistory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    // Data
    const { isLoading, data, error } = useVtipHistData(isModalOpen);
    const { vtipPayload } = useAppSelector(state => state.vtip_histchart);
    const { data: vtipImageData, isLoading: vtipImageLoading, error: vtipImageError } = useVtipImageQuery(vtipPayload, displayMode === 'png');

    // Chart modal handler
    const handleToggleModal = () => {
        setIsModalOpen(!isModalOpen);
    }
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

        renderImage={(imgRef) => (
            <img ref={imgRef} src={vtipImageData} alt="vtip-image-history" />
        )}

        renderInteractive={(chartRef) => (
            <VtipChart
                ref={chartRef}
                data={data!}
                chartHeight={500}
                title
            />
        )}
    />
  )
}

export default memo(VtipMdlHistory);
