import styled from "styled-components"
import React, { useCallback, useEffect, useRef, useState } from "react"
const TOC = styled.nav`
  position: sticky;
  position: -webkit-sticky; /* For Safari */
  top: 24px; /* How far down the page you want your ToC to live */

  /* Give table of contents a scrollbar */
  max-height: calc(100vh - 40px);
  overflow: auto;
`
/**
 * This renders an item in the table of contents list.
 * scrollIntoView is used to ensure that when a user clicks on an item, it will smoothly scroll.
 */
const Headings = ({ headings, activeId }) => (
  <ul>
    {headings.map(heading => (
      <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
        <a
          href={`#${heading.id}`}
          onClick={e => {
            e.preventDefault()
            document.querySelector(`#${heading.id}`).scrollIntoView({
              behavior: "smooth",
            })
          }}
        >
          {heading.title}
        </a>
        {heading.items.length > 0 && (
          <ul>
            {heading.items.map(child => (
              <li
                key={child.id}
                className={child.id === activeId ? "active" : ""}
              >
                <a
                  href={`#${child.id}`}
                  onClick={e => {
                    e.preventDefault()
                    document.querySelector(`#${child.id}`).scrollIntoView({
                      behavior: "smooth",
                    })
                  }}
                >
                  {child.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
)

/**
 * Dynamically generates the table of contents list, using any H2s and H3s it can find in the main text
 */
const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = React.useState([])
  const [headings, setHeadings] = useState([])
  React.useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll("h2, h3"))
    setHeadings(headingElements.map(heading => heading.id))

    // Created a list of headings, with H3s nested
    const newNestedHeadings = getNestedHeadings(headingElements)

    setNestedHeadings(newNestedHeadings)
  }, [])

  const getIndex = useCallback(
    id => {
      if (headings.length === 0) return undefined
      return headings.findIndex(heading => heading === id)
    },
    [headings]
  )

  return { getIndex, nestedHeadings }
}

const getNestedHeadings = headingElements => {
  const nestedHeadings = []
  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading
    const headNumber = Number(heading.nodeName[1])
    if (headNumber === 2) {
      nestedHeadings.push({ index, title, items: [] })
    } else if (headNumber === 3 && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        index,
        title,
      })
    }
  })

  return { nestedHeadings }
}

const useIntersectionObserver = (getIndex, setActiveId) => {
  const headingElementsRef = React.useRef({})
  React.useEffect(() => {
    //현재페이지에서 헤드 elementsRef를 다 맵핑
    const callback = headings => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement
        return map
      }, headingElementsRef.current)

      //get all heads on current pag
      const visibleHeadings = []
      Object.keys(headingElementsRef.current).forEach(key => {
        const headingElement = headingElementsRef.current[key]
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement)
      })

      // If there is only one visible heading, this is our "active" heading
      if (visibleHeadings.length === 1) {
        setActiveId(getIndex(visibleHeadings[0].target.id))
        // If there is more than one visible heading,
        // choose the one that is closest to the top of the page
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndex(a.target.id) > getIndex(b.target.id)
        )
        setActiveId(getIndex(sortedVisibleHeadings[0].target.id))
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -40% 0px",
    })
    const headingElements = Array.from(document.querySelectorAll("h2, h3"))
    headingElements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [getIndex, setActiveId])
}

const TableOfContents = () => {
  const [activeId, setActiveId] = useState(-1)
  const { getIndex, nestedHeadings } = useHeadingsData()
  useIntersectionObserver(getIndex, setActiveId)
  return (
    <div aria-label="Table of contents">
      Table ouf Contents{" "}
      <Headings
        headings={nestedHeadings > 0 ? nestedHeadings : null}
        activeId={activeId}
      />
    </div>
  )
}

export default TableOfContents
