import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Container, Header, Content, Button, Title, Body, Right, Left, Icon, Thumbnail, Text } from 'native-base';
import _renderCard from '../../../common/Card/RenderCard';
import RenderCard from '../../../common/Card/RenderCard';

export default class Calendars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            chosenDate: '',
            listDeadline: this.props.navigation.state.params.deadline,
            dataCard: [],
            listDeadlineDate: this.props.navigation.state.params.deadDate,
            ready: false
        };
    }

    handleNextButtonPress() {
        const date = new Date(this.state.date);
        date.setMonth(date.getMonth() + 1);
        this.setState({
            date
        });
    }

    handlePrevButtonPress() {
        const date = new Date(this.state.date);
        date.setMonth(date.getMonth() - 1);
        this.setState({
            date
        });
    }

    getMonthName = (month) => {
        let monthNames = [
            "Tháng Một", "Tháng Hai", "Tháng Ba",
            "Tháng Tư", "Tháng Năm", "Tháng Sáu",
            "Tháng Bảy", "Tháng Tám", "Tháng Chín",
            "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"
        ];

        return monthNames[month];
    }

    getDayName = (day) => {
        let dayNames = [
            "CN", "T2", "T3", "T4", "T5", "T6", "T7",
        ];

        return dayNames[day];
    }

    renderBar = () => {
        const month = this.state.date.getMonth();
        const year = this.state.date.getFullYear();
        const monthName = this.getMonthName(month);
        return (
            <View style={styles.bar}>
                <TouchableOpacity style={styles.barTouchable}
                    onPress={() => {
                        this.handlePrevButtonPress();
                    }}>
                    <View style={[styles.barButton, styles.barButtonPrev]}>
                        <Text>
                            &larr;
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.barMonth}>
                    <Text style={styles.barText}>
                        {monthName + " "}
                    </Text>
                </View>

                <View style={styles.barYear}>
                    <Text style={styles.barText}>
                        {year}
                    </Text>
                </View>

                <TouchableOpacity style={styles.barTouchable}
                    onPress={() => {
                        this.handleNextButtonPress();
                    }}>
                    <View style={[styles.barButton, styles.barButtonNext]}>
                        <Text>
                            &rarr;
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderDayNames = () => {
        const elements = [];

        for (let i = 0; i < 7; i++) {
            const dayIndex = i % 7;
            elements.push(
                <View key={i} style={styles.dayInner}>
                    <Text style={[styles.shadedText, styles.dayText]}>
                        {this.getDayName(dayIndex)}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.week}>
                {elements}
            </View>
        );
    }

    _renderCalendar = ({ item }) => {
        return (
            <FlatList
                style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                data={item}
                renderItem={({ item }) =>
                    (
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                                this.setState({ chosenDate: item });
                                //check ngày này có thuộc deadline ko
                                const newdataCard = [];
                                this.state.listDeadline.forEach(element => {
                                    if (element.deadline == item) {
                                        newdataCard.push(element.cardDetail);
                                    }
                                });

                                this.setState({
                                    dataCard: newdataCard
                                });
                            }}>
                            <View style={this.state.chosenDate == item ? { width: 20, height: 20, borderBottomWidth: 1, borderBottomColor: 'orange', justifyContent: 'center', alignItems: 'center' } :
                                { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={
                                    (this.state.date.getMonth() + 1).toString() == (item.split('/'))[1] ?
                                        (this.state.listDeadlineDate.includes(item) ? { color: 'red' } :
                                            {}) : { color: 'gray' }
                                }>{(item.split('/'))[0]}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                keyExtractor={item => item} />
        )
    }

    getWeekDetail = () => {
        let indexOfWeek = new Date(this.state.date.getFullYear(), this.state.date.getMonth(), 1).getDay();// index thứ trong tuần
        let daysInMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 0).getDate(); //số ngày trong tháng
        let daysInLastMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth(), 0).getDate();// 31
        const week = [];

        //push số ngày còn của tháng trước = lượng indexOfWeek
        //lấy số ngày của tháng trước
        let m = this.state.date.getMonth();
        let y = this.state.date.getFullYear();
        for (let i = indexOfWeek - 1; i >= 0; i--) {
            //week.push(daysInLastMonth - i);
            if (m <= 0) {
                m = 12;
                y = y - 1;
            }
            week.push(`${daysInLastMonth - i}/${m}/${y}`);
        };

        //số ngày của tháng này => bắt đầu từ 1 -> daysInMonth
        for (let i = 1; i <= daysInMonth; i++) {
            //week.push(i);

            week.push(`${i}/${this.state.date.getMonth() + 1}/${this.state.date.getFullYear()}`);
        }

        //check xem đủ 35 ngày chưa? chưa thì thêm tiếp ngày tháng tiếp theo
        if (week.length < 35) {
            let len = 35 - week.length;
            let m = this.state.date.getMonth() + 2;
            let y = this.state.date.getFullYear();
            for (let j = 1; j <= len; j++) {
                if (m + 2 > 12) {
                    m = 1;
                    y = y + 1;
                }

                week.push(`${j}/${m}/${y}`)
            }
        }
        //chia thành 5 mảng
        let weekDiv = new Array(5);

        let index = 0;
        for (let i = 0; i < 5; i++) {
            let offset = 0;
            weekDiv[i] = new Array();
            while (offset < 7) {
                weekDiv[i].push(week[index]);
                index++;
                offset++;
            }
        }
        return (
            <View>
                {this.state.ready && <FlatList
                    showsVerticalScrollIndicator={false}
                    data={weekDiv}
                    renderItem={this._renderCalendar}
                    keyExtractor={item => item[0]}
                />}
            </View>);
    }

    renderMember = (card) => {
        if (!card.members)
            return false;
        return (card.bmembers.map(val => (
            card.members.includes(val.uid) && <Thumbnail key={val.uid} style={styles.avatar} source={{ uri: val.avatar }}></Thumbnail>
        )));
    }

    render() {

        return (
            <Container>
                <Header androidStatusBarColor="#21272E" style={{ backgroundColor: "#21272E" }}>
                    <Left>
                        <Button transparent
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            <Icon name="arrow-round-back" style={{ color: "#F3C537" }} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#F3C537' }}>Lịch</Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={styles.container}>
                    <View style={[styles.calendar]}>
                        {this.renderBar()}
                        {this.renderDayNames()}
                        {this.getWeekDetail()}
                    </View>
                    <View style={{ padding: 10, flex: 1 }}
                        onLayout={() => {
                            this.setState({
                                ready: true
                            })
                        }}>
                        <Text>Sự kiện trong ngày</Text>

                        <FlatList
                            scrollEnabled={true}
                            data={this.state.dataCard}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    style={{
                                        padding: 10,
                                        marginTop: 10,
                                        backgroundColor: '#F3C537',
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        borderColor: '#F3C537'
                                    }}
                                    onPress={() => {
                                        this.props.navigation.navigate("Chi tiết card", { id: item.id, name: item.lname, members: item.bmembers, isAdmin: this.props.navigation.state.params.isAdmin });
                                    }}>
                                    <View style={{flexDirection: 'row-reverse'}}>
                                        <View style={{ width: 10, height: 10, backgroundColor: "#21272E", borderWidth: 1, borderColor: '#21272E', borderRadius: 90 }} />
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={{ color: '#21272E' }}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>}
                            keyExtractor={item => item.id}
                        />

                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    calendar: {
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#BDBDBD",
        backgroundColor: "white",
        elevation: 5
    },
    week: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    bar: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    barText: {
        color: "#424242",
    },

    barButton: {
        backgroundColor: "white",
        padding: 10,
    },
    tag: {
        width: 60,
        height: 20,
    },
    section: {
        //marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionSec: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    showdeadline: {
        marginLeft: 5,
    },
    subcolor: {
        color: '#8492A6'
    },
    showInfo: {
        flexDirection: 'row'
    },
    member: {
        flexDirection: 'row'
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: 'green'
    },
})