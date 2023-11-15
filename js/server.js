import express from 'express';
import dotenv from 'dotenv';
import {promises as fsPromises} from 'fs';
import fs from 'fs';
import { AuthClient, RestliClient } from 'linkedin-api-client';
import { resolve } from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';


// const express = require('express');
// const axios = require('axios');
// const querystring = require('querystring');
// const fs = require('fs').promises;
// const path = require('path');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { AuthClient, RestliClient } = require('linkedin-api-client');
// const dotenv = require('dotenv');

dotenv.config();


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(resolve(__dirname, 'public')));

let accessToken = '';
let urnId = '';
let uploadUri = '';
let imageAsset = '';

const REGISTER_UPLOAD_URI = 'https://api.linkedin.com/v2/assets?action=registerUpload';
const UPLOAD_FILES_REL_PATH = './public/';
const DEFAULT_FILE_DESCRIPTION = 'Test file description';
const DEFAULT_FILE_TITLE = 'Test file title';
const DEFAULT_EXPORT_PDF_HTML_FILE = 'export_template.html';
const DEFAULT_EXPORT_PDF_FILE = 'export.pdf';

const BASE_URI = "http://localhost:3000/";
const SHARE_URI = BASE_URI + "share";
const USERINFO_URI = BASE_URI + "userinfo";
const GET_AUTH_URI = BASE_URI + "getAuthUri";
const UPLOAD_FILE_URI = BASE_URI + "uploadFile";
const EXPORT_URI = BASE_URI + "export";

/* Initialize auth and restli clients */
if (!(process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.OAUTH2_REDIRECT_URL)) {
  throw new Error(
    'The CLIENT_ID, CLIENT_SECRET, and OAUTH2_REDIRECT_URL variables must be set in the .env file.'
  );
}

const authClient = new AuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUrl: process.env.OAUTH2_REDIRECT_URL
});
const restliClient = new RestliClient();
restliClient.setDebugParams({ enabled: true });


async function registerUpload() {
  //console.log("accessToken" +  accessToken);
  const response = await fetch(REGISTER_UPLOAD_URI, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Connection: 'Keep-Alive'
    },
    body: JSON.stringify({
      registerUploadRequest: {
        owner: `urn:li:person:${urnId}`,
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        serviceRelationships: [
          {
            identifier: 'urn:li:userGeneratedContent',
            relationshipType: 'OWNER'
          }
        ]
      }
    })
  });

  let resData = await response.json();
  if (resData) {
    //console.log(resData.data);
    uploadUri = resData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    imageAsset = resData.value.asset;
  }
}

// image upload route
app.post('/uploadImage', async (req, res) => {
  try {
  const imageData = req.body.imageData;

  // Decode the base64 image data and save it as a file
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  fsPromises.writeFile('public/output.png', base64Data, 'base64');

      res.status(200).send('Image saved successfully');
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).send('Error saving image');
    }
  // fsPromises.writeFile('public/output.png', base64Data, 'base64', (err) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send('Error saving image');
  //   } else {
  //     res.status(200).send('Image saved successfully');
  //   }
  });

// app.post('/uploadImage', async (req, res) => {
//   try {
//     const imageData = req.body.imageData;

//     // Decode the base64 image data and save it as a file
//     const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
//     const imagePath = join(__dirname, 'public', 'output.png'); 
//     await fsPromises.writeFile(imagePath, base64Data, 'base64');

//     res.status(200).send('Image saved successfully');
//   } catch (error) {
//     console.error('Error saving image:', error);
//     res.status(500).send('Error saving image');
//   }
// });

app.post('/export', express.json(), async (req, _res) => {
  //const absFilename = resolve(UPLOAD_FILES_REL_PATH + DEFAULT_EXPORT_PDF_HTML_FILE);
  const absFilename = resolve("./public/export_template.html");

  /**
   * First open the HTML template file then use cheerio lib to modify
   * the HTML as we need. This will leave us the whole new HTML stored
   * in a string (accessible via $.html())
   *
   * @FIXME Populate correct data here to the correct HTML template
   */
  const html = fs.readFileSync(absFilename, 'utf-8');
  let $ = cheerio.load(html);
  $('.fillData').text(req.body.exportData);
  $('.logoPlaceholder').text(
    `<img src="data:image/jpeg;base64,${fs
      .readFileSync(resolve(UPLOAD_FILES_REL_PATH ))
      .toString('base64')}"/>`
  );
  const htmlString = unescapeHTML($.html());

  /**
   * Once the HTML template is properly filled, we use the puppeteer lib
   * to export it to a PDF
   */
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(htmlString, { waitUntil: 'domcontentloaded' });
  await page.emulateMediaType('screen');
  await page.pdf({
    path: resolve(UPLOAD_FILES_REL_PATH + DEFAULT_EXPORT_PDF_FILE),
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4'
  });
  await browser.close();

  /* Convert the PDF's first page to PNG as well */
  await pdfToPng(
    resolve(UPLOAD_FILES_REL_PATH + DEFAULT_EXPORT_PDF_FILE), // The function accepts PDF file path or a Buffer
    {
      useSystemFonts: true, // When `true`, fonts that aren't embedded in the PDF document will fallback to a system font. Default value is false.
      outputFolder: resolve(UPLOAD_FILES_REL_PATH), // Folder to write output PNG files. If not specified, PNG output will be available only as a Buffer content, without saving to a file.
      outputFileMask: 'export', // Output filename mask. Default value is 'buffer'.
      pagesToProcess: [1] // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
    }
  );
});

/**
 * Endpoint to get the auth URI. Auth URI is generated using the
 * info we put in the .env file. Frontend then uses the auth URI to
 * initiate a Linkedin authentication
 */
app.get('/getAuthUri', (_req, res) => {
  /* If no access token, have member authorize again */
  let retAuthUri = authClient.generateMemberAuthorizationUrl([
    'w_member_social',
    'profile',
    'email',
    'openid'
  ]);

  res.send({ authUri: retAuthUri });
});

/**
 * Endpoint to get the user's info, which is needed to get the urnId
 */
app.get('/userInfo', (_req, res) => {
  
  if (!accessToken) {
    res.send({ error: `No access token found` });
  } else {
    /* Fetch profile details */
    restliClient
      .get({
        resourcePath: '/userinfo',
        accessToken
      })
      .then((response) => {
        res.json(response.data);
        urnId = response.data.sub;
      })
      .catch(() => {
        res.send({ error: `Error encountered while fetching profile` });
      });
  }
});

/**
 * Endpoint to finalize the Linkedin authentication, which is needed to get the accessToken
 */
app.get('/oauth', (req, res) => {
  const authCode = req.query ? req.query.code : null;
  if (authCode) {
    /* Exchange auth code for an access token and redirect to main page */
    authClient
      .exchangeAuthCodeForAccessToken(authCode)
      .then((response) => {
        accessToken = response.access_token;
        res.redirect('/userinfo');
      })
      .catch(() => {
        res.send({ error: `Failed to exchange auth code for access token` });
      });
  } else {
    let resData = {};
    if (req.query?.error_description) {
      const resData = { error: req.query ? `${req.query.error_description}` : null };
    } else {
      resData = { error: `Expecting "code" query parameter` };
    }
    res.send(resData);
  }
  
});

app.post('/share', express.json(), async (req, res) => {
  const shareData = req.body.shareData;
  const postsCreateResponse = await restliClient.create({
    resourcePath: '/ugcPosts',
    entity: {
      author: `urn:li:person:${urnId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: shareData
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: `READY`,
              description: {
                text: "Test file description"
              },
              media: imageAsset,
              title: {
                text: 'Test file title'
              }
            }
          ]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'CONNECTIONS'
      }
    },
    accessToken
  });

  /* This is the created share URN */
  let resData = {};
  if (postsCreateResponse.createdEntityId) {
    resData = { status: 'Post shared successfully' };
  } else {
    resData = { error: 'Failed to post share' };
  }
  res.send(resData);
});

/**
 * Endpoint to upload a file to the Linkedin assets for a later share post
 *
 * @FIXME RestliClient only seems to support a few Linkedin endpoints so using pure
 * fetch here
 */
app.post('/uploadFile', express.json(), async (req, res) => {
  if (!uploadUri) {
    await registerUpload();
  }

  /**
   * Attempt to use the file requested by the frontend
   * If file doesn't exist, fallback to the logo file or something else
   */
  const fileName = req.body.fileName;
  let absFilename = resolve("./public/output.png");
  // if (!fs.existsSync(resolve(absFilename))) {
  //   absFilename = resolve(UPLOAD_FILES_REL_PATH + DEFAULT_LOGO_FILE);
  // }

  const response = await fetch(uploadUri, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'mu'
    },
    body: fs.readFileSync(absFilename)
  });

  if (response.status == 201) {
    res.send({ status: `Uploaded successfully` });
  } else {
    res.send({ error: `Failed to upload file (${response.status})` });
  }
});



app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// // Map to store media ID after uploading the image
// const mediaIdMap = new Map();

// // LinkedIn authentication callback
// app.get('/auth/linkedin/callback', async (req, res) => {
//   try {
//     const { code } = req.query;

//   // Exchange authorization code for access token
//   const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify({
//     grant_type: 'authorization_code',
//     code,
//     redirect_uri: 'http://localhost:3000/oauth', 
//     client_id: '78gl5t9n4n35le',
//     client_secret: 'oD0ZC7s0em0Ygnzc', 
//   }), {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   });

//   const accessToken = tokenResponse.data.access_token;

//   // Fetch user's LinkedIn profile
//   const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   const userProfile = profileResponse.data;
//   console.log(userProfile);

//     // Upload image to LinkedIn and get media ID
//     const imagePath = path.join(__dirname, 'public', 'output.png'); 
//     const mediaId = await uploadImageToLinkedIn(accessToken, imagePath);

//     // Share image on LinkedIn
//     await shareImageOnLinkedIn(accessToken, mediaId);

//     res.send('LinkedIn authentication and image sharing successful!');
//   } catch (error) {
//     console.error('Error during LinkedIn authentication and image sharing:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



// // Function to upload image to LinkedIn and get media ID
// async function uploadImageToLinkedIn(accessToken, imagePath) {
//   try {
//     const imageBuffer = await fs.readFile(imagePath);
//     const imageBase64 = imageBuffer.toString('base64');

//     const uploadResponse = await axios.post(
//       'https://api.linkedin.com/v2/assets?action=registerUpload',
//       { registerUploadRequest: { recipes: ['urn:li:digitalmediaRecipe:feedshare-image'], owner: 'urn:li:person:we-bridge-a67758294', 
//       }},
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const uploadUrl = uploadResponse.data.value.uploadMechanism[
//       'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
//     ].uploadUrl;

//     await axios.put(uploadUrl, imageBuffer, {
//       headers: {
//         'Content-Type': 'image/png',
//       },
//     });

//     const mediaId = uploadResponse.data.value.asset;
//     mediaIdMap.set(mediaId, uploadUrl);

//     console.log('Image uploaded to LinkedIn. Media ID:', mediaId);
//     return mediaId;
//   } catch (error) {
//     console.error('Error uploading image to LinkedIn:', error);
//     throw error;
//   }
// }

// // Function to share image on LinkedIn
// async function shareImageOnLinkedIn(accessToken, mediaId) {
//   try {
//     const shareResponse = await axios.post(
//       'https://api.linkedin.com/v2/ugcPosts',
//       {
//         author: `urn:li:person:we-bridge-a67758294`, 
//         lifecycleState: 'PUBLISHED',
//         specificContent: {
//           'com.linkedin.ugc.ShareContent': {
//             shareCommentary: {
//               text: 'Check out this image!',
//             },
//             shareMediaCategory: 'IMAGE',
//             media: [
//               {
//                 status: 'READY',
//                 description: {
//                   text: 'Image Description',
//                 },
//                 media: `urn:li:digitalmediaAsset:${mediaId}`,
//               },
//             ],
//           },
//         },
//         visibility: {
//           'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
//         },
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       }
//     );
//     console.log('Image shared on LinkedIn. Post ID:', shareResponse.data.id);
//   } catch (error) {
//     console.error('Error sharing image on LinkedIn:', error);
//     throw error;
//   }
// }

