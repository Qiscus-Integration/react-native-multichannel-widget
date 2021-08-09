import React, {Component} from "react";
import {FlatList, View, Text, Image, TouchableOpacity} from "react-native";
import Button from "../Button";

class Carousel extends Component {
    renderItem = ({item}) => {
        const {image, title, description, buttons} = item
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    height: 290,
                    width: 210,
                    marginRight: 10,
                }}>
                <Image
                    source={{uri: image}}
                    style={{
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        height: 125,
                        width: 210
                    }}
                />
                <View style={{
                    backgroundColor: '#ffffff',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    flex: 1,
                    paddingTop: 16,
                }}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={{
                            color: '#7d7d7d',
                            paddingLeft: 13,
                            paddingRight: 13,
                            fontSize: 16
                        }}>{title}</Text>

                    <Text
                        numberOfLines={3}
                        ellipsizeMode='tail'
                        style={{
                            color: '#afafaf',
                            paddingTop: 3,
                            paddingLeft: 13,
                            paddingRight: 13,
                            fontSize: 14
                        }}>{description}</Text>
                    <Button
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                        buttons={buttons}
                        {...this.props}/>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let {item, scrollDown} = this.props
        this.scrollDown = scrollDown
        let {cards} = item.payload
        return (
            <View style={{
                height: 290,
            }}>
                <FlatList
                    data={cards}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderItem}/>
            </View>
        )
    }
}

export default Carousel
