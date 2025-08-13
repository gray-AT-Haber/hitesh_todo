function doPost(e) {
  try {
    // Get the active spreadsheet and specific sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Completed Tasks");
    
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data for debugging
    console.log("Raw received data:", e.postData.contents);
    console.log("Parsed data:", JSON.stringify(data));
    
    // Extract data with fallbacks
    const taskId = data.taskId || data.id || "N/A";
    const taskText = data.taskText || data.text || "N/A";
    const taskCategory = data.taskCategory || data.category || "N/A";
    
    // Handle timestamp
    let completionDate;
    const timestamp = data.completedAt || new Date().toISOString();
    try {
      completionDate = new Date(timestamp);
      if (isNaN(completionDate.getTime())) {
        completionDate = new Date(); // fallback if invalid date
      }
    } catch (dateError) {
      console.log("Date parsing error:", dateError);
      completionDate = new Date();
    }
    
    // Create the row data in correct order: [Task ID, Task Text, Category, Timestamp]
    const rowData = [taskId, taskText, taskCategory, completionDate];
    
    // Log what we're about to append
    console.log("Row data to append:", rowData);
    
    // Append the task data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        message: "Task added successfully",
        data: {
          taskId: taskId,
          taskText: taskText,
          taskCategory: taskCategory,
          timestamp: completionDate.toISOString()
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log comprehensive error information
    console.log("Error in doPost:", error.toString());
    console.log("Error stack:", error.stack);
    console.log("Request data:", e.postData ? e.postData.contents : "No postData");
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        requestData: e.postData ? e.postData.contents : "No postData"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Setup function - run this FIRST to prepare your sheet
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Completed Tasks");
  
  // Clear all existing data
  sheet.clear();
  
  // Set up headers in row 1
  sheet.getRange(1, 1, 1, 4).setValues([
    ["Task ID", "Task Text", "Category", "Completed At"]
  ]);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 4);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#4285f4");
  headerRange.setFontColor("white");
  headerRange.setHorizontalAlignment("center");
  
  // Set column widths for better visibility
  sheet.setColumnWidth(1, 80);  // Task ID
  sheet.setColumnWidth(2, 300); // Task Text
  sheet.setColumnWidth(3, 150); // Category
  sheet.setColumnWidth(4, 150); // Completed At
  
  // Format the timestamp column (Column D)
  sheet.getRange("D:D").setNumberFormat("dd/mm/yyyy hh:mm:ss");
  
  console.log("Sheet setup completed successfully");
}

// Test function - run this to test with sample data
function testTaskInsertion() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Completed Tasks");
  
  // Create test data exactly like your frontend sends
  const testData = {
    taskId: 123,
    taskText: "Complete space mission planning",
    taskCategory: "urgent-important", 
    completedAt: new Date().toISOString()
  };
  
  console.log("Test data being processed:", JSON.stringify(testData));
  
  // Extract data (same logic as doPost)
  const taskId = testData.taskId || "N/A";
  const taskText = testData.taskText || "N/A";
  const taskCategory = testData.taskCategory || "N/A";
  const completionDate = new Date(testData.completedAt);
  
  // Create row data
  const rowData = [taskId, taskText, taskCategory, completionDate];
  
  console.log("Row data:", rowData);
  
  // Insert test row
  sheet.appendRow(rowData);
  
  console.log("Test task inserted successfully!");
  console.log("Check your sheet - you should see:");
  console.log("- Column A: 123");
  console.log("- Column B: Complete space mission planning"); 
  console.log("- Column C: urgent-important");
  console.log("- Column D: Current timestamp");
}


//Script ID: 1-SN*****2DH-Ixa8xWxF0BdpZS9tE04NWwAIve7AbRL_MuTjqKgn5bx
