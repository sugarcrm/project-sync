var gulp = require('gulp');
var del = require('del');
var gulpNewer = require('gulp-newer');
var gulpWatch = require('gulp-watch');
var minimatch = require('minimatch');
var gulpUtil = require('gulp-util');
var glob = require('glob');
var fs = require('fs');
var debug = require('gulp-debug');

////////////////////////////////////
// CUSTOMIZE THESE VARIABLES
////////////////////////////////////

/*
 * The path to your Sugar directory where you are testing and developing your module loadable package.
 * The path should end with a directory name (no slash).
 *
 * If all of your custom code will be in the custom directory, we recommend using your Sugar custom directory
 * Example: '/Applications/MAMP/htdocs/sugar/custom'
 *
 * If all of your custom code will NOT be in the custom directory (for example, if you built a module loadable package
 * using Studio so you have code in custom, icons, language, metadata, and modules directories), we recommend using
 * your Sugar directory.
 * Example: '/Applications/MAMP/htdocs/sugar/custom'
 */
var pathToSugarDirectory = '';

/*
 * The path to your code repository.  Files inside of your Sugar custom directory will be automatically synced
 * to this directory.
 * Example: /Users/lschaefer/samplecoderepo/src/custom
 */
var pathToCodeRepoDirectory = '';

/*
 * This is an array of globs that SHOULD be synced. Any files that do not match the patterns below will not be synced.
 * You likely do NOT want to sync your entire Sugar custom directory as the basic Sugar installation includes hundreds of
 * files by default in the custom directory.  It's best to specifically list the directories and/or files that should be
 * included.
 *
 * See the readme for examples
 */
var arrayOfGlobsToSync = [];

////////////////////////////////////
// END OF REQUIRED CUSTOMIZATIONS
////////////////////////////////////

var nameOfUnsyncedFilesTextFile = 'unsyncedfiles.txt';
var writeStream = fs.createWriteStream(nameOfUnsyncedFilesTextFile);

var sugarCustomDirectoryGlob = pathToSugarDirectory + '/**/*';

/**
 * The default task does the following:
 *   - Updates unsyncedfiles.txt to have a current list of files that are NOT being synced
 *   - Syncs the appropriate files
 *   - Watches the Sugar custom directory for any new changes that should be synced
 *     - If a new file is added that will NOT be synced, a WARNING will be output to the console and unsyncedfiles.txt
 *       will be updated.
 *     - If a new file is added that will be synced, a messaged will be output to the console.
 */
gulp.task('default', function() {
    listFilesNotBeingSynced();

    gulpUtil.log("Kicking off initial sync");
    syncToCodeRepo();

    gulpUtil.log("Watching for file changes in " + sugarCustomDirectoryGlob);
    var watcher = gulpWatch(sugarCustomDirectoryGlob, syncToCodeRepo);
    watcher.on('unlink', function(filePath){
        del(filePath.replace(pathToSugarDirectory, pathToCodeRepoDirectory), {force:true});
    });
    watcher.on('add', function(filePath){

        for (i in arrayOfGlobsToSync){
            if (minimatch(filePath, arrayOfGlobsToSync[i])) {
                gulpUtil.log("The following file was created in the custom directory and is being synced to the code repository: \n" + filePath);
                return;
            }
        }

        writeStream.write(new Date() + ': WARNING: The following file was created in the custom directory but is \n' +
            'NOT being synced to the code repository.  Adjust the arrayOfGlobsToSync in gulpfile.js if this file should ' +
            'be synced.\n' + filePath);

        gulpUtil.log(gulpUtil.colors.yellow('WARNING: '), 'The following file was created in the custom directory but is ' +
            'NOT being synced to the code repository.  Adjust the arrayOfGlobsToSync in gulpfile.js if this file should ' +
            'be synced.\n' + filePath);
    });
});

gulp.task('unsyncedfiles', listFilesNotBeingSynced);

/**
 * Outputs a list of files not being synchronized to nameOfUnsyncedFilesTextFile
 */
function listFilesNotBeingSynced(){
    glob(sugarCustomDirectoryGlob, function(er, files){
        if (er !== null){
            throw er;
        }

        filesNotBeingSynced = [];

        outerloop: for (fileIndex = 0; fileIndex < files.length; fileIndex++){

            //If the file is actually a directory, we do not want to list it
            if (!files[fileIndex].toString().includes('.')){
                continue outerloop;
            }

            for (globIndex = 0; globIndex < arrayOfGlobsToSync.length; globIndex++){

                if (minimatch(files[fileIndex], arrayOfGlobsToSync[globIndex])){
                    continue outerloop;

                } else if (globIndex === arrayOfGlobsToSync.length - 1) {
                    // If we have searched through all of the globs without getting a match
                    filesNotBeingSynced.push(files[fileIndex]);
                }
            }
        }

        if (filesNotBeingSynced.length > 0){
            writeStream.write(new Date() + ': WARNING: The following files are in the custom directory but are NOT being \n' +
                'synced to the code repository. Adjust the arrayOfGlobsToSync in gulpfile.js if these files should ' +
                'be synced.\n\n');

            for(i in filesNotBeingSynced){
                writeStream.write(filesNotBeingSynced[i] + '\n');
            }

            writeStream.write('\n');

            gulpUtil.log(gulpUtil.colors.yellow('WARNING: '), 'Not all files in the custom directory are ' +
                'being synced to the code repository. \nSee ' + nameOfUnsyncedFilesTextFile + ' for the list of files.' +
                ' Adjust the arrayOfGlobsToSync in gulpfile.js if these \nfiles should be synced.  ');
        }

    });
}

/**
 * This is what actually does the syncing
 */
function syncToCodeRepo(){
    gulp.src(arrayOfGlobsToSync, {base: pathToSugarDirectory}).pipe(gulpNewer(pathToCodeRepoDirectory))
        .pipe(debug({title: 'Synced'})).pipe(gulp.dest(pathToCodeRepoDirectory));
}