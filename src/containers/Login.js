import React, { Component } from 'react'
import {
  View,
  StatusBar,
  StyleSheet,
  ImageBackground,
  TextInput,
} from 'react-native'
import TextPingFang from '../components/TextPingFang'
import {
  WIDTH,
  HEIGHT,
  getResponsiveHeight,
  getResponsiveWidth
} from '../common/styles'
import { Button, Toast } from 'antd-mobile'
import Storage from '../common/storage'
import loading from '../common/loading'
import { SCENE_HOME } from '../constants/scene'
import { Actions } from 'react-native-router-flux'
import { USERS } from '../network/Urls'
import { setToken } from '../network/HttpUtils'
import HttpUtils from '../network/HttpUtils'
import store from '../redux/store'
import { fetchProfileSuccess } from '../redux/modules/user'
import initApp from '../redux/modules/init'

import SegmentedControl from '../components/SegmentedControl'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class Login extends Component {

  state = { account: '', password: '', name: '', confirmPwd: '', selectedIndex: 1 }

  componentDidMount() {
    reLoginInterval = setInterval(async () => {
      const user = await Storage.get('user', {})
      if (!user.account || !user.password) {
        return
      }

      try {
        onSubmit()
      } catch (e) {
        console.log(e)
      }
    }, 3600 * 1000)
  }

  onItemSelected(index) {
    this.setState({ selectedIndex: index })
  }

  onSubmit = async () => {

    const { account, password } = this.state
    const reg = /^((1[3-8][0-9])+\d{8})$/

    if (!reg.test(account)) {
      Toast.fail('请填写正确的手机号')
      return
    }

    if (password.length < 6) {
      Toast.fail('密码格式错误')
      return
    }

    Toast.loading('登录中', 0, null, false)

    HttpUtils.post(USERS.login, {
      account,
      password
    }).then(res => {
      Toast.hide()
      if (res.code === 0) {
        Storage.set('user', { ...this.state })

        const { uid, token, timestamp } = res.data.key
        setToken({ uid, token, timestamp })

        store.dispatch(fetchProfileSuccess(res.data.user))
        store.dispatch(initApp())

        Actions.reset(SCENE_HOME, { user: res.data.user })
      } else {
        Toast.fail(res.message)
      }
    })
  }

  onSubmitRegister = async () => {

    const { account, password, name, confirmPwd } = this.state
    const reg = /^((1[3-8][0-9])+\d{8})$/
    if (!reg.test(account)) {
      Toast.fail('请填写正确的手机号')
      return
    }

    if (password.length < 6) {
      Toast.fail('密码格式错误')
      return
    }

    if (password !== confirmPwd) {
      Toast.fail('两次密码输入不一致')
      return
    }

    Toast.loading('注册中', 0, null, false)

    HttpUtils.post(URL.register, {
      account,
      password,
      name
    }).then(res => {
      Toast.hide()
      if (res.code === 0) {
        Storage.set('user', { ...this.state })

        // 注册成功后直接登录
        HttpUtils.post(URL, {
          account,
          password
        }).then(res => {
          Toast.hide()
          if (res.code === 0) {
            Storage.set('user', { ...this.state })

            const { uid, token, timestamp } = res.data.key
            setToken({ uid, token, timestamp })

            store.dispatch(fetchProfileSuccess(res.data.user))
            store.dispatch(initApp())

            Actions.reset(SCENE_HOME, { user: res.data.user })
          } else {
            Toast.fail(res.message)
          }
        })
      } else {
        Toast.fail(res.message)
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true}
          hidden={false}
          backgroundColor={'green'}
          translucent={true}
          barStyle={'light-content'}
        >
        </StatusBar>
        <ImageBackground
          style={styles.bg}
          source={
            this.state.selectedIndex === 1
              ? require('../../res/images/bg_sign.png')
              : require('../../res/images/bg_reg.png')}>
          <KeyboardAwareScrollView
            style={styles.scview}
            extraScrollHeight={40}
            scrollEnabled={false}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <View
              style={
                [styles.card, { marginTop: this.state.selectedIndex === 1 ? getResponsiveHeight(180) : getResponsiveHeight(150), }]}>
              <SegmentedControl
                style={styles.segcontrol}
                defaultPage={1}
                itemButtonViewStyle={styles.itemButtonViewStyle}
                itemHeaderViewStyle={styles.itemHeaderViewStyle}
                onItemSelected={this.onItemSelected.bind(this)}
                ref={e => this.SegmentedControl = e}
              >
                <SegmentedControl.Item
                  title={'SIGN UP'}
                >
                  <View style={styles.input_container}>
                    <TextInput
                      placeholder={'手机号码'}
                      placeholderTextColor={'rgba(0,0,0,0.52)'}
                      style={styles.text_input}
                      onChangeText={text => {
                        this.setState({ account: text })
                      }}
                      defaultValue={this.state.account}/>
                    <TextInput
                      placeholder={'用户名'}
                      placeholderTextColor={'rgba(0,0,0,0.52)'}
                      style={styles.text_input}
                      onChangeText={text => {
                        this.setState({ name: text })
                      }}/>
                    <TextInput
                      placeholder={'您的密码'}
                      placeholderTextColor={'rgba(0,0,0,0.52)'}
                      style={styles.text_input}
                      onChangeText={text => {
                        this.setState({ password: text })
                      }}
                      password={true}
                      secureTextEntry/>
                    <TextInput
                      placeholder={'确认密码'}
                      placeholderTextColor={'rgba(0,0,0,0.52)'}
                      style={styles.text_input}
                      onChangeText={text => {
                        this.setState({ confirmPwd: text })
                      }}
                      password={true}
                      secureTextEntry/>
                    <Button
                      type="primary"
                      style={styles.btn}
                      onClick={this.onSubmitRegister}>
                      注册
                    </Button>
                  </View>
                </SegmentedControl.Item>
                <SegmentedControl.Item
                  title={'SIGN IN'}
                >
                  <View style={styles.input_container}>
                    <TextInput
                      placeholder={'手机号码'}
                      placeholderTextColor={'rgba(0,0,0,0.52)'}
                      style={styles.text_input}
                      onChangeText={text => {
                        this.setState({ account: text })
                      }}
                      defaultValue={this.state.account}/>
                    <TextInput
                      placeholder={'您的密码'}
                      placeholderTextColor={'rgba(0,0,0,0.52)'}
                      style={styles.text_input}
                      onChangeText={text => {
                        this.setState({ password: text })
                      }}
                      defaultValue={this.state.password}
                      password={true}
                      secureTextEntry/>
                    <Button
                      type="primary"
                      style={styles.btn}
                      onClick={this.onSubmit}>
                      登录
                    </Button>
                  </View>
                </SegmentedControl.Item>
              </SegmentedControl>
            </View>
          </KeyboardAwareScrollView>
        </ImageBackground>
        <TextPingFang style={styles.license}>确认登录代表您已经默认同意相关协议条款</TextPingFang>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: WIDTH,
    height: HEIGHT,
    alignItems: 'center'
  },
  bg: {
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT
  },
  scview: {
    width: '100%',
    height: '100%'
  },
  segcontrol: {
    height: '100%',
    width: '100%'
  },
  itemButtonViewStyle: {},
  itemHeaderViewStyle: {
    height: 50,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  card: {
    width: '100%',
    height: HEIGHT - getResponsiveHeight(180),
    marginTop: getResponsiveHeight(180),
    alignItems: 'center',
    flexDirection: 'column'
  },
  license: {
    position: 'absolute',
    height: getResponsiveHeight(11),
    lineHeight: getResponsiveHeight(11),
    bottom: getResponsiveHeight(21),
    fontSize: 8,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.65
  },
  input_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text_input: {
    height: getResponsiveHeight(44),
    width: getResponsiveWidth(280),
    backgroundColor: 'rgb(255,255,255)',
    marginTop: getResponsiveHeight(12),
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    fontSize: 14,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#d9d9d9',
    textAlign: 'center',
  },
  btn: {
    marginTop: getResponsiveHeight(40),
    borderRadius: 30,
    backgroundColor: '#3b599a',
    width: '60%'
  }
})
