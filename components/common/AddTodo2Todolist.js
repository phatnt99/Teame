import React, { Component } from 'react';
import { View, Text, Modal, TextInput, Button, Alert } from 'react-native';

export default class AddTodo2Todolist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            isVisible: false
        };
    }

    show() {
        this.setState({
            isVisible: true
        })
    }

    render() {
        return (
            <View>
                <Modal
                    presentationStyle="pageSheet"
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isVisible}>
                    <View>
                        <Text>Thêm Todo</Text>
                        <TextInput
                            onChangeText={(text) => {
                                this.setState({
                                    input: text
                                })
                            }} />
                        <Button
                            title="Thêm"
                            onPress={() => {
                                newTodo = {
                                    id: Math.floor(Date.now() / 1000),
                                    name: this.state.input,
                                    done: false
                                }
                                this.props.func(newTodo, this.props.todoListId).then()
                                .catch((error) => {
                                    Alert.alert("lỗi","Có lỗi " + error);
                                });
                            }}></Button>
                        <Button title="Đóng"
                            onPress={() => {
                                this.setState({
                                    isVisible: false
                                })
                            }}></Button>

                    </View>
                </Modal>
            </View>
        );
    }
}
