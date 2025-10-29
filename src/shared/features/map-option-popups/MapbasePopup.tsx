import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useClickOutside } from "../../hooks/useClickOutside";
import { hideMapBasePopup, toggleShowMapBasePopup } from "./mappopupsSlice";
import Tooltip from "../../components/popups/tooltip/Tooltip";
import { useTheme } from "../../hooks/useTheme";
import { Map } from "lucide-react";
import SimpleSelect from "../../components/selects/SimpleSelect";
import type { SelectOption } from "../../components/selects/types";
import Colorbar from "../../components/colorbar/Colorbar";
import { changeCoverage } from "../../../features/livemap/livemapSlice";


const colors = [
  "#30123b",
  "#4685fa",
  "#1ae4b6",
  "#a4fc3c",
  "#faba39",
  "#e4450a",
  "#7a0403"
]

const mapbaseOptions: SelectOption[] = [
  {
    id: 'openstreet',
    displayText: 'Openstreet'
  },
  {
    id: 'carto_light',
    displayText: 'CARTO Light'
  },
  {
    id: 'carto_dark',
    displayText: 'CARTO Dark'
  },
  {
    id: 'satellite',
    displayText: 'Satellite'
  },
]

const coverageOptions: SelectOption[] = [
  {
    id: 'country',
    displayText: 'Country'
  },
  {
    id: 'district',
    displayText: 'District'
  },
  {
    id: 'province',
    displayText: 'Province'
  },
  {
    id: 'sector',
    displayText: 'Sector'
  },
  {
    id: 'village',
    displayText: 'Village'
  },
  {
    id: 'cell',
    displayText: 'Cell'
  },
]

const colormapOptions: SelectOption[] = [
  {
    id: 'viridis',
    displayText: 'Viridis'
  },
  {
    id: 'Rainbow',
    displayText: 'Rainbow'
  },
  {
    id: 'winter',
    displayText: 'Winter'
  },
  {
    id: 'summer',
    displayText: 'Summer'
  },
  {
    id: 'ghistrainbow',
    displayText: 'Ghist Rainbow'
  },
]

const MapbasePopup = () => {

  // redux 
  const { isMapBasePopupOpen } = useAppSelector(state => state.mappopups);
  const mapBasepopupRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  

  // autohide 
  useClickOutside(mapBasepopupRef, () => {
    if (isMapBasePopupOpen) {
      dispatch(hideMapBasePopup())
    }
  })

  const [selectedBase, setSelectedBase] = useState<SelectOption>(mapbaseOptions[0]);
  const [selectedCoverage, setSelectedCoverage] = useState<SelectOption>(coverageOptions[0]);
  const [selectedColormap, setSelectedColormap] = useState<SelectOption>(colormapOptions[0]);

  const handleChangeBase = (option: SelectOption) => {
    setSelectedBase(option);
    console.log(option);
  }

  const handleChangeCoverage = (option: SelectOption) => {
    setSelectedCoverage(option);
    dispatch(changeCoverage(option.id))
    console.log(option);
  }
  
  const handleChangeColormap = (option: SelectOption) => {
    setSelectedColormap(option);
    console.log(option);
  }

  // theme
  const themes = useTheme();
  const { bg, border, hover, options_bg } = themes.theme.simpleSelect;

  return (
    <div ref={mapBasepopupRef} className="relative">

      <Tooltip 
        position="bottom" 
        display_condition={!isMapBasePopupOpen}  // is popup open
        text="Change Base Map"
      >
        
        <button onClick={() => dispatch(toggleShowMapBasePopup())} className={`${bg} ${border} ${hover} p-1 rounded-sm`}>
            <Map/>
        </button>

      </Tooltip>

      {/* Pop-over menu */}
      <div className={`
          ${options_bg} ${border}  border shadow-sm flex flex-col gap-2 justify-center  w-90 absolute right-0 top-full p-2 rounded-sm
          ${isMapBasePopupOpen ? 
              "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }
          transition-all duration-75 ease-out
          origin-top-right
        `}
      >

        {/* Select map base */}
        <SimpleSelect
          onSelectValue={handleChangeBase}
          options={mapbaseOptions}
          width="w-80"
          value={selectedBase.displayText}
          title="Select Base Map"
          className="border-0! bg-none!"
        />

        {/* Select coverage */}
        <SimpleSelect
          onSelectValue={handleChangeCoverage}
          options={coverageOptions}
          width="w-80"
          value={selectedCoverage.displayText}
          title="Select Coverage"
          className="border-0! bg-none!"
        />

        {/* Select colormap */}
        <SimpleSelect
          onSelectValue={handleChangeColormap}
          options={colormapOptions}
          width="w-80"
          value={selectedColormap.displayText}
          title="Select Coverage"
          className="border-0! bg-none!"
        />

        {/* Colormap preview */}
        <div className="w-full flex flex-col">
          <small>Preview</small>
          <Colorbar
            colorCodes={colors}
            valueScale={[]}
            className="w-full rounded-none!"
          />
        </div>

      </div>

    </div>
  )
}

export default MapbasePopup;
