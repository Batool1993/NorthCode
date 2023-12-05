import Amplify from '@aws-amplify/core';

export function configureAmplify() {
  Amplify.configure(
  {
   Auth: {
     identityPoolId: "us-east-1:039a49d5-b242-4066-9481-184cde8282ce",
     region: "us-east-1",
     userPoolId: process.env.REACT_APP_userPoolId,
     userPoolWebClientId: process.env.REACT_APP_userPoolWebClientId,
    },
  Storage: { 
     bucket: "landlordfiles170913-dev",
     region: "us-east-1",
     identityPoolId: "us-east-1:039a49d5-b242-4066-9481-184cde8282ce"
    }
  }
 );
} 
