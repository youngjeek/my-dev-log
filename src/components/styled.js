import styled, { css } from "styled-components"

const MIN_CONTENT_WIDTH = 700
const CONTENT_WIDTH = 800

const MIN_SIDEBAR_WIDTH = 300
const SIDEBAR_WIDTH = 400

const SIDEBAR_BREAKPOINT = MIN_CONTENT_WIDTH + MIN_SIDEBAR_WIDTH

const containerStyles = css`
  margin: 0 auto;
  padding: 0 16px;
  margin-bottom: 16px;
`

export const ContainerWithSidebar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  max-width: ${CONTENT_WIDTH + SIDEBAR_WIDTH + 16}px;
  ${containerStyles};
`

export const Container = styled.div`
  max-width: ${CONTENT_WIDTH}px;
  ${containerStyles};
  position: relative;
  @media only screen and (max-width: 400px) {
    padding: 0 8px;
  }
`

export const MainContent = styled.div`
  max-width: ${CONTENT_WIDTH}px;
  min-width: 0;
  @media only screen and (max-width: ${SIDEBAR_BREAKPOINT}px) {
    ${containerStyles};
  }
`

export const SquareContainer = styled.div`
  box-sizing: border-box;
  background-color: "#ffffff";
  border-radius: 4px;
`

export const TextContainer = styled.div`
  padding: 16px;
`

export const StickyHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: "#ffffff";
`
