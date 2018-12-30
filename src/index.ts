'use strict';


const vision = require('@google-cloud/vision');
const path = require('path');
const os = require('os');
const fs = require('fs');
const isImage = require('is-image');

// Creates a client
const client = new vision.ImageAnnotatorClient();

// Check the image content using the Cloud Vision API.
async function asyncExample( fileName ) { 
    try {
        const [result] = await client.safeSearchDetection(fileName);
        const detections = result.safeSearchAnnotation;
        if(detections.adult == "VERY_LIKELY" || detections.adult == "LIKELY" || detections.adult == "UNKNOWN"){
            console.log(`Adult:${detections.adult}: file:${fileName}`);
        }else{
            console.log(`Filesafe: ${fileName}`);
        }
    }
    catch (err) {
        console.log(err);
    }
}

var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            if(isImage(file)){
                results.push(file);
                //console.log(file);
            } 
            if (!--pending) done(null, results);
          }
        });
      });
    });
};


walk("/pathtoimages", function(err, results){
    if(err) throw err;
    console.log(results.length);
     
    results.forEach(function(result){
        //console.log(result);
        try{
            asyncExample(result);
        }catch(err){
            console.log(result + " Throws an exception");
        }
        
    });
});

/**
 * Blurs the given image located in the given bucket using ImageMagick.
 */
// async function blurImage(filePath, bucketName, metadata) {
//   const tempLocalFile = path.join(os.tmpdir(), filePath);
//   const tempLocalDir = path.dirname(tempLocalFile);
//   const bucket = admin.storage().bucket(bucketName);

//   // Create the temp directory where the storage file will be downloaded.
//   await mkdirp(tempLocalDir);
//   console.log('Temporary directory has been created', tempLocalDir);
//   // Download file from bucket.
//   await bucket.file(filePath).download({destination: tempLocalFile});
//   console.log('The file has been downloaded to', tempLocalFile);
//   // Blur the image using ImageMagick.
//   await spawn('convert', [tempLocalFile, '-channel', 'RGBA', '-blur', '0x8', tempLocalFile]);
//   console.log('Blurred image created at', tempLocalFile);
//   // Uploading the Blurred image.
//   await bucket.upload(tempLocalFile, {
//     destination: filePath,
//     metadata: {metadata: metadata}, // Keeping custom metadata.
//   });
//   console.log('Blurred image uploaded to Storage at', filePath);
//   fs.unlinkSync(tempLocalFile);
//   console.log('Deleted local file', filePath);
// }