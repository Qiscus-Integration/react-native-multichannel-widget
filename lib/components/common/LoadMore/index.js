import React from "react";
import {Text, View, TouchableOpacity} from "react-native";
import {useTranslation} from "react-i18next";

const LoadMore = ({onPress}) => {
    const { t } = useTranslation();
    return (
        <View style={{
            alignItems: 'center'
        }}>
            <TouchableOpacity
                onPress={()=>{
                    if (onPress) onPress()
                }}
                style={{
                    marginTop: 25,
                    marginBottom: 15,
                    padding: 5,
                    flexDirection: 'row',
                }}>
                <Text style={{
                    color: '#8fbc5a',
                    fontSize: 14
                }}>{t("loadMore")}</Text>
            </TouchableOpacity>
        </View>
    )
}
export default LoadMore
