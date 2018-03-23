import React, { Component } from 'react'
import Login from './containers/Login'
import Home from './containers/Home'
import Profile from './containers/Profile'
import Learn from './containers/Learn'
import Review from './containers/Review'
import Library from './containers/Library'
import Search from './containers/Search'
import Structure from './containers/Structure'
import Detail from './containers/Detail'

import { Scene, Router, ActionConst } from 'react-native-router-flux'
import * as scenes from './constants/scene'
import SplashScreen from './SplashScreen'
import { Provider } from 'react-redux'
import store from './redux/store'

export default class AppRouter extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root">
            <Scene
              key={scenes.SCENE_SPLASH_SCREEN}
              component={SplashScreen}
              initial
              type={ActionConst.RESET}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_LOGIN}
              component={Login}
              title="登录"
              type={ActionConst.RESET}
              duration={0}
              hideNavBar
            />
            <Scene
              key={scenes.SCENE_HOME}
              component={Home}
              type={ActionConst.RESET}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_PROFILE}
              component={Profile}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_LEARN}
              component={Learn}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_REVIEW}
              component={Review}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_SEARCH}
              component={Search}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_LIBRARY}
              component={Library}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_STRUCTURE}
              component={Structure}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
            <Scene
              key={scenes.SCENE_DETAIL}
              component={Detail}
              type={ActionConst.REPLACE}
              hideNavBar
              duration={0}
            />
          </Scene>
        </Router>
      </Provider>
    )
  }
}
