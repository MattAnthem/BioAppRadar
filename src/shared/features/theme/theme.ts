import type { ThemeElements } from "./types"


export const light: ThemeElements = {
    chartFontColor: '#424242',
    chartGridline: '#eeeeee',
    chartLegendColor: '#585858',
    displayTogglerBtn: {
        active_border: 'border-b-sky-800',
        active_text: 'text-sky-900',
        border: 'border-gray-400 ',
        hover: 'hover:bg-gray-300'
    },
    datePicker: {
            bg: 'bg-neutral-200',
            border: 'border-gray-400',
            text: 'text-gray-900',
            hover: 'hover:bg-blue-500 hover:text-white',
            selectedDay: 'bg-blue-600 text-white font-semibold',
            popupBg: 'bg-white',
            popupBorder: 'border-gray-300',
    },

    texts: {
        primary: 'text-gray-950',
        secondary: 'text-gray-500'
    },
    mainBg: 'bg-gray-50',
    sidebar: {
        main: {
            background: 'text-black bg-stone-100',
            border: 'border-gray-300',
            section_line: 'bg-gray-300',
            toggler_side_bg: 'bg-gray-200',
            toogler_hover: 'hover:bg-gray-300',
            logos: 'bg-stone-100'
        },
        navs: {
            text: 'text-black',
            text_hover: 'hover:text-gray-800',
            text_active: 'text-gray-50',
            bg_active: 'bg-gray-500',
            bg_hover: 'hover:bg-gray-200',
            subnav_border: 'border-gray-300',
            subnav_hover: 'hover:bg-gray-200',
            subnav_text: 'text-gray-500'
        }
    },
    topbar: {
        main: {
            bg: 'bg-stone-100',
            border: 'border-b-gray-300'
        },
        contents: {
            toggler_hover: 'hover:bg-gray-200',
            togller_color: 'text-gray-400',
            icon_color: 'text-gray-950',
            popover: {
                text: 'text-gray-900',
                option_hover: 'hover:bg-gray-200',
                option_active: 'bg-gray-300 text-gray-950',
                active_bg: 'bg-gray-200'
            }
        }
    },
    sectionCard: {
        bg: 'bg-stone-100',
        primary_text: 'text-[#1C2B33]',
        secondary_text: 'text-gray-600',
        border: 'border-gray-300',
        shadow: 'shadow-gray-300'
    },
    simpleSelect: {
        bg: 'bg-neutral-200',
        border: 'border-gray-400',
        hover: 'hover:bg-neutral-300',
        text: 'text-gray-800',
        icon_color: 'text-gray-500',
        shadow: 'shadow-gray-300',
        options_bg: 'bg-gray-100 border-gray-400',
        option_hover: 'hover:bg-gray-200',
        secondary_text: 'text-gray-600',
        selected_option: 'bg-blue-200'
    },
    switchBtn: {
        bg: 'bg-gray-200',
        border: 'border-gray-600',
        cursor_bg: 'bg-blue-800'
    },
    tooltip: {
        bg: 'bg-gray-800',
        text_color: 'text-white'
    },
    userPopup: {
        bg: 'bg-white',
        border: 'border-gray-300',
        text_secondary: 'text-gray-500',
        text_accent: 'text-blue-800',
        btn_hover: 'hover:bg-gray-100',
        text_primary: 'text-gray-900',
        separator_border: 'border-gray-200',
    },
    btnBorder: {
        border: 'border-gray-400',
        hover_bg: 'hover:bg-zinc-300',
        bg: 'bg-zinc-200',
        text: 'text-black',
        primary_bg: 'bg-sky-800',
        primary_hover: 'hover:bg-sky-900',
        primary_text: 'text-white'
    },
    charts: {
        chartFontColor: '#222222',
        chartGridline: '#7a7a7a',
        chartLegendColor: '#4e4e4e',
        borderBox: '#979797'
    },
    popupBtn: {
        primary_bg: 'bg-sky-800 outline-1 outline-sky-950',
        primary_hover: 'hover:bg-sky-800',
        primary_text: 'text-white',
        seconcondary_bg: 'bg-zinc-200',
        secondary_hover: 'hover:bg-zinc-300',
        secondary_text: 'text-black'
    }
}



export const dark: ThemeElements = {
    chartGridline: '#444444',
    chartFontColor: '#adadad',
    chartLegendColor: "#929292", 
    datePicker: {
        bg: 'bg-[#181B1F]',
        border: 'border-zinc-700',
        text: 'text-zinc-300',
        hover: 'hover:bg-zinc-700',
        selectedDay: 'bg-blue-600 text-white font-semibold',
        popupBg: 'bg-neutral-800',
        popupBorder: 'border-gray-700',
    }, 
    displayTogglerBtn: {
        active_border: 'border-b-sky-600',
        active_text: 'text-sky-600',
        border: 'border-gray-400',
        hover: 'hover:bg-zinc-700'
    },

    texts: {
        primary: 'text-gray-400',
        secondary: 'text-gray-600'
    },
    mainBg: 'bg-[#111217]',
    sidebar: {
        main: {
            background: 'bg-[#181B1F]',
            border: 'border-[#2E3136]',
            section_line: 'bg-zinc-700',
            toggler_side_bg: 'bg-zinc-700',
            toogler_hover: 'hover:bg-zinc-600',
            logos: 'bg-stone-300'
        },
        navs: {
            text: 'text-zinc-300',
            text_hover: 'hover:text-zinc-200',
            text_active: 'text-zinc-300',
            bg_active: 'bg-zinc-600',
            bg_hover: 'hover:bg-zinc-700',
            subnav_border: 'border-zinc-700',
            subnav_hover: 'hover:bg-zinc-700',
            subnav_text: 'text-zinc-500'
        }
    },
    topbar: {
        main: {
            bg: 'bg-[#181B1F]',
            border: 'border-zinc-700'
        },
        contents: {
            toggler_hover: 'hover:bg-zinc-700',
            togller_color: 'text-zinc-400',
            icon_color: 'text-gray-400',
            popover: {
                text: 'text-gray-200',
                option_hover: 'hover:bg-zinc-700',
                option_active: 'bg-zinc-800 text-gray-100',
                active_bg: 'bg-zinc-700'
            }
        }
    },
    sectionCard: {
        bg: 'bg-[#22252B]',
        primary_text: 'text-gray-300',
        secondary_text: 'text-[#CCCCDC]',
        border: 'border-[#373941]',
        shadow: '',
    },
    simpleSelect: {
        bg: 'bg-[#181B1F]',
        border: 'border-zinc-700',
        hover: 'hover:bg-zinc-700',
        text: 'text-zinc-300',
        icon_color: 'text-zinc-400',
        shadow: 'shadow-zinc-900',
        options_bg: 'bg-[#181B1F] border-zinc-500',
        option_hover: 'hover:bg-zinc-800',
        secondary_text: 'text-zinc-400',
        selected_option: 'bg-zinc-700'
    },
    switchBtn: {
        bg: 'bg-gray-400',
        border: 'border-gray-200',
        cursor_bg: 'bg-sky-900'
    },
    tooltip: {
        bg: 'bg-gray-900',
        text_color: 'text-gray-50'
    },
    userPopup: {
        bg: 'bg-zinc-700',
        border: 'border-zinc-500',
        text_secondary: 'text-gray-500',
        text_accent: 'text-blue-400',
        btn_hover: 'hover:bg-zinc-600', 
        text_primary: 'text-gray-300',
        separator_border: 'border-zinc-600',
    },
    btnBorder: {
        border: 'border-zinc-500',
        hover_bg: 'hover:bg-zinc-600',
        text: 'text-gray-300',
        bg: 'bg-zinc-700',
        primary_bg: 'bg-sky-800',
        primary_hover: 'hover:bg-sky-900',
        primary_text: 'text-white'
    },
    charts: {
        chartFontColor: '#b3b3b3',
        chartGridline: '#7a7a7a',
        chartLegendColor: '#b1b1b1',
        borderBox: '#424242'
    },
    popupBtn: {
        primary_bg: 'bg-sky-800 outline-1 outline-sky-950',
        primary_hover: 'hover:bg-sky-900',
        primary_text: 'text-white',
        seconcondary_bg: 'bg-zinc-700',
        secondary_hover: 'hover:bg-zinc-600',
        secondary_text: 'text-white'
    }
}