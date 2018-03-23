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

export default class Library extends Component {

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
  }

  componentWillMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(['Skull', 'Orbit', 'Cavernous sinus', 'Sellar region', 'Temporal bone', 'Posterior cranial fossa', 'Endoscopic view of skull base', 'Ventricle', 'White matter', 'Neck'])
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <CommonNav title='LIBRARY'/>
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
                  <Image
                    style={styles.icon}
                    source={require('../../res/images/icon/icon_search.png')}/>
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
    height: HEIGHT
  },
  list: {
    marginTop: getResponsiveHeight(13)
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
