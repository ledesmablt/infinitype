interface Themes {
  [themeName: string]: ThemeColors;
}

interface ThemeColors {
  background: string;
  primaryText: string;
  secondaryText: string;
  errText: string;
  [propName: string]: string;
}

export function changeTheme(themeName: string): void {
  if (!(themeName in themes)) {
    // default
    themeName = 'dracula';
  }
  const currentTheme = themes[themeName];
  for (let key in currentTheme) {
    document.documentElement.style.setProperty(
      `--${key}`, currentTheme[key]
    )
  }
}

const themes: Themes = {
  dracula: {
    background: '#282a36',
    primaryText: '#bd93f9',
    secondaryText: '#44475a',
    errText: '#ff5555',
  },
}

export default themes;
