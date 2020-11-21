# enable powershell execution (https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.1)
# Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope process
Compress-Archive `
  -Path page-scripts,icons,beforeYouContinueClicker.js,manifest.json,signInToYouTubeClicker.js,common.js `
  -DestinationPath google-consent-dialogs-handler.zip `
  -Force
