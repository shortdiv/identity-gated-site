const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export function handler(event, context, callback) {
  const { headers } = event;
  const cookieHeader = headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);

  const generateJWT = (decodedToken) => {
    console.log("decoded token    ", decodedToken.payload)
    jwt.sign(
      {
        exp: decodedToken.payload.exp,
        app_metadata: {
          authorization: { roles: decodedToken.payload.app_metadata.roles }
        },
        user_metadata: decodedToken.payload.user_metadata
      },
      "thisIsASecret"
    );

  }

  let token, decodedToken, originalToken;
  try {
    originalToken = cookies.nf_jwt;
    decodedToken = jwt.decode(cookies.nf_jwt, { complete: true });
    token = generateJWT(decodedToken)
    console.log("this is a token    ", token)
  } catch(e) {
    console.log(e)
  }

  const netlifyCookie = cookie.serialize("nf_jwt", token, {
    secure: true,
    path: "/",
    expires: new Date(decodedToken.payload.exp)
  });

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ msg: "Hello, this is a super secret function!" })
  });
}