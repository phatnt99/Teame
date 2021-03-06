import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Alert,
    Text
} from 'react-native';
import { Container, Header, Content, Body, Left, Icon, Title, Right, Subtitle, Button } from 'native-base';
import { Info, Checklist, Attach, Comment, Vote } from '../SubTabs/Card';
import firebase from 'react-native-firebase';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const screenWidth = Dimensions.get('window').width;

export default class CardViewScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Card: {
                name: '',
                lid: '',
                describe: '',
                label: null,
                deadline: null,
            },
            Loading: false,
            index: 0,
        };
        this.unsubscriber = null;
        this.ref = firebase.firestore().collection('cards');
    }

    changeIndex(index) {
        this.setState({
            index
        })
    }

    addCardToCalendar(title, time, note) {
        let eventConfig = {};
        if (time) {
            //convert time to UTC string
            let colectTime = time.split('/');
            let corTime = colectTime[2] + '-' + colectTime[1] + '-' + colectTime[0] + 'T';
            let stime = corTime + '07:00:00.000Z';
            let etime = corTime + '08:00:00.000Z';
            eventConfig = {
                title,
                startDate: stime,
                endDate: etime,
                notes: note,
            };
        }
        else {
            eventConfig = {
                title,
                notes: note,
            };
        }
        AddCalendarEvent.presentEventCreatingDialog(eventConfig);
    }

    _renderTab() {
        switch (this.state.index) {
            case 0:
                return <Info data={this.state.Card} bmembers={this.props.navigation.state.params.members} isAdmin={this.props.navigation.state.params.isAdmin } lname={this.props.navigation.state.params.name} />
                break;
            case 1:
                return <Checklist data={this.state.Card} />
                break;
            case 2:
                return <Attach data={this.state.Card} />
                break;
            case 3:
                return <Comment data={this.state.Card} />
                break;
            case 4:
                return <Vote data={this.state.Card} />
                break;
            case 5:
                return <Info />
                break;
            default:
                break;
        }
    }


    componentDidMount() {
        let id = this.props.navigation.state.params.id;
        this.unsubscriber = this.ref.doc(id).onSnapshot(doc => {
            if (doc.data()) {
                const Card = Object.assign({}, this.state.Card, {
                    id: id,
                    name: doc.data().name,
                    describe: doc.data().describe,
                    deadline: doc.data().deadline,
                    label: doc.data().label,
                    members: doc.data().members,
                    lid: doc.data().lid,
                    address: doc.data().address
                });
                this.setState({ Card, Loading: true });
            }
        }
        );

    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        };
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={[styles.header, { backgroundColor: '#21272E' }]}>
                    <View style={[styles.section, { paddingTop: 10 }]}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack(null) }}>
                            <Icon name="arrow-back" style={{ color: '#F3C537' }} />
                        </TouchableOpacity>
                        <Menu
                            ref={'menu'}
                            button={<TouchableOpacity style={{ paddingLeft: 10, paddingRight: 10 }}
                                onPress={() => { this.refs.menu.show() }}>
                                <Icon name="more" style={{ color: '#F3C537' }} />
                            </TouchableOpacity>}
                        >
                            <MenuItem onPress={() => {

                                this.addCardToCalendar(this.state.Card.name, this.state.Card.deadline, this.state.Card.describe);

                            }}
                            >Thêm vào lịch</MenuItem>
                            {this.props.navigation.state.params.isAdmin && <>
                            <MenuDivider />
                            <MenuItem onPress={() => {
                                Alert.alert(
                                    'Xóa thẻ',
                                    'Bạn muốn xóa thẻ này? Dữ liệu của thẻ sẽ bị mất, thao tác này không thể hoàn lại.',
                                    [
                                        {
                                            text: 'Hủy',
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Xóa', onPress: () => {
                                                this.ref.doc(this.state.Card.id).delete();
                                                this.refs.menu.hide();
                                                this.props.navigation.goBack();
                                            }
                                        },
                                    ],
                                    { cancelable: false },
                                );
                            }}>Xóa</MenuItem>
                            </>}
                        </Menu>

                    </View>
                    <View style={styles.section}>
                        <View style={styles.wrapper}>
                            <Title style={styles.title}>{this.state.Card.name}</Title>
                        </View>
                    </View>
                    <View style={[styles.section, { paddingTop: 10, marginBottom: 30, alignItems: 'center' }]}>
                        <View style={{ backgroundColor: '#FFF', paddingTop: 4, paddingBottom: 4, paddingLeft: 10, paddingRight: 10, borderWidth: 2, borderRadius: 30, borderColor: '#F3C537', }}>
                            <Text style={styles.subtitle}>{this.props.navigation.state.params.name}</Text>
                        </View>
                        {this.state.Card.deadline != null && 
                        <View>
                            <Text style={{ color: '#FFF' }}>Hết hạn: {this.state.Card.deadline}</Text>
                        </View>}
                    </View>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity onPress={() => { this.changeIndex(0) }}>
                        <View style={this.state.index == 0 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 0 ? styles.activeic : styles.ic} name="md-information-circle" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(1) }}>
                        <View style={this.state.index == 1 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 1 ? styles.activeic : styles.ic} name="md-list-box" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(2) }}>
                        <View style={this.state.index == 2 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 2 ? styles.activeic : styles.ic} name="md-attach" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(3) }}>
                        <View style={this.state.index == 3 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 3 ? styles.activeic : styles.ic} name="md-chatbubbles" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.changeIndex(4) }}>
                        <View style={this.state.index == 4 ? [styles.icon, styles.activeBg] : [styles.icon, { backgroundColor: 'white' }]}>
                            <Icon style={this.state.index == 4 ? styles.activeic : styles.ic} name="md-more" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 30 }} />
                {this.state.Loading && this._renderTab()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        //flex: 2,
        backgroundColor: '#00A6FF',
        //margin: 10,
        flexDirection: 'column'
    },
    menu: {
        position: 'absolute',
        top: 125,
        padding: 10,
        flexDirection: 'row',
        width: Dimensions.get('window').width - 40,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center'
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        //margin: 10,
        marginTop: 10,
        padding: 10
    },
    section: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    subtitle: {
        color: 'black'
    },
    wrapper: {
        paddingLeft: 10,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 180,
        borderWidth: 2,
        borderColor: '#F3C537',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeBg: {
        backgroundColor: '#F3C537'
    },
    activeic: {
        color: "#21272E"
    },
    ic: {
        color: "#21272E"
    }
})
