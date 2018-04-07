import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ListView
} from 'react-native'
import { WIDTH, HEIGHT, getResponsiveWidth, getResponsiveHeight } from '../common/styles'
import CommonNav from '../components/CommonNav'
import { SCENE_DETAIL } from '../constants/scene'
import { Actions } from 'react-native-router-flux'

import { LIBS } from '../network/Urls'
import HttpUtils from '../network/HttpUtils'

export default class Search extends Component {

  state = {
    content: '',
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
  }

  submit = () => {
    HttpUtils.post(LIBS.search, { content: this.state.content }).then(res => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(res.data)
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <CommonNav title='SEARCH'/>
        <View style={styles.box}>
          <View style={styles.content}>
            <TextInput
              style={styles.text}
              onChangeText={(content) => this.setState({ content })}
              value={this.state.text}
              placeholder={'Input something here...'}
              placeholderTextColor={'#999'}
              underlineColorAndroid='transparent'
              onSubmitEditing={this.submit}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={this.submit}
            >
              <Image source={require('../../res/images/icon/icon_search.png')}/>
            </TouchableOpacity>
          </View>
          <View style={styles.line}/>
        </View>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={
            (rowData) =>
              <TouchableOpacity
                style={styles.box}
                onPress={() => {
                  Actions.jump(SCENE_DETAIL, { data: rowData })
                }}
              >
                <View style={styles.content}>
                  <Text style={styles.text}>{rowData.name}</Text>
                  <Text style={styles.system_text}>{rowData.system_name}</Text>
                </View>
                <View style={styles.line}/>
              </TouchableOpacity>
          }
        />
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
  text: {
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
