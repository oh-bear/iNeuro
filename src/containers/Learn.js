import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { WIDTH, HEIGHT, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import { Actions } from 'react-native-router-flux'
import { LEARN } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'
import { connect } from 'react-redux'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Learn extends Component {

  state = {
    data: { name: '', url: '' },
    options: ['A', 'B', 'C', 'D'],
    height: HEIGHT,
    visible: 0 // 1 right, 2 wrong
  }

  componentWillMount() {
    HttpUtils.get(LEARN.get_learn, {}).then(res => {
      if (res.code === 0) {
        Image.getSize(res.data.url, (width, height) => {
          height = WIDTH * height / width
          this.setState({
            data: res.data,
            options: res.options,
            height,
            visible: 0
          })
        })
      }
    })
  }

  next = () => {
    HttpUtils.get(LEARN.get_learn, {}).then(res => {
      if (res.code === 0) {
        Image.getSize(res.data.url, (width, height) => {
          height = WIDTH * height / width
          this.setState({
            data: res.data,
            options: res.options,
            height,
            visible: 0
          })
        })
      }
    })
  }

  submit_A = () => {
    if (this.state.options[0] === this.state.data.name) {
      HttpUtils.post(LEARN.right, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 1
        })
      })

    } else {
      HttpUtils.post(LEARN.wrong, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 2
        })
      })
    }
  }

  submit_B = () => {
    if (this.state.options[1] === this.state.data.name) {
      HttpUtils.post(LEARN.right, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 1
        })
      })

    } else {
      HttpUtils.post(LEARN.wrong, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 2
        })
      })
    }
  }

  submit_C = () => {
    if (this.state.options[2] === this.state.data.name) {
      HttpUtils.post(LEARN.right, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 1
        })
      })

    } else {
      HttpUtils.post(LEARN.wrong, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 2
        })
      })
    }
  }

  submit_D = () => {
    if (this.state.options[3] === this.state.data.name) {
      HttpUtils.post(LEARN.right, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 1
        })
      })

    } else {
      HttpUtils.post(LEARN.wrong, { resource_id: this.state.data.id }).then(res => {
        this.setState({
          visible: 2
        })
      })
    }
  }

  // TODO: 改成判断题
  render() {

    switch (this.state.visible) {
    case 0 :
      optionsView = <View>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_A}>
          <Text>A. {this.state.options[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_B}>
          <Text>B. {this.state.options[1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_C}>
          <Text>C. {this.state.options[2]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_D}>
          <Text>D. {this.state.options[3]}</Text>
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
      optionsView = <View>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_A}>
          <Text>A. {this.state.options[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_B}>
          <Text>B. {this.state.options[1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_C}>
          <Text>C. {this.state.options[2]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={this.submit_D}>
          <Text>D. {this.state.options[3]}</Text>
        </TouchableOpacity>
      </View>
    }

    return (
      <View style={styles.container}>
        <CommonNav
          title='LEARN'
          rightBtnImg={
            <Image style={styles.navLeftImg} source={require('../../res/images/navigation/next.png')}/>
          }
          rightBtnImgOnPress={this.next}/>
        <ScrollView style={styles.box}>
          <Image
            style={{
              width: WIDTH,
              height: this.state.height
            }}
            source={{ uri: this.state.data.url }}/>
          {optionsView}
        </ScrollView>
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
  result: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50
  },
  result_logo: {
    marginTop: 10
  }
})
