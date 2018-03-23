import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { HEIGHT, WIDTH, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import TextPingFang from '../components/TextPingFang'

export default class Detail extends Component {

  state = { height: HEIGHT }

  componentDidMount() {
    Image.getSize(this.props.data.url, (width, height) => {
      height = WIDTH * height / width
      this.setState({ height })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <CommonNav title={this.props.data.system_name}/>
        <View style={styles.box}>
          <Image
            style={{
              width: WIDTH,
              height: this.state.height
            }}
            source={{ uri: this.props.data.url }}/>
        </View>
        <TextPingFang style={styles.text}>{this.props.data.name}</TextPingFang>
      </View>
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
    fontSize: 16
  }
})
