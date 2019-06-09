const baseUrl = '//elm.cangdu.org'

export default async (url = '', data = {}, method = 'GET') => {
    method = method.toUpperCase();
    url = baseUrl + url;
    // 拼接RESTful风格url，
    if(method === 'GET') {
        let dataStr = '';
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })

        if (dataStr) {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
    }
    if(window.fetch) {
        let requestConfig = {
            // credentials: 'include',
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: "cors",
            cache: "force-cache"
        };
        if(method === 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }
        try {
            let response = await fetch(url, requestConfig);
            response = response.json();
            return response;
        } catch(error) {
            throw new Error(error)
        }
    } else {    // 不支持fetch的话手撸原生ajax
        return new Promise((resolve, reject) => {
            let request;
            request = new XMLHttpRequest();
            // eslint不让用好像，一直报错undefined
            // else if(typeof ActiveXObject != 'undefined') {
            //     request = new ActiveXObject();
            // }
            let postData = null;
            if(method === 'POST') {
                postData = JSON.stringify(data);
            }

            request.open(method, url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(postData);

            request.onreadyStateChange = function() {
                if(request.readyState == 4) {
                    if(request.status == 200) {
                        let obj = request.response;
                        if(typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj);
                    } else {
                        reject(request);
                    }
                }
            }
        })
    }
}