import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ListView,
  Image,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import { HEIGHT, WIDTH, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import { Actions } from 'react-native-router-flux'
import { SCENE_DETAIL } from '../constants/scene'

import { LIBS } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'
import CommonNav from '../components/CommonNav'
import ProfileHeader from '../components/ProfileHeader'
import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'
import storage from '../common/storage'

export default class Structure extends Component {

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }),
    loaded: false
  }

  async componentDidMount() {
    const res = await HttpUtils.get(LIBS.list, { system_name: this.props.system_name })
    await storage.set('structures', { data: res.data })
    this.setState({
      structures: res.data,
      dataSource: this.state.dataSource.cloneWithRows(res.data),
      loaded: true
    })
  }

  render() {
    return (
      <Container>
        <ProfileHeader title='STRUCTURE'/>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={
            (rowData) =>
              <TouchableOpacity
                style={styles.box}
                onPress={
                  async () => {
                    await storage.set('structures_index', { data: this.state.structures.indexOf(rowData) })
                    Actions.jump(SCENE_DETAIL, {
                      data: rowData,
                      next: true
                    })
                  }}
              >
                <View style={styles.content}>
                  <Text style={styles.text}>{rowData.name}</Text>
                  <Image
                    style={styles.icon}
                    source={require('../../res/images/icon/icon_search.png')}/>
                </View>
                <View style={styles.line}/>
              </TouchableOpacity>
          }
        />
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
  list: {},
  box: {
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
    width: 0.8 * WIDTH,
    marginLeft: getResponsiveWidth(50),
    height: 1,
    borderBottomColor: '#979797',
    borderBottomWidth: 1
  },
  text: {
    color: '#444',
    marginTop: getResponsiveHeight(15),
    marginLeft: getResponsiveWidth(63),
    fontSize: 16
  },
  icon: {
    marginTop: getResponsiveHeight(16),
    marginRight: getResponsiveHeight(18),
    width: 20,
    height: 20,
  }
})
