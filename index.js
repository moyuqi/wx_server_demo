const fs = require('fs');
fs.readFile('config.json', 'utf8', (err, data) => {
    // console.log(err, data);
    if (err) {
        console.error(err);
    }

    try {
        const config = JSON.parse(data);
        getTicket(config);
    } catch (e) {
        console.error('config parse error', e);
    }

});

function getTicket(config) {
    const currentDate = new Date();
    if (config && (currentDate.getTime() - config.expireTime > 7200)) {
        const WechatAPI = require('wechat-api');
        const { appid, appsecret } = config;
        const api = new WechatAPI(appid, appsecret);
        api.getTicket((err, result) => {
            if (err) {
                console.error(err);
            } else {
                console.log(result);
                config.ticket = result.ticket;
                config.expireTime = result.expireTime;

                fs.writeFileSync('config.json', JSON.stringify(config));
            }
        })
    }

    console.log('ticket:', config.ticket);
    sign(config.ticket);
}

function sign(jsapiTicket) {
    const inquirer = require("inquirer");
    inquirer.prompt([{
        type: 'input',
        name: 'url',
        message: '请输入需要调用JS接口的URL(不包含#及后面部分)'
    }]).then((answers) => {
        const url = answers.url.split('#')[0];
        console.log('url:', url);

        const weChatSign = require('wechat-sign');
        const sign = weChatSign(jsapiTicket, url);
        console.log(sign);
    });
}


