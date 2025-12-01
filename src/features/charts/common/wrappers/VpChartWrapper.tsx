import type { BaseChartProps } from '../BaseChart'
import type { VpResponse } from '../../../../api/endpoints/verical_profile/verticalProfilesAPI'
import BaseChart from '../BaseChart'

export default function VpChartWrapper(props: Readonly<BaseChartProps<VpResponse>>) {
  return (
    <BaseChart<VpResponse> {...props}/>
  )
}
