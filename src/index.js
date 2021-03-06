import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Default from 'react-router-dom'
import styled from 'styled-components'

const useLocation = Default.useLocation
    , useHistory = Default.useHistory
    , BrowserRouter = Default.BrowserRouter
    , HashRouter = Default.HashRouter
    , MemoryRouter = Default.MemoryRouter

window.appReactRouterDomAnimationLoadSite = false
const useLoad = () => {
  const [load, setLoad] = useState(false)
  const isLoad = window.appReactRouterDomAnimationLoadSite || load

  useEffect(() => {
    if (load) {
      window.appReactRouterDomAnimationLoadSite = true
    }
  }, [load])

  return [isLoad, setLoad]
}

const Body = styled(motion.div)`
  position: absolute;
`

const Link = (props) => {
  const location = useLocation()
  return (
    <Default.Link
      {...props}
      onClick={
        e => {
          if (props.to === location.pathname+location.search) {
            e.preventDefault()
          }
          window.appReactRouterDomAnimationAction = props.animate
          props.onClick && props.onClick(e)
        }
      }
    />
  )
}

const NavLink = (props) => {
  return (
    <Default.NavLink
      {...props}
      onClick={
        e => {
          window.appReactRouterDomAnimationAction = props.animate
          props.onClick && props.onClick(e)
        }
      }
    />
  )
}

const Redirect = (props) => {
  window.appReactRouterDomAnimationAction = props.animate

  return (
    <Default.Redirect {...props} />
  )
}

const Animation = (props) => {
  const location = useLocation()
  const isPrev = window.appReactRouterDomAnimationAction === 'prev'
  const newPath = location.pathname+location.search
  const oldPath = window.appReactRouterDomAnimationPathname
  const [isAnimation, setAnimation] = useState(false)

  return (
    <Body
      style={{ ...props.style }}
      initial={
        newPath !== oldPath
          ? isPrev
              ? props.initial.prev
              : props.initial.next
          : props.initial.default
      }
      animate={props.animate}
      exit={
        isPrev
          ? props.exit.next
          : props.exit.prev
      }
      transition={props.transition}
      onAnimationComplete={() => setAnimation(false)}
      onAnimationStart={() => setAnimation(true)}
    >
      {
        props.component && props.component(props.routeEvent, isAnimation)
      }
    </Body>
  )
}

const Route = (props) => {
  return (
    <Default.Route
      {...props}
      component={routeEvent => (<Animation {...props} routeEvent={routeEvent} />)}
    />
  )
}

const Switch = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    window.appReactRouterDomAnimationPathname = location.pathname+location.search
  }, [location.pathname])

  return (
    <AnimatePresence initial={false} onExitComplete={() => (window.appReactRouterDomAnimationPathname = location.pathname+location.search)}>
      <Default.Switch location={location} key={location.pathname}>
        {
          children
        }
      </Default.Switch>
    </AnimatePresence>
  )
}

export {
  BrowserRouter,
  HashRouter,
  MemoryRouter,
  Switch,
  Route,
  Link,
  NavLink,
  Redirect,
  useLocation,
  useHistory,
  useLoad
}
