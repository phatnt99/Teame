import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text
} from 'react-native';
import { Icon, Thumbnail } from 'native-base';

function _render(data) {
    return (
        data.map(val => (
            <Thumbnail key={val.uid} style={styles.avatar} source={{ uri: val.avatar }}></Thumbnail>
        ))
    )
}
export default function Item({ data, navigation }) {
    let date = new Date(parseInt(data.timestamp));
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Chi tiết bảng", data);
            }}>
                <View style={{ backgroundColor: "#F3C537", padding: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>{data.name}</Text>
                        </View>
                    </View>
                    <View style={styles.itemMember}>
                        {_render(data.members)}
                    </View>
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionInfo}>
                        {data.primary && <Icon name='md-star-outline' />}
                    </View>
                    <View style={styles.deadline}>
                        <Icon name='md-time' style={{color: '#F3C537' }} />
                        {date && <Text style={styles.showdeadline}>Ngày tạo: {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10
    },
    itemContainer: {
        //backgroundColor: 'white',
        //elevation: 3,
        //padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        borderColor: '#C4C4C4'
    },
    itemMember: {
        flexDirection: 'row',
        marginTop: 10
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
    },
    actionContainer: {
        //marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //borderTopWidth: 1,
        //borderTopColor: '#8492A6',
        backgroundColor: 'white',
        padding: 10
    },
    deadline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showdeadline: {
        marginLeft: 5,
    }
})