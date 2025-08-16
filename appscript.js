// Handle CORS preflight
function doOptions() {
  return ContentService.createTextOutput()
    .setHeader('Access-Control-Allow-Origin','*')
    .setHeader('Access-Control-Allow-Methods','POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers','Content-Type');
}

// Receive task data and append to Sheet1
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    const { taskId, taskText, taskCategory, completedAt } = JSON.parse(e.postData.contents);
    const ts = new Date(completedAt).toISOString();
    sheet.appendRow([taskId, taskText, taskCategory, ts]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin','*');
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin','*');
  }
}

// Run once to set headers
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  sheet.clear();
  sheet.appendRow(['Task ID','Task Text','Category','Completed At']);
}
