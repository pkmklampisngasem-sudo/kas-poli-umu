function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Pencatatan Kas POLI UMUM')
      .setXframeOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Mengambil data dari Google Sheets
function getKasData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var transactions = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var tgl = row[1];
    if (tgl instanceof Date) {
      tgl = Utilities.formatDate(tgl, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    transactions.push({
      id: row[0].toString(),
      tanggal: tgl,
      keterangan: row[2],
      jenis: row[3],
      jumlah: Number(row[4])
    });
  }
  return transactions;
}

// Menambah data transaksi ke Google Sheets
function addKasTransaction(trans) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([trans.id, trans.tanggal, trans.keterangan, trans.jenis, trans.jumlah]);
  return { success: true };
}

// Menghapus data transaksi berdasarkan ID
function deleteKasTransaction(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}