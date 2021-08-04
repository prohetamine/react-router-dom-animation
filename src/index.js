import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Default from 'react-router-dom'
import styled from 'styled-components'

const useLocation = Default.useLocation
    , useHistory = Default.useHistory
    , BrowserRouter = Default.BrowserRouter

const Body = styled(motion.div)`
  position: absolute;
`

const Link = (props) => {
  return (
    <Default.Link
      {...props}
      onClick={
        (e) => {
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
    >
      {
        props.component && props.component(props.routeEvent, {
          initial: newPath !== oldPath
                    ? isPrev
                        ? props.initial.prev.forChildren
                        : props.initial.next.forChildren
                    : props.initial.default.forChildren,
          animate: props.animate.forChildren,
          exit: isPrev
                    ? props.exit.next.forChildren
                    : props.exit.prev.forChildren,
          transition: props.transition.forChildren
        })
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
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
  useHistory,
}
