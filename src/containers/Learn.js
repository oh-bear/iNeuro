import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal
} from 'react-native'

import ImageViewer from 'react-native-image-zoom-viewer'

import { WIDTH, HEIGHT, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import { Actions } from 'react-native-router-flux'
import { LEARN } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'
import { connect } from 'react-redux'
import ProfileHeader from '../components/ProfileHeader'
import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'
import storage from '../common/storage'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Learn extends Component {

  state = {
    datas: [],
    data: { name: '', url: '' },
    options: ['A', 'B', 'C', 'D'],
    height: HEIGHT,
    visible: 0, // 1 right, 2 wrong
    index: 0,
    mounted: false,
    modalVisible: false,
    images: []
  }

  async componentWillMount() {
    const idx_data = await storage.get('index', { data: 0 })
    let index = idx_data.data
    const datas = await storage.get('learn_data')
    this.setState({
      datas,
      index,
      mounted: true,
      images: [
        {
          url: datas[index].url + '-375width.jpg',
          freeHeight: true
        }
      ]
    })
  }

  async componentWillUnmount() {
    this.setState({
      mounted: false
    })
    await storage.set('index', { data: this.state.index })
  }

  next = () => {
    let index = this.state.index
    Image.getSize((this.state.datas[index + 1].url + '-375width.jpg'), (width, height) => {
      height = WIDTH * height / width
      this.setState({
        height,
        visible: 0,
        index: index + 1
      })
    })
  }

  submit_A = () => {
    HttpUtils.post(LEARN.right, { resource_id: this.state.datas[this.state.index].id }).then(res => {
      this.setState({
        visible: 1
      })
    })
  }

  submit_B = () => {
    HttpUtils.post(LEARN.forget, { resource_id: this.state.datas[this.state.index].id }).then(res => {
      this.setState({
        visible: 2
      })
    })
  }

  submit_C = () => {
    HttpUtils.post(LEARN.wrong, { resource_id: this.state.datas[this.state.index].id }).then(res => {
      this.setState({
        visible: 2
      })
    })
  }

  render() {

    switch (this.state.visible) {
    case 0 :
      optionsView = <View style={styles.choose}>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_A}>
          <Text>I know it.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_B}>
          <Text>I just remember a little bit.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_C}>
          <Text>I forget it.</Text>
        </TouchableOpacity>
      </View>
      break
    case 1:
      optionsView =
        <TouchableOpacity
          style={styles.result}
          onPress={() => {
            this.next()
          }}
        >
          <Text>{this.state.datas[this.state.index].name}</Text>
          <Image
            style={styles.result_logo}
            source={require('../../res/images/learn/right.png')}/>
        </TouchableOpacity>
      break
    case 2:
      optionsView =
        <TouchableOpacity
          style={styles.result}
          onPress={() => {
            this.next()
          }}
        >
          <Text>{this.state.datas[this.state.index].name}</Text>
          <Image
            style={styles.result_logo}
            source={require('../../res/images/learn/wrong.png')}/>
        </TouchableOpacity>
      break
    default:
      optionsView = <View style={styles.choose}>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_A}>
          <Text>I know it.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_B}>
          <Text>I just remember a little bit.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_C}>
          <Text>I forget it.</Text>
        </TouchableOpacity>
      </View>
    }

    return (
      <Container>
        <ScrollView style={styles.box}>
          <ProfileHeader
            title='LEARN'
            desc={`Learning progress：${this.state.index} / ${this.state.datas.length}`}
            rightButton={
              <TouchableOpacity onPress={() => {
                this.next()
              }}>
                <Image style={styles.navLeftImg} source={require('../../res/images/navigation/next.png')}/>
              </TouchableOpacity>
            }/>
          <Modal visible={this.state.modalVisible} transparent={true}>
            <ImageViewer
              imageUrls={[{ url: this.state.mounted ? this.state.datas[this.state.index].url : ''}]}
              enableImageZoom={true}
              onClick={() => {
                this.setState({ modalVisible: false })
              }}/>
          </Modal>
          <TouchableOpacity onPress={() => {
            this.setState({ modalVisible: true })
          }}>
            <Image
              style={{
                width: WIDTH,
                height: this.state.height
              }}
              source={{ uri: this.state.mounted ? (this.state.datas[this.state.index].url + '-375width.jpg') : '' }}/>
          </TouchableOpacity>
          {optionsView}
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    height: HEIGHT
  },
  box: {
    marginTop: 20
  },
  text: {
    fontSize: 16
  },
  optionsContainer: {
    marginTop: 0,
    height: getResponsiveHeight(52),
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#979797'
  },
  choose: {
    marginTop: 50
  },
  result: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50
  },
  result_logo: {
    marginTop: 10
  }
})
