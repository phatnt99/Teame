import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Button,
    StyleSheet,
    Dimensions,
    Text,
    FlatList,
    SafeAreaView,
    TextInput,
    Alert,
    Animated,
    PanResponder
} from 'react-native';
//import { Container, Content, Card, CardItem, Text } from 'native-base';
import { withNavigation } from 'react-navigation';
import Carousel from 'react-native-snap-carousel';
import firebase from 'react-native-firebase';
import CardDetail from "./CardDetail";
import { Icon } from 'native-base';
import {bigStyles} from './Card/styles';
import AddCard from '../../common/Card/AddCard';

const ScreenWidth = Dimensions.get("window").width;

class DetailTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listList: [],
            listname: '',
            listSlide: [],
            //isLoadItem: false
            //dùng cho xoay màn hình
            pan: new Animated.ValueXY(),
            scale: new Animated.Value(1),
            locaX: 0,
            locaY: 0,
            dragging: false,
            isDrag: false,
            positionX: 0,
            positionY: 0,
            slideIndex: 0,

        }
        this.unsubscriber = null;
        this.ref = firebase.firestore().collection('boards').doc(this.props.data.id).collection('lists');
        this.dataCard = null;
        this.showModal= this.showModal.bind(this);
    }

    setDrag = (dragging) => {
        this.setState({
            isDrag: dragging
        })
        this._carousel._setDrag(dragging);
    };

    getPos = (posX, posY) => {
        this.setState({
            positionX: posX,
            positionY: posY
        })
    };

    componentDidMount() {
        //console.log("COMPONENT DID");
        //lấy danh sách list id
        this.unsubscriber = this.ref.onSnapshot((query) => {
            const list = [];
            //
            query.forEach(doc => {
                list.push({
                    id: doc.id,
                    name: doc.data().name,
                });
            });
            this.setState({
                listList: list,
            });
        });
    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        };

        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                //return true if user is swiping, return false if it's a single click
                this.setState({
                    locaX: evt.nativeEvent.pageX,
                    positionX: evt.nativeEvent.pageX,
                    locaY: evt.nativeEvent.pageY,
                    positionY: evt.nativeEvent.pageY,
                })


                return this.state.isDrag;
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
                //onMoveShouldSetPanResponder(false);

                this.state.pan.setOffset({
                    x: this.state.pan.x._value,
                    y: this.state.pan.y._value
                });
                this.state.pan.setValue({ x: 0, y: 0 });
                //console.log("x = " + this.state.pan.x._value + " y = " + this.state.pan.y._value);

            },
            onPanResponderMove: (evt, gestureState) => {

                Animated.event([
                    null,
                    {
                        dx: this.state.pan.x,
                        dy: this.state.pan.y
                    }
                ])(evt, gestureState);


                if (evt.nativeEvent.pageX < 50) {
                    this._carousel.expt(true);
                }
                if (evt.nativeEvent.pageX > ScreenWidth - 50) {
                    //this._carousel.scrollNext();
                    this._carousel.expt(false);
                    // setTimeout(() => this._carousel.snapToNext(), 1000)
                }

                //console.log("vi tri = ", evt.nativeEvent, "vi tri 2 = ", gestureState);
            }
            ,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                //this.state.pan.flattenOffset();
                //set isDrag về false
                //console.log("vi tri X cuoi = ", evt.nativeEvent.pageX);
                this.state.pan.setValue({ x: 0, y: 0 });

                //Thả ra => B1: tìm slideIndex => B2: check collision => B3: đổi trong DB
                //console.log("SLIDE INDEX THU  =",  this._carousel.currentIndex);

            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }


    isZone = (i) => { //i: index mới
        if (this.state.isDrag) { //đang kéo card thì mới check
            this.setDrag(false);
            let card = this.dataCard;

            if (i != card.sid) {
                this.state.listSlide.forEach((value) => {
                    if (i == value.sid) // nếu danh sách đích được tìm thấy && sid ko trùng với id kéo đến
                    {
                        //cập nhật lid của card
                        firebase.firestore().collection('cards').doc(card.cardid).update({
                            lid: value.lid
                        });
                    }
                })
            }



        }

    }

    getCard = (data) => {
        this.dataCard = data;
        //console.log("data = ", data);
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={styles.container}
                onLayout={(e) => {
                    if (this.state.listList.length != this.state.listSlide.length) {
                        this.setState({
                            listSlide:
                                [...this.state.listSlide,
                                {
                                    sid: index,
                                    lid: item.id,
                                    x: e.nativeEvent.layout.x,
                                    y: e.nativeEvent.layout.y,
                                    w: e.nativeEvent.layout.width,
                                    h: e.nativeEvent.layout.height
                                }
                                ]
                        });
                    }
                }}>
                <View style={styles.header}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Icon name='md-more' />
                </View>
                <View style={styles.item}>
                    <CardDetail ListName={item.name} ListId={item.id} SlideId={index} PanResponder={this._panResponder} getdt={this.getCard} setDrag={this.setDrag} navigation={this.props.navigation} />
                </View>
                <View>
                    <Button title="Thêm thẻ"
                        onPress={() => {
                            this.showModal(item.id);
                        }}></Button>
                </View>
            </View>
        )
    }

    showModal(selectedList) {
        this.refs.modalThemThe.show(selectedList);
    }

    render() {
        //console.log("COMPONENT RENDER");
        return (
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
                <View
                    style={{ backgroundColor: "#e6e6e6", height: Dimensions.get("window").height, }}>
                    {this.state.isDrag &&
                        <Animated.View style={[
                            { zIndex: 10, position: 'absolute', top: this.state.locaY - 110, left: this.state.locaX },
                            {
                                transform: [
                                    { translateX: this.state.pan.x },
                                    { translateY: this.state.pan.y }
                                ]
                            },
                        ]}>
                            <View style={styles.animatedContainer}>
                                <View style={bigStyles.tag}>
                                </View>
                                <View style={bigStyles.section}>
                                    <Text>{this.dataCard.cardname}</Text>
                                </View>
                                <View style={bigStyles.section}>
                                    <Icon name='md-time' style={[{ fontSize: 14 }, bigStyles.subcolor]} />
                                    <Text style={[bigStyles.showdeadline, bigStyles.subcolor]}>Hôm nay - 23/12/2019</Text>
                                </View>
                                <View style={bigStyles.actionSec}>
                                    <View style={bigStyles.showInfo}>
                                        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='md-list' style={[{ fontSize: 14 }, bigStyles.subcolor]} />
                                            <Text style={[bigStyles.showdeadline, bigStyles.subcolor]}>5</Text>
                                        </View>
                                        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='md-attach' style={[{ fontSize: 14 }, bigStyles.subcolor]} />
                                            <Text style={[bigStyles.showdeadline, bigStyles.subcolor]}>5</Text>
                                        </View>
                                        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name='md-chatboxes' style={[{ fontSize: 14 }, bigStyles.subcolor]} />
                                            <Text style={[bigStyles.showdeadline, bigStyles.subcolor]}>5</Text>
                                        </View>
                                    </View>
                                    <View style={bigStyles.member}>
                                        <View style={bigStyles.avatar} />
                                        <View style={bigStyles.avatar} />
                                        <View style={bigStyles.avatar} />
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    }
                    <Carousel
                        swipeThreshold={0}
                        enableSnap={!this.state.isDrag}
                        layout={'default'}
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.listList}
                        renderItem={this._renderItem}
                        sliderWidth={Dimensions.get("window").width}
                        itemWidth={Dimensions.get("window").width - 40}
                        onEndDragging={this.isZone}
                        lockScrollWhileSnapping={true}
                    />
                </View>
                <AddCard ref={'modalThemThe'} list={this.state.listList}></AddCard>
            </View>
        );
    }
}
export default withNavigation(DetailTable);

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 10
    },
    header: {
        padding: 10,
        backgroundColor: "#8492A6",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 16
    },
    card: {
        backgroundColor: "#ebecf0",
        width: 100,
        margin: 10,
        borderRadius: 10,

    },
    item: {
        padding: 5
    },
    animatedContainer: {
        padding: 10,
        borderWidth: 1,
    }
});