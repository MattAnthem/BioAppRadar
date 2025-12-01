import type { VtipResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";
import type { BaseChartProps } from "../BaseChart";
import BaseChart from "../BaseChart";

export default function VtipChartWrapper(props: Readonly<BaseChartProps<VtipResponse>>) {
  return (
    <BaseChart<VtipResponse> {...props}/>
  )
}
