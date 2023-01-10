import * as React from "react"
import { Link } from "gatsby"
import { StickyHeader } from "./styled"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/my-dev-log`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <StickyHeader>
        <h1 className="main-heading">
          <Link to="/my-dev-log">{title}</Link>
        </h1>
      </StickyHeader>
    )
  } else {
    header = (
      <StickyHeader>
        <Link className="header-link-home" to="/my-dev-log">
          {title}
        </Link>
      </StickyHeader>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Customized by YJ, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
