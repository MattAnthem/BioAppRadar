import { lazy } from "react";
import { useVtipHistData } from "./hooks/useData/useVtipHistData";

const VtipChartWrapper = lazy(() => import('../common/wrappers/VtipChartWrapper'));
const VtipMdlHistory = lazy(() => import('./modals/VtipMdlHistory'));
const VtipHistPopup = lazy(() => import('./popups/VtipHistPopup'));
const VtipChart = lazy(() => import('../../../shared/components/charts/HighchartsVTIP'));

const VtipChartHistory = () => {
  // Tanstack
  const { isLoading, data, error } = useVtipHistData();

  console.log("RENDERING VTIP HIST")

  const capitalize = (s: string | undefined) => {
    if( s === undefined) return "";
    return s ? s[0].toLocaleUpperCase() + s.slice(1) : s;
  }
  return (
    <VtipChartWrapper
        title={`${capitalize(data?.query_spec)} - ${data?.name ?? ''} (${data?.units ?? ''})`}
        ModalComponent={VtipMdlHistory}
        PopupComponent={VtipHistPopup}
        data={data}
        error={error}
        isLoading={isLoading}
        ChartComponent={VtipChart}
    />
  )
}

export default VtipChartHistory
