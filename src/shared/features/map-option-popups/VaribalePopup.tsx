import { Variable } from "lucide-react";
import { useTheme } from "../../hooks/useTheme"
import Tooltip from "../../components/popups/tooltip/Tooltip";
import { useRef, useState } from "react";
import SimpleSelect from "../../components/selects/SimpleSelect";
import type { SelectOption } from "../../components/selects/types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { hideVarPopup, toggleShowVarPopup } from "./mappopupsSlice";
import { useClickOutside } from "../../hooks/useClickOutside";
import { setSpatialPayload } from "../../../features/livemap/livemapSlice";


const mapDataOptions: SelectOption[] = [
  {
    id: 'vertical',
    displayText: 'Vertically Integrated Profile'
  },
  {
    id: 'classification',
    displayText: 'Classification'
  },
  {
    id: 'radar_data',
    displayText: 'Radar Data'
  },
]

const vipOptions: SelectOption[] = [
  {
    id: 'vir',
    displayText: 'Vertically Integrated Reflectivity'
  },
  {
    id: 'vid',
    displayText: 'Vertically Integrated Density '
  },
  {
    id: 'eta-exp',
    displayText: 'Eta Expected '
  },
  {
    id: 'eta-obs',
    displayText: 'Eta Observed '
  },
]

const classificationOptions: SelectOption[] = [
  {
    id: 'meteo-biology',
    displayText: 'Meteorological vs Biological'
  },
  {
    id: 'bird-insect',
    displayText: 'Bird vs Insect  '
  },
]
const radarDataOptions: SelectOption[] = [
  {
    id: 'dr',
    displayText: 'Depolarization ratio '
  },
  {
    id: 'ref',
    displayText: 'Reflectivity '
  },
  {
    id: 'zdr',
    displayText: 'Differential Reflectivity '
  },
  {
    id: 'phi',
    displayText: 'Differential Phase '
  },
  {
    id: 'rho',
    displayText: 'Correlation Coefficient '
  },
  {
    id: 'vel',
    displayText: 'Radial Velocity '
  },
  {
    id: 'sw',
    displayText: 'Spectrum Width '
  },
]



const VaribalePopup = () => {

    // Redux
    const { isVarPopupOpen } = useAppSelector(state => state.mappopups);
    const varpopupRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    // autohide 
    useClickOutside(varpopupRef, () => {
      if (isVarPopupOpen) {
        dispatch(hideVarPopup())
      }
    })


    const [selectedType, setSelectedType] = useState<SelectOption>({ //type
      displayText: 'Vertically Integrated Profile',
      id:'vertical'
    });

    const [mapOptions, setMapOptions] = useState<SelectOption[]>(vipOptions);

    const [selectedMap, setSelectedMap] = useState<SelectOption | null>(  {
      id: 'vir',
      displayText: 'Vertically Integrated Reflectivity'
    });

    const themes = useTheme();
    const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

    const handleSelectedData = (option: SelectOption) => {
      setSelectedType(option);
      if (option.id === 'vip') {setMapOptions(vipOptions);}
      if (option.id === 'classification') setMapOptions(classificationOptions);
      if (option.id === 'radar_data') setMapOptions(radarDataOptions);

    }


    const handleSelectedMap = (option: SelectOption) => {
      dispatch(setSpatialPayload({type: selectedType.id as string, map: option.id as string}))
      setSelectedMap(option)
      console.log(option)
    }

  return (
    <div ref={varpopupRef} className="relative">

      <Tooltip 
        position="bottom" 
        display_condition={!isVarPopupOpen}  // is popup open
        text="Variable to display"
      >
        
        <button onClick={() => dispatch(toggleShowVarPopup())} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
            <Variable/>
        </button>

      </Tooltip>

      {/* Pop-over menu */}
      
      <div className={`
          ${options_bg} ${border}  border shadow-sm flex flex-col gap-2 justify-center  w-90 absolute right-0 top-full p-2 rounded-sm
          ${isVarPopupOpen ? 
              "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }
          transition-all duration-75 ease-out
          origin-top-right
        `}
      >

        {/* Select map  */}
        <SimpleSelect
          onSelectValue={handleSelectedData}
          options={mapDataOptions}
          width="w-80"
          value={selectedType.displayText}
          title="Select map data"
          className="border-0! bg-none!"
        />

        {/* Sub element of selected */}
     
          <div className="w-full flex flex-col">
            <p>Select a variable</p>
            <SimpleSelect
              width="w-85"
              options={mapOptions}
              onSelectValue={handleSelectedMap}
              value={selectedMap?.displayText}
            />
          </div>

      </div>

    </div>
  )
}

export default VaribalePopup
