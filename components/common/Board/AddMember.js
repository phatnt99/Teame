import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modalbox';
import { Item, Input, Icon } from 'native-base';
import firebase from 'react-native-firebase';

function User({ data, bid, bname }) {
    return (
        <View style={{ flexDirection: 'row', padding: 5, marginTop: 5 }}>
            <View style={{ flex: 8 }}>
                <Text>{data.name}</Text>
            </View>
            <TouchableOpacity style={{ flex: 2 }}
                onPress={() => {
                    firebase.firestore().collection('requests').add({
                        from: firebase.auth().currentUser.displayName,
                        to: data.uid,
                        toToken: data.token, //token used to push notification
                        type: 'invite',
                        payload: {
                            'bid': bid,
                            'bname': bname
                        },
                        status: false
                    }).then(() => {
                        Alert.alert('Thành công', 'Đã gửi lời mời tham gia bảng!');
                    });
                }}>
                <Text style={{color: '#F3C537'}}>THÊM</Text>
            </TouchableOpacity>
        </View>
    )
}

export default class AddBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
            loading: true,
            email: ''
        };
        this.unsubscriber = null;
        this.ref = firebase.firestore().collection('users');
    }

    show() {
        this.refs.modal.open();
    }

    componentDidMount() {

    }

    UNSAFE_componentWillMount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    searchUserValible = () => {
        console.log('submit, email = ', this.state.email);
        this.ref.where('email', '==', this.state.email).get()
            .then(query => {
                if (query.empty) {
                    return;
                }
                query.forEach(doc => {
                    const users = {
                        uid: doc.data().uid,
                        name: doc.data().name,
                        token: doc.data().token,
                        email: doc.data().email,
                        photo: doc.data().photoURL
                    };
                    this.setState({ users });
                });
            });
    }

    render() {
        return (
            <Modal
                ref={'modal'}
                style={{
                    borderRadius: 5,
                    shadowRadius: 10,
                    width: 300,
                    height: null,
                    padding: 20
                }}
                position='center'
                backdrop={true}
                coverScreen={true}>
                <View>
                    <Text style={{ fontSize: 18 }}>Thêm thành viên</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Item rounded>
                        <Input
                            style={{ height: 40 }}
                            placeholder='Nhập email hoặc tên...' keyboardType="email-address"
                            onChangeText={(text) => {
                                this.setState({ email: text });
                            }}
                            onSubmitEditing={this.searchUserValible} />
                        <Icon name='md-search' />
                    </Item>
                </View>
                <View style={{ marginTop: 10 }}>
                    {this.state.users && <User data={this.state.users} bid={this.props.bid} bname={this.props.bname}></User>}
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    section: {
        marginTop: 10
    }
})