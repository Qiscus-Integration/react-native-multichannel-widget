import axios from 'axios';
import {RESOLVE_API} from "react-native-dotenv"

export const toProperCase = function (string) {
  return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

export const endSessionChat = function(roomId, tokenSdk) {
  if(RESOLVE_API){
    let data = JSON.stringify({
      'room_id': roomId.toString(),
    });

    let config = {
      method: 'post',
      url: RESOLVE_API,
      headers: {
        'Content-Type': 'application/json',
        'Authorization':tokenSdk,
      },
      data: data,
    };
    axios(config)
      .then(()=>{
        console.log("chat resolve")
      })
      .catch(e=>{
        console.log(e)
      })
  }
}
