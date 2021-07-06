# ComboRacer API Test

Project containing automated tests for the Combo-Racer API

## Visual Studio setup

1. Copy ``Settings.runsettings.sample`` and rename to ``Settings.runsettings``
2. Configure the **BASE_URL** inside the runsettings as needed
3. In Visual Studio
    * Click *Test* -> *Test Settings* -> *Select Test Settings File* and pick your runsettings file
    * Click *Test* -> *Test Settings* -> *Default Processor Architecture* -> *X64*
4. You're ready to execute tests

## API Webserver setup

1. Copy ``test\testutil.php`` to the directory containing ``db_connect.php`` of the deployed Combo-Racer API that you want to test

    > **WARNING:** This utility should be used during testing only - **don't deploy this file to production environments!**

2. Now the testutil can cleanup data created during the tests.