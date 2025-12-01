import { useState, lazy } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { useVpData } from '../hooks/useData/useVpData';
import { useVpImageQuery } from '../hooks/useQuery/useVpImageQuery';

const VpChartHighcharts = lazy(() => import('../../../../shared/components/charts/HighchartsVP'))
const BaseChartModal = lazy(() => import('../../common/BaseChartModal'))

const VpMdlDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayMode, setDisplayMode] = useState<'png' | 'interactive'>('interactive');

    const handleOpenModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    // Display mode handlers
    const handleDisplayImage = () => {
        setDisplayMode('png');
    }
    const handleDisplayInteractiveChart = () => {
        setDisplayMode('interactive');
    }

    // Redux
    const { currentAltitude } = useAppSelector(state => state.altitude);
    const { vpPayload } = useAppSelector(state => state.vpchart);
    const { isLoading, data, error } = useVpData(isModalOpen);
    const { data: vpImageData, isLoading: vpImageLoading, error: vpImageError } = useVpImageQuery(vpPayload, displayMode === 'png');

    const capitalize = (s: string | undefined) => {
        if( s === undefined) return "";
        return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
    }
  return (
    <BaseChartModal
        title={`${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})`}
        data={data}
        dataError={error}
        dataLoading={isLoading}
        dataImage={vpImageData}
        displayMode={displayMode}
        handleDisplayImage={handleDisplayImage}
        handleDisplayInteractiveChart={handleDisplayInteractiveChart}
        imageError={vpImageError}
        imageLoading={vpImageLoading}
        isModalOpen={isModalOpen}
        toggleModal={handleOpenModal}
        downloadFilename={`${vpPayload?.species}_${vpPayload?.parameter}-${vpPayload?.time}`}
        selectedHeight={currentAltitude}

        renderImage={(imgRef) => (
            <img ref={imgRef} src={vpImageData} alt='vp-image-dashboard'/>
        )}
        renderInteractive={(chartRef) => (
            <div className="lg:w-1/2 w-full">
                <VpChartHighcharts 
                    data={data!} 
                    selectedHeight={currentAltitude} 
                    ref={chartRef} 
                    displayTitle={true} 
                    chartHeight={500} 
                />
            </div>
        )}
    />
  )
}

export default VpMdlDashboard;
