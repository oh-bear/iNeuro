import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text
} from 'react-native'
import { WIDTH, getResponsiveWidth } from '../common/styles'
import TextPingFang from './TextPingFang'

const NAVBAR_HEIGHT = 44
const STATUS_BAR_HEIGHT = 20

export default class Navigator extends Component {

  static defaultProps = {
    statusBar: {
      hidden: false
    }
  }

  state = {
    title: '',
    hide: false
  }

  statusBar() {
    return (
      <View style={styles.statusBar}>
        <StatusBar
          {...this.props.statusBar}
          barStyle={'dark-content'}
        />
      </View>
    )
  }

  render() {
    let titleView = this.props.titleView
      ? this.props.titleView
      : <TextPingFang style={styles.title}>
        {this.props.title}
      </TextPingFang>
    let content = (
      <View style={[styles.navBar, this.props.navBarStyle]}>
        <TouchableOpacity
          style={[styles.navBarLeftImgContainer, this.props.navLeftStyle]}
          onPress={this.props.leftBtnImgOnPress}
        >
          {this.props.leftBtnImg ? this.props.leftBtnImg : (<View style={styles.navBarBtnFade}/>)}
        </TouchableOpacity>

        <View style={[styles.titleViewContainer, this.props.titleStyle]}>
          {titleView}
        </View>

        <TouchableOpacity
          style={[styles.navBarRightImgContainer, this.props.navRightStyle]}
          onPress={this.props.rightBtnImgOnPress}
        >
          {this.props.rightBtnImg ? this.props.rightBtnImg : (<View style={styles.navBarBtnFade}/>)}
        </TouchableOpacity>
      </View>
    )
    return (
      <View style={[styles.container, this.props.navStyle]}>
        {this.statusBar()}
        {content}
      </View>
    )
  }
}

const navMarginLR = 16

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navBar: {
    alignItems: 'center',
    height: NAVBAR_HEIGHT,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: WIDTH,
    justifyContent: 'space-between'
  },
  navBarLeftImgContainer: {
    width: getResponsiveWidth(22),
    marginLeft: navMarginLR
  },
  navBarRightImgContainer: {
    width: getResponsiveWidth(22),
    marginRight: navMarginLR,
  },
  navBarBtnFade: {
    width: getResponsiveWidth(22)
  },
  title: {
    fontSize: 34,
    color: '#444',
    fontWeight: 'bold'
  },
  statusBar: {
    height: 0
  },
  androidStatusBar: {
    height: 0
  }
})
