#!/usr/bin/env node
'use strict';
var fs = require('fs');
var argv = require('yargs').argv;
var path = require('path');
var Cesium = require('cesium');
var defaultValue = Cesium.defaultValue;
var defined = Cesium.defined;
var writeGltf = require('./writeGltf');
var writeBinaryGltf = require('./writeBinaryGltf');
var gltfPipeline = require('../lib/gltfPipeline');

if (!defined(argv._[0]) || defined(argv.h) || defined(argv.help)) {
    var help =
        'Usage: node ' + path.basename(__filename) + ' [path-to.gltf or path-to.bgltf] [OPTIONS]\n' +
        '  -i, input=PATH Read unoptimized glTF from the specified file.\n ' +
        '  -b, write binary glTF file.\n' +
        '  -s, writes out separate geometry/animation data files, shader files and textures instead of embedding them in the glTF file.\n  ' +
        '  -o, output=PATH write optimized glTF to the specified file.\n';
    process.stdout.write(help);
    return;
}

var gltfPath = defaultValue(argv._[0], argv.i);
var fileExtension = path.extname(gltfPath);
var fileName = path.basename(gltfPath, fileExtension);
var filePath = path.dirname(gltfPath);
var outputPath = defaultValue(argv._[1], argv.o);

if (!defined(outputPath)) {
    // Default output.  For example, path/asset.gltf becomes path/asset-optimized.gltf
    outputPath = path.join(filePath, fileName + '-optimized' + fileExtension);
}

var isSeparate = defaultValue(argv.s, false);
var exportBinary = defaultValue(argv.b, false);

var options = {
    inputPath : gltfPath
};

gltfPipeline(options, function(gltf) {
    if (exportBinary) {
        writeBinaryGltf(gltf, outputPath, true);
    } else {
        writeGltf(gltf, outputPath, !isSeparate, true);
    }
});



