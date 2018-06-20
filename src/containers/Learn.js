import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  AlertIOS,
  ListView
} from 'react-native'

import ImageViewer from 'react-native-image-zoom-viewer'

import { WIDTH, HEIGHT, getResponsiveHeight, getResponsiveWidth } from '../common/styles'
import CommonNav from '../components/CommonNav'
import { SCENE_DETAIL } from '../constants/scene'
import { Actions } from 'react-native-router-flux'
import { LEARN, LIBS } from '../network/Urls'
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
    images: [],
    content: '',
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
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

    if (index >= this.state.datas.length - 1) {
      AlertIOS.alert('Good', 'You have no thing to learn!')
    } else {
      Image.getSize((this.state.datas[index + 1].url + '-375width.jpg'), (width, height) => {
        height = WIDTH * height / width
        this.setState({
          height,
          visible: 0,
          index: index + 1,
          dataSource: this.state.dataSource.cloneWithRows({})
        })
      })
    }
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
        <TouchableOpacity
          style={styles.optionsContainer}
          onPress={() => {
            HttpUtils.post(LIBS.search, { content: this.state.datas[this.state.index].name }).then(res => {
              this.setState({
                dataSource: this.state.dataSource.cloneWithRows(res.data)
              })
            })
          }}>
          <Text>See also.</Text>
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
          <ListView
            style={styles.list}
            dataSource={this.state.dataSource}
            renderRow={
              (rowData) =>
                <TouchableOpacity
                  style={styles.list}
                  onPress={() => {
                    Actions.jump(SCENE_DETAIL, { data: rowData })
                  }}
                >
                  <View style={styles.content}>
                    <Text style={styles.text_name}>{rowData.name}</Text>
                    <Text style={styles.system_text}>{rowData.system_name}</Text>
                  </View>
                  <View style={styles.line}/>
                </TouchableOpacity>
            }
          />
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
  },
  list: {
    width: WIDTH,
    height: getResponsiveHeight(50)
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: WIDTH,
    height: getResponsiveHeight(50)
  },
  line: {
    width: WIDTH,
    marginLeft: getResponsiveWidth(50),
    height: 1,
    borderBottomColor: '#979797',
    borderBottomWidth: 1
  },
  text_name: {
    width: 0.6 * WIDTH,
    color: '#444',
    marginTop: getResponsiveHeight(15),
    marginLeft: getResponsiveWidth(63),
    fontSize: 16
  },
  system_text: {
    color: '#777',
    marginTop: getResponsiveHeight(15),
  },
  icon: {
    marginTop: getResponsiveHeight(16),
    marginRight: getResponsiveHeight(18),
    width: 20,
    height: 20,
  }
})
