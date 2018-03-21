import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image
} from 'react-native'
import { HEIGHT, WIDTH, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Home extends Component {

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.face} source={{uri: this.props.user.face}}/>
          <Text style={styles.name}>{this.props.user.name}</Text>
        </View>
        <ImageBackground source={require('../../res/images/home/board.png')} style={styles.board1}>
          <Text style={styles.board_title}>LEARN</Text>
        </ImageBackground>
        <ImageBackground source={require('../../res/images/home/board.png')} style={styles.board2}>
          <Text style={styles.board_title}>REVIEW</Text>
        </ImageBackground>

        <View style={styles.btn_bar}>
          <Image style={styles.left_btn} source={require('../../res/images/home/left_btn.png')}/>
          <Image style={styles.right_btn} source={require('../../res/images/home/right_btn.png')}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    height: HEIGHT
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getResponsiveHeight(36)
  },
  face: {
    left: -120,
    width: 43,
    height: 43,
    borderRadius: 21.5
  },
  name: {
    left: -105,
    fontSize: 14
  },
  board1: {
    width: getResponsiveWidth(160),
    height: getResponsiveHeight(136),
    marginTop: getResponsiveHeight(124)
  },
  board2: {
    width: getResponsiveWidth(160),
    height: getResponsiveHeight(136),
    marginTop: getResponsiveHeight(20)
  },
  board_title: {
    fontSize: 24,
    marginTop: getResponsiveHeight(50),
    marginLeft: getResponsiveWidth(40)
  },
  btn_bar: {
    flexDirection: 'row',
    marginTop: getResponsiveHeight(92),
    width: WIDTH
  },
  left_btn: {
    flex: 1,
  },
  right_btn: {
    flex: 1,
  }
})
