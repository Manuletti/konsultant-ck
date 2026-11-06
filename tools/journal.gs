/**
 * Журнал партий «Консультанта ЦК».
 * Вставить в Google-таблицу: Расширения → Apps Script → заменить код этим → Сохранить →
 * Начать развертывание → Новое развертывание → тип «Веб-приложение»,
 * «Выполнять как: я», «У кого есть доступ: все» → Развернуть → скопировать URL веб-приложения.
 */
const SHEET = "Партии";
const HEAD = ["Когда", "Партия", "Игрок (браузер)", "Имя", "Концовка", "Ключ", "Проигрыш", "Кредо", "Декабрь 1991",
  "Доверие", "Перо", "Убеждения", "Круг", "Листов", "Путь", "Версия"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
    if (sh.getLastRow() === 0) { sh.appendRow(HEAD); sh.setFrozenRows(1); }
    const clean = v => { v = String(v == null ? "" : v).slice(0, 2000); return /^[=+\-@]/.test(v) ? "'" + v : v; };
    const st = d.stats || {};
    const row = [new Date(), clean(d.id), clean(d.player), clean(d.name), clean(d.ending), clean(d.key), d.lost ? "да" : "",
      clean(d.credo), clean(d.dec), st.trust, st.pen, st.con, st.circ, d.steps, clean(d.path), clean(d.version)];
    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 2, n, 1).getValues().map(r => String(r[0])) : [];
    const i = ids.indexOf(String(d.id));
    if (i < 0) sh.appendRow(row);
    else if (d.name) sh.getRange(i + 2, 4).setValue(clean(d.name));
    else sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
