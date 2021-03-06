import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  AlertIOS,
  ScrollView,
  Modal
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

import { WIDTH, HEIGHT, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import { LEARN } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'
import { connect } from 'react-redux'
import ProfileHeader from '../components/ProfileHeader'
import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Review extends Component {
  state = {
    data: { name: '', url: '', wrong_time: 1, total_time: 1 },
    height: HEIGHT,
    record: { result: 0 },
    length: 0,
    visible: 0, // 1 right, 2 wrong
    modalVisible: false,
  }

  componentWillMount() {
    HttpUtils.post(LEARN.get_review, {}).then(res => {
      if (res.code === 0) {
        Image.getSize((res.data.url + '-375width.jpg'), (width, height) => {
          height = WIDTH * height / width
          this.setState({
            data: res.data,
            record: res.record,
            length: res.length,
            height,
            visible: 0
          })
        })
      } else {
        AlertIOS.alert('Good', 'There is nothing to review. Go to learn!')
      }
    })
  }

  next = () => {
    HttpUtils.post(LEARN.get_review, {}).then(res => {
      if (res.code === 0) {
        Image.getSize(res.data.url, (width, height) => {
          height = WIDTH * height / width
          this.setState({
            data: res.data,
            height,
            visible: 0
          })
        })
      } else {
        AlertIOS.alert('Good', 'There is nothing to review. Go to learn!')
      }
    })
  }

  submit_A = () => {
    HttpUtils.post(LEARN.right, { resource_id: this.state.data.id }).then(res => {
      this.setState({
        visible: 1
      })
    })
  }

  submit_B = () => {
    HttpUtils.post(LEARN.wrong, { resource_id: this.state.data.id }).then(res => {
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
          <Text>I can't remember it.</Text>
        </TouchableOpacity>
      </View>
      break
    case 1:
      optionsView =
        <TouchableOpacity
          style={styles.result}
          onPress={this.next}
        >
          <Text>{this.state.data.name}</Text>
          <Image
            style={styles.result_logo}
            source={require('../../res/images/learn/right.png')}/>
        </TouchableOpacity>
      break
    case 2:
      optionsView =
        <TouchableOpacity
          style={styles.result}
          onPress={this.next}
        >
          <Text>{this.state.data.name}</Text>
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
          <Text>I can't remember it.</Text>
        </TouchableOpacity>
      </View>
    }

    return (
      <Container>
        <ScrollView style={styles.box}>
          <ProfileHeader
            title='REVIEW'
            desc={`Correct rate：${((1 - this.state.data.wrong_time / this.state.data.total_time) * 100)} %, Score：${(this.state.record.result)}, Left: ${this.state.length}`}
            rightButton={
              <TouchableOpacity onPress={() => {
                this.next()
              }}>
                <Image style={styles.navLeftImg} source={require('../../res/images/navigation/next.png')}/>
              </TouchableOpacity>
            }
          />
          <Modal visible={this.state.modalVisible} transparent={true}>
            <ImageViewer
              imageUrls={[{ url: this.state.data.url }]}
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
              source={{ uri: (this.state.data.url + '-375width.jpg') }}/>
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
