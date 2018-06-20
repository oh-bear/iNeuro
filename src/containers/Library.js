import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ListView,
  Image,
  TouchableOpacity
} from 'react-native'
import { HEIGHT, WIDTH, getResponsiveHeight, getResponsiveWidth } from '../common/styles'
import CommonNav from '../components/CommonNav'
import { SCENE_STRUCTURE } from '../constants/scene'
import { Actions } from 'react-native-router-flux'
import ProfileHeader from '../components/ProfileHeader'
import TextPingFang from '../components/TextPingFang'
import Container from '../components/Container'
import HttpUtil from '../network/HttpUtils'
import { connect } from 'react-redux'

import { LEARN } from '../network/Urls'

import storage from '../common/storage'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

@connect(mapStateToProps)
export default class Library extends Component {

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }),
    select: ''
  }

  async componentWillMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(['Skull', 'Orbit', 'Cavernous sinus', 'Sellar region', 'Temporal bone', 'Posterior cranial fossa', 'Endoscopic view of skull base', 'Ventricle', 'White matter', 'Neck'])
    })
    const system = await storage.get('system', { data: 'Skull,' })
    this.setState({
      select: system.data
    })
  }

  render() {

    let img = <Image source={require('../../res/images/icon/icon_search.png')}/>
    let img_sel = <Image source={require('../../res/images/icon/icon_search_sel.png')}/>

    return (
      <Container>
        <ProfileHeader
          title='LIBRARY'
          desc='Red means what you want to learn.'
          rightButton={
            <TouchableOpacity onPress={async () => {
              let data = {
                system_name: this.state.select
              }
              console.log('click')
              const res = await HttpUtil.get(LEARN.get_learn_by_resource, data)
              await storage.set('system', { data: this.state.select })
              await storage.set('learn_data', res.data)
            }}>
              <TextPingFang style={styles.text_nav_right}>Save</TextPingFang>
            </TouchableOpacity>
          }
        />
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={
            (rowData) =>
              <TouchableOpacity
                style={styles.box}
                onPress={() => {
                  Actions.jump(SCENE_STRUCTURE, { system_name: rowData })
                }}
              >
                <View style={styles.content}>
                  <Text style={styles.text}>{rowData}</Text>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={async () => {
                      let select = this.state.select
                      if (select.includes(rowData)) {
                        select = select.replace(rowData + ',', '')
                        this.setState({
                          select
                        })
                      } else {
                        this.setState({
                          select: select + rowData + ','
                        })
                      }
                    }}
                  >
                    {this.state.select.includes(rowData) ? img_sel : img}
                  </TouchableOpacity>
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
    height: HEIGHT
  },
  tip: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: getResponsiveWidth(50),
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
