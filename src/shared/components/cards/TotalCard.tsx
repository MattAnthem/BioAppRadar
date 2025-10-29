import { useTheme } from '../../hooks/useTheme';
import { ChevronDown, ChevronUp, EqualApproximately } from 'lucide-react';
import { formatBigNumber } from '../../utils/number_format';


type TotalCardProps = {
    pestType: string;
    pestCount: number;
    alert?: string;
    alertPercentage: string;
    description?: string
    alertType: AlertType
}

type AlertType = 'low' | 'moderate' | 'high' 


/**
 * Stat card displaying total detection by type with color code to indicate alert status
 * @param pestCount number of type detected
 * @param pestType type detected
 * @param alert alert type
 * @param description alert description
 * @param alertPercentage 
 * @param alertType Low, High or Moderate  
 * @returns 
 */
const TotalCard = (
    {
        pestCount,
        pestType,
        alert, 
        description,
        alertPercentage,
        alertType
    }: TotalCardProps
) => {
    const themes = useTheme();
    const { bg } = themes.theme.scattererCard;

    const alertClasses = {
        high: {
            indicator: 'bg-red-200/65  border-red-400   text-red-900',
            text: 'text-red-500',
            icon: <ChevronUp/>
        },
        moderate: {
            indicator: 'bg-yellow-200/65  border-yellow-400 text-yellow-900',
            text: 'text-yellow-500',
            icon: <ChevronDown/>
        },
        low : {
            indicator: 'bg-green-200/65 border-green-400 text-green-900',
            text: 'text-green-500',
            icon: <EqualApproximately/>
        },

    }

  return (
    <div className={`${bg} border rounded-sm p-4`}>
        <div className="flex justify-between items-start gap-4">
            <h1 className="text-4xl text-wrap tracking-wide font-semibold">{formatBigNumber(pestCount)} <span className="font-light text-3xl">{pestType}</span></h1>
            <span className={`${alertClasses[alertType].indicator} inline-flex  border  p-1 rounded-2xl `}>{alertClasses[alertType].icon} {alertPercentage}</span>
        </div>
        <h3 className={`${alertClasses[alertType].text} px-1 font-semibold mt-2 mb-4`}>{alert}</h3>
        <h3 className="px-1 text-gray-500">{description}</h3>
    </div>
  )
}

export default TotalCard;
