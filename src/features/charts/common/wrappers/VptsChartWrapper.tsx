import type { VptsResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";
import type { BaseChartProps } from "../BaseChart";
import BaseChart from "../BaseChart";

export default function VptsChartWrapper(props: Readonly<BaseChartProps<VptsResponse>>) {
  return (
    <BaseChart<VptsResponse> {...props} />
  )
}
