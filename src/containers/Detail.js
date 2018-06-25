import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  AlertIOS
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

import { HEIGHT, WIDTH, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'
import { Button, Toast } from 'antd-mobile'
import storage from '../common/storage'

export default class Detail extends Component {

  state = { height: HEIGHT, modalVisible: false, index: 0, data: this.props.data, datas: [] }

  async componentDidMount() {
    const index_data = await storage.get('structures_index')
    const structures_data = await storage.get('structures')
    if (index_data && structures_data) {
      this.setState({ index: index_data.data, datas: structures_data.data })
    }
    Image.getSize((this.state.data.url + '-375width.jpg'), (width, height) => {
      height = WIDTH * height / width
      this.setState({ height })
    })
  }

  render() {

    let nextView = null

    if (this.props.next) {
      nextView = <Button
        type="primary"
        style={styles.next}
        onClick={() => {
          let index = this.state.index
          if (index >= this.state.datas.length - 1) {
            AlertIOS.alert('Good', 'You have viewed all the structures!')
          } else {
            this.setState({
              data: this.state.datas[index + 1],
              index: index + 1,
            })
          }
        }}>
        GO TO NEXT
      </Button>
    }

    return (
      <Container>
        <CommonNav title={this.state.data.system_name}/>
        <Modal visible={this.state.modalVisible} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: this.state.data.url }]}
            enableImageZoom={true}
            onClick={() => {
              this.setState({ modalVisible: false })
            }}/>
        </Modal>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            this.setState({ modalVisible: true })
          }}>
          <Image
            style={{
              width: WIDTH,
              height: this.state.height
            }}
            source={{ uri: (this.state.data.url + '-375width.jpg') }}/>
          <TextPingFang style={styles.text}>{this.state.data.name}</TextPingFang>
        </TouchableOpacity>
        { nextView }
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
    flex: 1,
    marginTop: 40,
    alignItems: 'center'
  },
  text: {
    marginTop: 30,
    fontSize: 18
  },
  next: {
    marginTop: getResponsiveHeight(40),
    borderRadius: 30,
    backgroundColor: '#3b599a',
    width: '60%'
  }
})
