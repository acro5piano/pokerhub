import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
  }
  body,h1,h2,h3,h4,h5,h6,p,div {
    font-size: 14px;
    font-weight: normal;
    color: #fff;
  }
  * {
    line-height: 1.67;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
  }
  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: local('Material Icons'), local('MaterialIcons-Regular');
  }
  *:focus {
    outline: none;
  }
  a, a:visited {
    text-decoration: none;
    color: inherit;
  }
  textarea {
    line-height: 1.6 !important;
    font-size: 16px !important;
  }
`
