export type theme = "light" | "dark";

export interface ThemeElements {
    mainBg: string;
    sidebar: SidebarTheme;
    topbar: TopbarTheme;
    scattererCard: ScattererCardTheme;
    sectionCard: SectionCardTheme;
    simpleSelect: SelectTheme;
    switchBtn : SwitchBtnTheme;
    tooltip: TooltipTheme;
    userPopup: PopupTheme;
    btnBorder: BtnBorderTheme;
    charts: ChartsTheme;
    cards: cards;
    texts: Texts;
}


type Texts = {
    primary: string;
    secondary: string;
}

type cards = {
    background: string;
    border: string;
    element_hover?: string;
}


// ---------------------- Sidebar ------------
type SidebarMain = {
    background: string;
    border: string;
    section_line: string;
    toggler_side_bg: string;
    toogler_hover: string;
}

type SidebarNavs = {
    text: string;
    text_hover: string;
    text_active: string;
    bg_active: string;
    bg_hover: string;
    subnav_border: string;
    subnav_hover: string;
    subnav_text: string;
}

type SidebarTheme = {
    main: SidebarMain;
    navs: SidebarNavs;
}

// -------------------------- Top bar --------------
type TopbarMain = {
    bg: string;
    border: string;
}

type TopbarContents = {
    toggler_hover: string;
    togller_color: string;
}

type TopbarTheme = {
    main: TopbarMain;
    contents: TopbarContents;
}

// ------------------------ Main pages -----------------

//  ----------------------- Sections ---------------
type SectionCardTheme = {
    bg: string;
    primary_text: string;
    secondary_text?: string;
    border: string;
    shadow: string;
}


// ---------------- Components -----------------------

    // +++++++++++++++ Scatterers card +++++++++++++++
    type ScattererCardTheme = {
        bg: string;
        primary_text: string;
        secondary_text: string;
        border: string;
        shadow: string;
        details_bg: string;
    }

    // ++++++++++++++++++++ Simple Select ++++++++
    type SelectTheme = {
        bg: string;
        border: string;
        text: string;
        secondary_text?: string;
        hover: string;
        icon_color: string;
        shadow: string;
        options_bg: string;
        option_hover: string;
        selected_option: string;
    }

    // +++++++++++++++++++ Switch btn ++++++++++++++
    type SwitchBtnTheme = {
        bg: string;
        border: string;
        cursor_bg: string;
    }

    // ++++++++++++++++++ Tooltip +++++++++++++++
    type TooltipTheme = {
        bg: string;
        text_color: string;
    }

    // +++++++++++++++++ Popups ++++++++++++++++++
    type PopupTheme = {
        bg: string;
        border: string,
        text_accent?: string;
        text_primary?: string;
        text_secondary?: string;
        option_hover?: string;
        btn_hover?: string;
        separator_border?: string;
    }

    type BtnBorderTheme = {
        border: string;
        hover_bg: string;
        text?: string;
    }

    type ChartsTheme = {
        ticks: string;
        strokes: string;
        fill: string;
    }