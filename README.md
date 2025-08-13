# hitesh_todo
Making a remote to-do for Hitesh with 4 different categories based on importance and urgency levels.
It should also log the completed tasks into a Google Sheet file or into an Excel sheet.

The Data will be stored in your browser's localStorage which holds _all_ your tasks both pending and completed.

The only times you'd "lose" everything are when you or your browser explicitly:
  1. Clear site data (e.g. “Clear browsing data” or “Clear site storage”).
  2. Use a different browser or device (localStorage does not sync between them).
  3. Open the site in incognito/private mode without persisting storage
  4. Uninstall your browser or reset your profile.

And even if you did clear localStorage, any tasks you had completed would still live in your Google Sheet
Work in effect for "pending tasks" as well. Will integrate with a free cloud storage platform which would be much more interactive and effective than localstorage.
