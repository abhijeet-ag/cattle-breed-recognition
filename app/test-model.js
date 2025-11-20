const model = require('./assets/ml_tfjs/model.json');
console.log('📊 Model format:', model.format);
console.log('�� Has modelTopology:', !!model.modelTopology);
console.log('📊 Has weightsManifest:', !!model.weightsManifest);
console.log('📊 First few keys:', Object.keys(model).slice(0, 5));
console.log('📊 Complete structure (first 200 chars):');
console.log(JSON.stringify(model, null, 2).substring(0, 200) + '...');
