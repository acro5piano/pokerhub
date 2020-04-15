import styled from 'styled-components/native'
import BackgroundImage from '../../assets/poker-background.jpg'

export const AppContainer = styled.View`
  padding: 16px;
  height: 100%;
  justify-content: space-between;
  background-image: url(${BackgroundImage});
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: top;
  background-size: cover;
`
