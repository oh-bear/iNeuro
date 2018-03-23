import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import SegmentedControlItem from './SegmentedControlItem'

export default class SegmentedControl extends Component {
    static Item = SegmentedControlItem;

    static defaultProps = {
        defaultPage: 0,
        itemFontSize: 14,
        itemButtonActiveColor : 'transparent',
        itemButtonColor : 'transparent',
        itemTextActiveColor : '#fff',
        itemTextColor : '#737373',
        itemButtonViewStyle : undefined,
        itemButtonBorderColor : 'transparent',
        itemHeaderViewStyle : undefined,
    };

    static propTypes = {
        ...View.propTypes,
        style: View.propTypes.style,
        defaultPage: PropTypes.number,
        itemFontSize: PropTypes.number,
        itemButtonActiveColor: PropTypes.string,
        itemButtonColor: PropTypes.string,
        itemTextActiveColor: PropTypes.string,
        itemTextColor: PropTypes.string,
        onItemSelected: PropTypes.func,
        itemButtonViewStyle : View.propTypes.style,
        itemButtonBorderColor: PropTypes.string,
        itemHeaderViewStyle : View.propTypes.style,
    };

    constructor(props) {
        super(props);

        this.visibles = [];
        this.state = {
            selectedIndex: 0,
            childrenLength: 0,
        }
    }

    render() {
        let children = this.props.children;
        let childrenLength = this.props.children.length;

        if (!childrenLength) {
            throw new Error(`SegmentedControlItem can not undefined`);
        }

        let navs = [];

        const contentViews = children.map((child,i) => {
            const buttonColor = this.state.selectedIndex == i ? this.props.itemButtonActiveColor : this.props.itemButtonColor;
            const textColor = this.state.selectedIndex == i ? this.props.itemTextActiveColor : this.props.itemTextColor;

            navs[i] = (
                <TouchableOpacity
                    activeOpacity={1}
                    key={i}
                    style={[
                        styles.ItemButton,
                        i > 0 ? {borderLeftWidth:0}:undefined,
                        {backgroundColor:buttonColor},
                        i==0 ? {borderTopLeftRadius:5,borderBottomLeftRadius:5}:undefined,
                        i==childrenLength-1 ? {borderTopRightRadius:5,borderBottomRightRadius:5}:undefined,
                        {borderColor:this.props.itemButtonBorderColor}
                    ]}
                    onPress={() => {
                        if (child.props.onPress) {
                            child.props.onPress();
                        }
                        this.update(i);
                    }}>
                    <Text
                        style={[
                            styles.ItemButtonText,
                            {color: textColor},
                            {fontSize:this.props.itemFontSize}
                        ]}
                    >
                        {child.props.title}
                    </Text>
                </TouchableOpacity>
            );

            if (!this.visibles[i]) {
                return null;
            } else {
                const style = this.state.selectedIndex === i ? styles.base : [styles.base,styles.gone];
                return (
                    <View
                        pointerEvents={this.state.selectedIndex === i ? 'auto' : 'none'}
                        key={'view_' + i}
                        style={style}>
                        {child}
                    </View>
                );
            }
        });

        return (
            <View style={[styles.container,this.props.style]}>
                <View style={[
                    this.props.itemHeaderViewStyle,
                ]}>
                    <View style={[
                        styles.ItemView,
                        this.props.itemButtonViewStyle,
                    ]}>
                        {navs}
                    </View>
                    <View style={[styles.arrow, {
                        left: this.state.selectedIndex * (Dimensions.get('window').width / this.state.childrenLength) + Dimensions.get('window').width / (this.state.childrenLength + 2),
                    }]}></View>
                </View>
                <View style={styles.content}>
                    {contentViews}
                </View>
            </View>
        );
    }

    componentDidMount() {
        let page = this.props.defaultPage;

        if (page >= this.props.children.length || page < 0){
            page = 0;
        }

        this.update(page);
    }

    update(index) {
        this.visibles[index] = true;
        let children = this.props.children;
        let childrenLength = this.props.children.length;
        this.setState({
            selectedIndex: index,
            childrenLength: childrenLength,
        });

        if (this.props.onItemSelected) {
            this.props.onItemSelected(index);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        overflow: 'hidden',
        position: 'relative',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    base: {
        position: 'absolute',
        overflow: 'hidden',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    gone: {
        // top: Dimensions.get('window').height,
        // bottom: -Dimensions.get('window').height,
        opacity: 0,
    },
    nav: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        borderTopWidth:1,
        borderColor:'#eaeaea',
    },
    center: {
        width: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ItemView: {
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
    },
    ItemButton: {
        paddingHorizontal:10,
        paddingVertical:5,
        borderWidth:1,
        flex:1,
        alignItems:'center',
    },
    ItemButtonText: {

    },
    arrow: {
        left: 90,
        bottom: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 8,
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        borderBottomColor: '#fff',
        borderRightColor: 'transparent',
        position: 'absolute',
    }
});