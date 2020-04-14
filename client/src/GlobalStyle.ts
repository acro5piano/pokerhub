import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Forum', 'Roboto', 'ヒラギノ角ゴ Pro', 'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
  }
  * {
    font-family: 'Forum';
  }

  .playingCards .card .rank {
    font-family: Forum !important;
  }

  .playingCards .card {
    background: linear-gradient(45deg, rgba(139,136,181,1) 0%, rgba(231,231,236,1) 25%, rgba(255,255,255,1) 52%);
  }

  .playingCards .rank-j,
  .playingCards .rank-q,
  .playingCards .rank-k {
    background: #fff;
  }

  body,h1,h2,h3,h4,h5,h6,p,div {
    font-size: 14px;
    font-weight: normal;
    color: #fff;
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
