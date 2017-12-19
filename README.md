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
 * Customize the variables in gulpfile.js.
   * Example of arrayOfGlobsToSync for a module where all customizations are in the custom directory:
```
var arrayOfGlobsToSync = [
       pathToSugarDirectory + '/Extension/modules/myCustomModule/**/*',
       pathToSugarDirectory + '/modules/myCustomModule/**/*',
       pathToSugarDirectory + '/modules/Opportunities/*.php'
];
```
   * Example of arrayOfGlobsToSync for the ProfessorM module where all customizations are NOT in the custom directory:
   ```
   var arrayOfGlobsToSync = [
       pathToSugarDirectory + '/custom/Extension/modules/**/*professor*.php',
       pathToSugarDirectory + '/custom/Extension/modules/**/*Professor*.php',
       pathToSugarDirectory + '/custom/Extension/modules/Accounts/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Accounts/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-accounts-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Calls/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-calls-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Calls/Ext/Vardefs/rli_link_workflow.php',
       pathToSugarDirectory + '/custom/Extension/modules/Campaigns/Ext/Layoutdefs/_overrideCampaign_subpanel_opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Contacts/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-contacts-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Contacts/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Documents/Ext/Layoutdefs/_overrideDocument_subpanel_opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Documents/Ext/Vardefs/rli_link_workflow.php',
       pathToSugarDirectory + '/custom/Extension/modules/Leads/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Meetings/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Notes/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-notes-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Notes/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Opportunities/Ext/Dependencies/opp_disable_dep.ext.php',
       pathToSugarDirectory + '/custom/Extension/modules/Opportunities/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Products/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-products-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Products/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Project/Ext/Layoutdefs/_overrideProject_subpanel_opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Project/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Quotes/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-quotes-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Quotes/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/RevenueLineItems/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-revenuelineitems-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/RevenueLineItems/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/custom/Extension/modules/Tasks/Ext/clients/base/layouts/subpanels/_overridesubpanel-for-tasks-opportunities.php',
       pathToSugarDirectory + '/custom/Extension/modules/Tasks/Ext/Vardefs/**/*',
       pathToSugarDirectory + '/icons/**/*Professor*.*',
       pathToSugarDirectory + '/language/application/en_us.lang.php',
       pathToSugarDirectory + '/metadata/**/*professor*.php',
       pathToSugarDirectory + '/modules/Accounts/clients/base/filters/default/default.php',
       pathToSugarDirectory + '/modules/Accounts/clients/base/views/list/list.php',
       pathToSugarDirectory + '/modules/Accounts/clients/base/views/record/record.php',
       pathToSugarDirectory + '/modules/Accounts/metadata/SearchFields.php',
       pathToSugarDirectory + '/modules/Contacts/clients/base/filters/default/default.php',
       pathToSugarDirectory + '/modules/Contacts/clients/base/views/list/list.php',
       pathToSugarDirectory + '/modules/Contacts/clients/base/views/record/record.php',
       pathToSugarDirectory + '/modules/Contacts/metadata/SearchFields.php',
       pathToSugarDirectory + '/modules/Leads/clients/base/filters/default/default.php',
       pathToSugarDirectory + '/modules/Leads/clients/base/layouts/convert-main/convert-main.php',
       pathToSugarDirectory + '/modules/Leads/clients/base/views/list/list.php',
       pathToSugarDirectory + '/modules/Leads/clients/base/views/record/record.php',
       pathToSugarDirectory + '/modules/Leads/metadata/SearchFields.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/filters/default/default.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/dupecheck-list/dupecheck-list.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/list/list.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/record/record.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/selection-list/selection-list.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-accounts-opportunities/subpanel-for-accounts-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-activities-opportunities/subpanel-for-activities-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-calls-opportunities/subpanel-for-calls-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-contacts-opportunities/subpanel-for-contacts-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-forecastworksheets-opportunity/subpanel-for-forecastworksheets-opportunity.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-leads-opportunity/subpanel-for-leads-opportunity.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-meetings-opportunity/subpanel-for-meetings-opportunity.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-notes-opportunities/subpanel-for-notes-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-pmse_bpmprocessdefinition-opportunities_locked_fields_link/subpanel-for-pmse_bpmprocessdefinition-opportunities_locked_fields_link.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-products-opportunities/subpanel-for-products-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-quotes-opportunities/subpanel-for-quotes-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-revenuelineitems-opportunities/subpanel-for-revenuelineitems-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-tags-opportunities_link/subpanel-for-tags-opportunities_link.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/base/views/subpanel-for-tasks-opportunities/subpanel-for-tasks-opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/mobile/views/detail/detail.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/mobile/views/edit/edit.php',
       pathToSugarDirectory + '/modules/Opportunities/clients/mobile/views/list/list.php',
       pathToSugarDirectory + '/modules/Opportunities/metadata/subpanels/Campaign_subpanel_opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/metadata/subpanels/Document_subpanel_opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/metadata/subpanels/Email_subpanel_opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/metadata/subpanels/Project_subpanel_opportunities.php',
       pathToSugarDirectory + '/modules/Opportunities/metadata/SearchFields.php',
       pathToSugarDirectory + '/modules/PR_Professors/**/*',
       pathToSugarDirectory + '/modules/Products/metadata/SearchFields.php',
       pathToSugarDirectory + '/modules/RevenueLineItems/metadata/studio.php'
   ];


```
 
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
