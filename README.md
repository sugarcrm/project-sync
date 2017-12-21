# The Sugar Synchronizer

## About

Sugar developers commonly find themselves needing to develop module loadable packages.  Most developers do not put their
entire Sugar code base under source control.  Instead, they develop their customizations in a Sugar installation 
(writing their code, running Quick Repair and Rebuild, and iterating until they get their customization just right) and 
then manually copying their code customizations back to their Git repositories where they store the files required to
build the customizations as a module loadable package.

This script allows a Sugar developer to develop code customizations in his Sugar directory and automatically sync 
the file changes back to his Git code repository.

## Prerequisites 
 * Install gulp using the Gulp Getting Started guide: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
 * Install the required modules using `npm install`
 * Configure config.yml
 
## Usage

### Starting the synchronizer
In a shell, navigate to the directory containing gulp.js and run `gulp`.  The default task does the following:
* Updates unsyncedfiles.txt to have a current list of files that are NOT being synced
* Syncs the appropriate files
* Watches the Sugar directory for any new changes that should be synced
  * If a new file is added that will be synced, a messaged will be output to the console.
  * If a new file is added that will NOT be synced, a WARNING will be output to the console and unsyncedfiles.txt will be updated.
  

### Checking what files are being synchronized
When you kick off the synchronizer, the files being synchronized will be output to the console.  If you add new files
that should be synchronized while the synchronizer is running, the file names will be output to the console.

Perhaps the easiest to see what is being synchronized is to set `pathToCodeRepoDirectory` to an empty directory and 
start the synchronizer.  All files being synchronized will be copied to the previously empty directory.

### Checking what files are not being synchronized
When you kick off the synchronizer, the files that are not being synchronized will be listed in unsyncedfiles.txt.  If 
you add new files that should NOT be synchronized while the synchronizer is running, the file names will be output to
the console and added to unsyncedfiles.txt.  Note that the contents of unsyncedfiles.txt will be replaced every time
you start the synchronizer; it does not save previous history.

### Errors

If the synchronizer crashes (for example, if it runs out of memory), you can restart the synchronizer, and it will kick
off another sync.

## Limitations

* If you make changes to your Sugar custom directory while the gulp task is not running and then run the gulp task:
   * files that were added to the Sugar directory will be added to your code directory
   * files that were changed in the Sugar directory will be updated in your code directory
   * files that were deleted in the Sugar directory will NOT be deleted in your code directory
* If you delete a directory in your Sugar directory, the directory itself will not be deleted in your code repo directory.
However, any files inside of the directory will be deleted.  This is a limitation of 
[gulp-watch](https://github.com/floatdrop/gulp-watch/issues/70).
