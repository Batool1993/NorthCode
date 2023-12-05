This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


npm install react-scripts
npm install react
# install all dependencies 
npm install 

# amplify login // 
# https://docs.amplify.aws/start/getting-started/installation/q/integration/react/#option-1-watch-the-video-guide
npm install -g @aws-amplify/cli
amplify configure
amplify init  # creates aws-exports.js in ./src folder
amplify pull # imports backend configuration from a specific environment
amplify add auth  # Select the method as default the sign in to email and then no, I am done
amplify push


## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

<p align='center'>
<img src='https://cdn.jsdelivr.net/gh/marionebl/create-react-app@9f6282671c54f0874afd37a72f6689727b562498/screencast-error.svg' width='600' alt='Build errors'>
</p>

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing.](https://facebook.github.io/create-react-app/docs/running-tests)

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## User Guide

pages: http://localhost:3001/browse
material ui components : https://mui.com/getting-started/usage/

## local proxy for CORS error 
# MacOS (in Terminal)
open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security --disable-site-isolation-trials


# install 
brew install nginx
# commands 
start :  nginx 
stop  :  nginx -s stop
# info 
admin url   : http://localhost:8080
config file : /usr/local/etc/nginx/nginx.conf
# udpate 
server {
    listen       8080;
    server_name  localhost;

    #access_log  logs/host.access.log  main;

    location / {
        # API GW URL
        proxy_pass https://vmmaqzpewk.execute-api.us-east-1.amazonaws.com;
    }
}
# metraril UI
live demo for the project template : https://material-ui.com/store/previews/devias-kit/
components : https://mui.com/components/data-grid/editing/

# twiliio 
console : https://console.twilio.com/   user : vedat@caffeinetech.co.uk  pass : Ok...SkyloopLevent2..!
doc twiml  : https://www.twilio.com/docs/voice/twiml

# connect instance 
url : https://caffine.my.connect.aws  user : vedat   password : Ok...227



# SIP trunk part 
Note : Chime service can be used on master account only. it is restricted service!
Chime business call is set up in CaffeineTech master accout. 
+13152035040 for SIP Media Application Dial-in - it is integrated with SIP_media_test lambda fucntion
execute test-outbound-call  lambda function in us-east-1 to start a call
# user below S3 bucket policy to give access aws chime service to your bucket 
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "SMARead",
            "Effect": "Allow",
            "Principal": {
                "Service": "voiceconnector.chime.amazonaws.com"
            },
            "Action": [                
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::bucket-name/*"
        }
    ]
}


# test a websocket endpoint 
npm install -g wscat
wscat -c wss://9izhmotip0.execute-api.us-east-1.amazonaws.com/primary


# deploy to S3
npm run build

dev: aws s3 sync build/ s3://dev.dashboard.northcode.dev

prod :aws s3 sync build/ s3://dashboard.northcode.dev





