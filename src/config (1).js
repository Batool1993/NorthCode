export const amplifyConfig = {
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "us-east-1:039a49d5-b242-4066-9481-184cde8282ce",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_4nc3bHn2r",
  "aws_user_pools_web_client_id": "l94c4oqvbj98j59arg9d2sebs",
  "oauth": {},
  "aws_cognito_login_mechanisms": [
      "EMAIL"
  ],
  "aws_cognito_signup_attributes": [
      "EMAIL"
  ],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": [
      "SMS"
  ],
  "aws_cognito_password_protection_settings": {
      "passwordPolicyMinLength": 8,
      "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": [
      "EMAIL"
  ],
  "aws_user_files_s3_bucket": "landlordfiles170913-dev",
  "aws_user_files_s3_bucket_region": "us-east-1",
  "aws_appsync_apiKey": "da2-fakeApiId123456"
};

export const auth0Config = {
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN
};

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
};

export const gtmConfig = {
  containerId: process.env.REACT_APP_GTM_CONTAINER_ID
};
