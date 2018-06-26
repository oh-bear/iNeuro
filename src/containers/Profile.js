import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Toast } from 'antd-mobile'

import ImagePicker from 'react-native-image-picker'

import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'
import ProfileHeader from '../components/ProfileHeader'

import store from '../redux/store'
import { fetchProfileSuccess } from '../redux/modules/user'
import { connect } from 'react-redux'

import {
  getResponsiveWidth,
} from '../common/styles'
import Storage from '../common/storage'
import { SCENE_LOGIN } from '../constants/scene'

import HttpUtils from '../network/HttpUtils'
import { USERS } from '../network/Urls'

import { postImgToQiniu } from '../common/util'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Profile extends Component {

  state = {
    user: {},
    name: ''
  }

  componentDidMount() {
    this.setState({ user: this.props.user, name: this.props.user.name })
  }

  async seleceFace() {
    const options = {
      title: '',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍摄',
      chooseFromLibraryButtonTitle: '从相册选择',
      cameraType: 'back',
      mediaType: 'photo',
      maxWidth: 375,
      maxHeight: 282,
      quality: 1,
      allowsEditing: true,
      storageOptions: {
        skipBackup: true,
        cameraRoll: true,
        waitUntilSaved: true
      }
    }
    ImagePicker.showImagePicker(options, async res => {
      if (!res.didCancel) {
        const base64 = res.data
        const images = await postImgToQiniu([base64], { type: 'profile', user_id: this.state.user.id })
        this.setState({ user: Object.assign({}, this.state.user, { face: images }) }, () => {
          this.updateUser()
        })
      }
    })
  }

  async updateUser() {
    const data = {
      account: this.props.user.account,
      name: this.state.name,
      face: this.state.user.face
    }

    try {
      const res = await HttpUtils.post(USERS.update, data)
      if (res.code === 0) {
        store.dispatch(fetchProfileSuccess(res.data))
        Toast.success('修改成功')
      }
    } catch (e) {
      Toast.fail('出错了，等会再试试')
    }
  }

  _logout() {
    Alert.alert('确定要退出登录吗?', '', [
      {
        text: '取消'
      },
      {
        text: '确定',
        onPress: async () => {
          await Storage.remove('user')
          Actions.reset(SCENE_LOGIN)
        }
      }
    ])
  }

  render() {
    return (
      <Container>
        <View>
          <ProfileHeader title='Profile' />

          <ScrollView scrollEnabled={true} contentContainerStyle={styles.main_container}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                this.seleceFace()
              }}
            >
              <TextPingFang style={styles.text_row_left}>Face</TextPingFang>
              <Image style={styles.row_face} source={{ uri: this.state.user.face }} />
              <Image style={styles.row_indicator} source={require('../../res/images/common/icon_indicator.png')} />
            </TouchableOpacity>

            <View
              style={styles.row}
            >
              <TextPingFang style={styles.text_row_left}>Nickname</TextPingFang>
              <TextInput
                ref={ref => this.name_ipt = ref}
                style={styles.text_row_right}
                value={this.state.user.name}
                maxLength={48}
                returnKeyType='done'
                enablesReturnKeyAutomatically
                onChangeText={name => this.setState({ name })}
                onSubmitEditing={() => this.updateUser()}
              />
              <TouchableOpacity
                style={styles.row_indicator}
                onPress={() => this.name_ipt.focus()}
              >
                <Image source={require('../../res/images/profile/icon_edit.png')} />
              </TouchableOpacity>
            </View>

          </ScrollView>

          <TouchableOpacity style={styles.btn} onPress={() => this._logout()}>
            <TextPingFang style={styles.text_btn}>Log out</TextPingFang>
          </TouchableOpacity>
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
  },
  row: {
    height: getResponsiveWidth(64),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  text_row_left: {
    color: '#000',
    fontSize: 16,
    fontWeight: '300'
  },
  text_row_right: {
    width: 200,
    position: 'absolute',
    left: getResponsiveWidth(60),
    marginLeft: getResponsiveWidth(16),
    color: '#000',
    fontSize: 20,
    fontWeight: '300',
  },
  row_face: {
    width: getResponsiveWidth(48),
    height: getResponsiveWidth(48),
    marginLeft: getResponsiveWidth(16),
    borderRadius: getResponsiveWidth(24)
  },
  row_indicator: {
    position: 'absolute',
    right: 0
  },
  badge: {
    marginTop: getResponsiveWidth(56)
  },
  text_badge_title: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold'
  },
  text_badge_content: {
    marginTop: getResponsiveWidth(16),
    color: '#000',
    fontSize: 16
  },
  btn: {
    position: 'absolute',
    left: getResponsiveWidth(24),
    bottom: getResponsiveWidth(80),
    height: getResponsiveWidth(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_btn: {
    color: '#f00',
    fontSize: 20,
    fontWeight: '300'
  }
})
