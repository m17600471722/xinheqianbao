import {
  baseUrl
} from './env'

export default async (url = '', data = {}, type = 'GET', method = 'fetch', headcode = {}) => {
  type = type.toUpperCase();
  url = baseUrl + url;
  //	console.log(url)
  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }
  if (window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        //				'Accept': 'application/x-www-form-urlencoded',
        'content-type': 'application/json',
      },
      mode: "cors",
      cache: "force-cache"
    }
    if (type == 'POST') {
      let dataStr = ''; //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&';
      })
      Object.defineProperty(requestConfig, 'body', {
        value: dataStr
      })
    }

    try {
      const response = await fetch(url, requestConfig);
      const responseJson = await response.json();
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        var dataStr = '';
        Object.keys(data).forEach(key => {
          dataStr += key + '=' + data[key] + '&';
        })
        sendData = dataStr;
        sendData = data
      }
      if(type == "POSTJSON"){
        type = "POST"
        sendData = JSON.stringify(data);
      }
      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-Type", method);
      // requestObj.setRequestHeader("dataType", "json");
      if (headcode.token != undefined) {
        requestObj.setRequestHeader("loginToken", headcode.token);
      }
      requestObj.send(sendData);
      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
