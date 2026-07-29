const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const p = e && e.parameter ? e.parameter : {};

    const name = clean_(p.name, 80);
    const attendance = clean_(p.attendance, 100);
    const message = clean_(p.message, 500);
    const pageUrl = clean_(p.pageUrl, 500);
    const userAgent = clean_(p.userAgent, 500);

    if (!name || !attendance) {
      return json_({ ok: false, message: 'Thiếu họ tên hoặc lựa chọn tham dự.' });
    }

    sheet.appendRow([
      new Date(),
      name,
      attendance,
      message,
      pageUrl,
      userAgent
    ]);

    return json_({ ok: true, message: 'Đã lưu xác nhận.' });
  } catch (error) {
    return json_({ ok: false, message: String(error) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'Graduation RSVP' });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Thời gian',
      'Họ và tên',
      'Xác nhận tham dự',
      'Lời nhắn',
      'Trang gửi',
      'Thiết bị / trình duyệt'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  return sheet;
}

function clean_(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
