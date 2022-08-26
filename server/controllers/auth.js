const saml2 = require('saml2-js');
const Saml2Parser = require('saml2js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Subscriber = require('../model/subscribers');

// const url = 'https://ambassadors-test.mybluemix.net';
// const url = process.env.NODE_ENV === 'production' ? 'https://ambassadors-test.mybluemix.net' : 'https://ambassadors.mybluemix.net';
const url = process.env.NODE_ENV === 'production' ? 'https://ambassadors.mybluemix.net' : 'https://ambassadors-test.mybluemix.net';
const w3idUrl = process.env.NODE_ENV === 'production' ? 'https://w3id.sso.ibm.com' : 'https://w3id-test.sso.ibm.com';
const partnerIDURL = `${url}/api/metadata`;
const ssoLoginURL = process.env.NODE_ENV === 'production' ? `${w3idUrl}/auth/sps/samlidp2/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=${url}/api/metadata&NameIdFormat=email&Target=${url}` : `${w3idUrl}/auth/sps/samlidp2/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=${url}/api/metadata.xml&NameIdFormat=email&Target=${url}`;
const ctrl = {};

// Create service provider
const spOptions = {
  entity_id: `${partnerIDURL}.xml`,
  private_key: fs.readFileSync('cert/key.pem').toString(),
  // certificate: fs.readFileSync('cert/cert.pem').toString(),
  assert_endpoint: `${url}/api/assert`
};

if (process.env.NODE_ENV === 'production') {
  spOptions.certificate = fs.readFileSync('cert/cert_prod.pem').toString();
}

if (process.env.NODE_ENV === 'test') {
  spOptions.certificate = fs.readFileSync('cert/cert.pem').toString();
}

// Create identity provider
const idpOptions = {
  sso_login_url: ssoLoginURL
  // certificates: fs.readFileSync('cert/samlidp2_CIS_TEST.pem').toString()
};

if (process.env.NODE_ENV === 'production') {
  idpOptions.certificates = fs.readFileSync('cert/samlidp2_CIS_PROD.pem').toString();
}

if (process.env.NODE_ENV === 'test') {
  idpOptions.certificates = fs.readFileSync('cert/samlidp2_CIS_TEST.pem').toString();
}

const sp = new saml2.ServiceProvider(spOptions);
const idp = new saml2.IdentityProvider(idpOptions);

// Endpoint to retrieve metadata
ctrl.metadata = function (req, res) {
  res.type('application/xml');
  res.send(sp.create_metadata());
};

// Starting point for login
ctrl.login = function (req, res) {
  sp.create_login_request_url(idp, {}, (err, loginUrl, requestId) => {
    if (err)
      return res.send(500);
    res.redirect(loginUrl);
  });
};

ctrl.isAdmin = email => process.env.RECEPTOR_MAIL.includes(email.toLowerCase());

// Assert endpoint for when login completes
ctrl.assert = async function (req, res) {
  const response = new Buffer(req.body.SAMLResponse || req.body.SAMLRequest, 'base64');
  const parser = new Saml2Parser(response);
  const userFromW3 = parser.toObject();
  const subscriber = await Subscriber.findById(userFromW3.uid);

  const token = jwt.sign({
    firstName: userFromW3.firstName,
    lastName: userFromW3.lastName,
    fullName: userFromW3.cn,
    email: userFromW3.emailaddress,
    isAdmin: ctrl.isAdmin(userFromW3.emailaddress),
    isSubscriber: !!subscriber,
    uid: userFromW3.uid
  }, process.env.JWT_SECRET);

  res.cookie('token', token);
  res.redirect(req.cookies.redirectTo || '/');
};

module.exports = ctrl;