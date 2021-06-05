const config = {
    s3: {
        REGION: "us-west-1",
        BUCKET: "stock-journal-upload",
    },
    apiGateway: {
        REGION: "us-west-1",
        URL: "https://01v3itt60l.execute-api.us-west-1.amazonaws.com/prod/",
    },
    cognito: {
        REGION: "us-west-1",
        USER_POOL_ID: "us-west-1_koBUVVtDy",
        APP_CLIENT_ID: "409dq0nkhu4aorf5322sp28o0n",
        IDENTITY_POOL_ID: "us-west-1:53b63616-21e6-486c-9083-e80e7b4cb40a",
    },
  };
  
  export default config;