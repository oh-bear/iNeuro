import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet
} from 'react-native'
import NavigationBar from './NavigationBar'
import { Actions } from 'react-native-router-flux'
import { WIDTH, HEIGHT, getResponsiveHeight, getResponsiveWidth } from '../common/styles'

export default class CommonNav extends Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    title: '首页',
    rightButton: <View />
  }

  render() {
    return (
      <View>
        <NavigationBar
          navBarStyle={styles.navBarStyle}
          navStyle={this.props.navStyle}
          title={this.props.title}
          titleStyle={styles.titleStyle}
          leftBtnImg={
            <Image style={styles.navLeftImg} source={require('../../res/images/navigation/icon_back_def.png')}/>
          }
          leftBtnImgOnPress={this.props.back ? this.props.back : () => Actions.pop()}
          navLeftStyle={this.props.navLeftStyle}
          rightBtnImg={this.props.rightBtnImg}
          rightBtnImgOnPress={this.props.rightBtnImgOnPress}
          navRightStyle={this.props.navRightStyle}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navBarStyle: {
    width: WIDTH,
    height: 116
  },
  navLeftImg: {
    width: 25,
    height: 25,
    marginRight: 16
  },
  titleStyle: {
    marginLeft: -80,
    top: 35
  }
})
