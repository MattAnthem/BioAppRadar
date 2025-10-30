import type { ThemeElements } from "./types"

// bg-gradient-to-t from-blue-100 to-teal-50
// bg-gradient-to-b from-indigo-50 to-sky-50
// bg-gradient-to-b from-gray-50 to-gray-100
// bg-gradient-to-tl from-blue-50 to-sky-200

export const light: ThemeElements = {
    chartFontColor: '#424242',
    cards: {
        background: 'bg-gray-100',
        border: 'border-gray-500',
        element_hover: 'hover:bg-gray-200'
    },
    texts: {
        primary: 'text-gray-950',
        secondary: 'text-gray-500'
    },
    mainBg: 'bg-gray-50',
    sidebar: {
        main: {
            background: 'bg-stone-100',
            border: 'border-gray-300',
            section_line: 'bg-gray-300',
            toggler_side_bg: 'bg-gray-200',
            toogler_hover: 'hover:bg-gray-300'
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
            togller_color: 'text-gray-400'
        }
    },
    scattererCard: {
        bg: 'bg-gray-100',
        primary_text: 'text-gray-800',
        secondary_text: 'text-gray-500',
        border: 'border-gray-300',
        shadow: 'shadow-sm hover:shadow-lg transition-shadow',
        details_bg: 'bg-gray-800 text-white'
    },
    sectionCard: {
        bg: 'bg-neutral-200',
        primary_text: 'text-gray-800',
        secondary_text: 'text-gray-600',
        border: 'border-gray-300',
        shadow: 'shadow-gray-300'
    },
    simpleSelect: {
        bg: 'bg-neutral-200',
        border: 'border-gray-400',
        hover: 'hover:bg-neutral-300',
        text: 'text-gray-800',
        icon_color: 'text-gray-400',
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
        hover_bg: 'hover:bg-gray-200'
    },
    charts: {
        strokes: '#82ca9d',
        fill: '#82ca9d',
        ticks: 'gray'
    }
}


// bg-gradient-to-tl from-blue-900 to-sky-800
// bg-gradient-to-tl from-gray-800 to-slate-900

export const dark: ThemeElements = {
    chartFontColor: '#adadad',
    cards: {
        background: 'bg-zinc-700',
        border: 'border-zinc-500',
        element_hover: 'hover:bg-zinc-600 '
    },
    texts: {
        primary: 'text-gray-400',
        secondary: 'text-gray-600'
    },
    mainBg: 'bg-gradient-to-tl from-gray-800 to-zinc-800',
    sidebar: {
        main: {
            background: 'bg-zinc-800',
            border: 'border-zinc-700',
            section_line: 'bg-zinc-700',
            toggler_side_bg: 'bg-zinc-700',
            toogler_hover: 'hover:bg-zinc-600'
        },
        navs: {
            text: 'text-zinc-400',
            text_hover: 'hover:text-zinc-400',
            text_active: 'text-zinc-400',
            bg_active: 'bg-zinc-600',
            bg_hover: 'hover:bg-zinc-700',
            subnav_border: 'border-zinc-700',
            subnav_hover: 'hover:bg-zinc-700',
            subnav_text: 'text-zinc-500'
        }
    },
    topbar: {
        main: {
            bg: 'bg-zinc-800',
            border: 'border-zinc-700'
        },
        contents: {
            toggler_hover: 'hover:bg-zinc-700',
            togller_color: 'text-zinc-400'
        }
    },
    scattererCard: {
        bg: 'bg-zinc-700',
        primary_text: 'text-zinc-300',
        secondary_text: 'text-zinc-400',
        border: 'border-zinc-600',
        shadow: 'shadow-sm shadow-zinc-950 hover:shadow-lg transition-shadow',
        details_bg: 'bg-zinc-800 text-white'
    },
    sectionCard: {
        bg: 'bg-zinc-700',
        primary_text: 'text-zinc-300',
        secondary_text: 'text-zinc-400',
        border: 'border-zinc-500',
        shadow: 'shadow-slate-700',
    },
    simpleSelect: {
        bg: 'bg-zinc-700',
        border: 'border-zinc-500',
        hover: 'hover:bg-zinc-600',
        text: 'text-zinc-300',
        icon_color: 'text-zinc-400',
        shadow: 'shadow-zinc-900',
        options_bg: 'bg-zinc-600 border-zinc-500',
        option_hover: 'hover:bg-zinc-500',
        secondary_text: 'text-zinc-400',
        selected_option: 'bg-zinc-500'
    },
    switchBtn: {
        bg: 'bg-gray-400',
        border: 'border-gray-200',
        cursor_bg: 'bg-sky-900'
    },
    tooltip: {
        bg: 'bg-gray-600',
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
        text: 'text-gray-300'
    },
    charts: {
        strokes: '#41962e',
        fill: '#72966a',
        ticks: '#b3b3b3'
    }
}