import {AllHtmlEntities} from 'html-entities';
import {SupportImageType} from "../constants/messageType";
import moment from "moment";
import "moment/locale/en-ca"
import mitt from "mitt";
import axios from "axios";
import Toast from "react-native-root-toast";
import {ToastAndroid} from "react-native";
import packageJson from '../../package.json';

const entities = new AllHtmlEntities();

export const parseHtmlText = (text) => entities.decode(text);

export const getFileExtension = (name) => name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1);

export const getUrlFileName = (url) => url.split('/').pop();

export const isImageFile = (name) => SupportImageType.contains(getFileExtension(name.toLowerCase()))

export const getMoment = moment

export const emitter = mitt()

export const getMetaUrl = async (url) => {
    let config = {
        method: 'get',
        url: `https://api.urlmeta.org/?url=${url}`,
        headers: {'Authorization': 'Basic bXJ5b2dhMTk5NUBnbWFpbC5jb206THUxTnFxSHM2QlFTeDNEWlFFMXE'}
    };
    return axios(config)
}

export const generateLinkPayload = (url = "", title = "", image = "", description = "", name = '', favicon = "") => {
    return {
        url: url,
        meta: {
            site: {
                name: name,
                favicon: favicon
            },
            description: description,
            image: image,
            title: title
        }
    }
}

export const generateProductPayload = (id='', title = "", price = "", description = "", image = "",url = "") => {
    return {
        id: id,
        title: title,
        price: price,
        description: description,
        image: image,
        url: url,
    }
}

export const formatPrice = (price) => {
    const belowZero = price < 0;
    const absolutePrice = Math.abs(price);

    return `${belowZero ? '-' : ''}Rp ${absolutePrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

export const isEmpty = str =>{
    let text = str.replace(/^\s+/, '').replace(/\s+$/, '')
    return text === '';
}


export function qiscusToast(msg) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls on toast\`s appear animation start
            },
            onShown: () => {
                // calls on toast\`s appear animation end.
            },
            onHide: () => {
                // calls on toast\`s hide animation start.
            },
            onHidden: () => {
                // calls on toast\`s hide animation end.
            }
        });
        // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
        setTimeout(function() {
            Toast.hide(toast);
        }, 5000);
    }
}

export function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day =`${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`
}

export const getVersion = () => {
    return `${packageJson.name} version ${packageJson.version}`
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
