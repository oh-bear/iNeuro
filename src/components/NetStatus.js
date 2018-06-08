import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  NetInfo
} from 'react-native'
import PropTypes from 'prop-types'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import TextPingFang from './TextPingFang'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
} from '../common/styles'

export default class NetStatus extends Component {

  state = {
    isConnected: true
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      this.setState({ isConnected })
    })
  }


  render() {
    return (
      <View style={[
        styles.container,
        { display: !this.state.isConnected && this.props.showNetStatus ? 'flex' : 'none' },
      ]}>
        <TextPingFang style={styles.text_net}>似乎从网络断开了～</TextPingFang>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH - getResponsiveWidth(88),
    height: getResponsiveWidth(24),
    position: 'absolute',
    ...ifIphoneX({
      marginTop: 54
    }, {
      marginTop: 30
    }),
    borderRadius: getResponsiveWidth(12),
    backgroundColor: 'rgba(155,155,155,.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  text_net: {
    color: '#000',
    fontSize: 12
  }
})
