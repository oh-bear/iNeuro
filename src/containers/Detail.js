import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

import { HEIGHT, WIDTH, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'

export default class Detail extends Component {

  state = { height: HEIGHT, modalVisible: false }

  componentDidMount() {
    Image.getSize((this.props.data.url + '-375width.jpg'), (width, height) => {
      height = WIDTH * height / width
      this.setState({ height })
    })
  }

  render() {
    return (
      <Container>
        <CommonNav title={this.props.data.system_name}/>
        <Modal visible={this.state.modalVisible} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: this.props.data.url}]}
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
            source={{ uri: (this.props.data.url + '-375width.jpg') }}/>
        </TouchableOpacity>
        <TextPingFang style={styles.text}>{this.props.data.name}</TextPingFang>
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 18
  }
})
