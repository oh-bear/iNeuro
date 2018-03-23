import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native'
import { HEIGHT, WIDTH, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import { connect } from 'react-redux'
import * as scenes from '../constants/scene'
import { Actions } from 'react-native-router-flux'

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
          <TouchableOpacity
            style={styles.face}
            onPress={() => {
              Actions.jump(scenes.SCENE_PROFILE)
            }}>
            <Image style={styles.face_img} source={{ uri: this.props.user.face }}/>
          </TouchableOpacity>
          <Text style={styles.name}>{this.props.user.name}</Text>
        </View>
        <TouchableOpacity onPress={() => {
          Actions.jump(scenes.SCENE_LEARN)
        }}>
          <ImageBackground
            source={require('../../res/images/home/board.png')}
            style={styles.board1}>
            <Text style={styles.board_title}>LEARN</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          Actions.jump(scenes.SCENE_REVIEW)
        }}>
          <ImageBackground
            source={require('../../res/images/home/board.png')}
            style={styles.board2}>
            <Text style={styles.board_title}>REVIEW</Text>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.btn_bar}>
          <TouchableOpacity
            style={styles.left_btn}
            onPress={() => {
              Actions.jump(scenes.SCENE_LIBRARY)
            }}>
            <Image source={require('../../res/images/home/left_btn.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.right_btn}
            onPress={() => {
              Actions.jump(scenes.SCENE_SEARCH)
            }}>
            <Image source={require('../../res/images/home/right_btn.png')}/>
          </TouchableOpacity>
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
    left: getResponsiveWidth(-120),
    width: 43,
    height: 43,
    borderRadius: 21.5
  },
  face_img: {
    left: 0,
    width: 43,
    height: 43,
    borderRadius: 21.5
  },
  name: {
    left: getResponsiveWidth(-105),
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
    justifyContent: 'space-between',
    marginTop: getResponsiveHeight(92),
    width: WIDTH
  },
  left_btn: {
    marginLeft: 0
  },
  right_btn: {
    marginRight: 0
  }
})
