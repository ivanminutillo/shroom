import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

export interface ShroomThemeInterface {
  color: {
    p100: string,
    p150: string,
    p200: string,
    p300: string,
    p500: string,
    p600: string,
    p700: string,
    p800: string,
    p900: string,
    b100: string,
    b200: string,
    g100: string
  },
  fontSize: {
    h1: string,
    h2: string,
    h3: string,
    h4: string,
    h5: string,
    p: string
  },
  avatar: {
    size: string,
    radius: string,
    mini: string
  }
}

// Shroom theme interface, defines the shape of a theme definition
// export interface ThemeInterface {
//   theme: ShroomThemeInterface;
// }

export interface StyledThemeInterface {
  theme: ShroomThemeInterface;
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
  withTheme
} = styledComponents as ThemedStyledComponentsModule<ShroomThemeInterface>;

export { css, createGlobalStyle, keyframes, ThemeProvider, withTheme };

export default styled;
