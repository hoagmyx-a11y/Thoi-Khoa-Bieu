const D = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const R = [
  "6:45 – 11:10",
  "11:30 – 13:45",
  "13:45 – 14:00",
  "14:00 – 16:30",
  "16:30 – 18:00",
  "18:00 – 18:50",
  "19:00 – 21:00",
  "21:00 – 21:45",
  "21:45 – 23:00",
  "23:00 – 6:45",
];

const sample = {};

D.forEach(
  (d) =>
    (sample[d] = Array(R.length)
      .fill(null)
      .map(() => ["—", "", "rest"])),
);

function set(d, r, t, e, c) {
  sample[d][r] = [t, e, c];
}

set("Thứ 2", 0, "Trường", "HTDN · Anh · Lý · Toán · Sử", "school");

set("Thứ 3", 0, "Trường", "Văn · Anh · Toán · Sử · Hóa", "school");

set("Thứ 4", 0, "Trường", "Anh · Hóa · Toán · Tin", "school");

set("Thứ 5", 0, "Trường", "Toán · Văn · CNTK · Hóa", "school");

set("Thứ 6", 0, "Trường", "Lý · CNTK · HTDN", "school");

D.forEach((d) => {
  set(d, 1, "Ăn trưa + nghỉ", "", "meal");
  set(d, 2, "Nghỉ / tự học", "", "rest");
  set(d, 4, "IT", "14:00 – 16:30", "it");
  set(d, 5, "Nghỉ / tự học", "", "rest");
  set(d, 6, "Ăn tối + nghỉ", "", "meal");
  set(d, 7, "Nghỉ", "", "rest");
  set(d, 9, "Ngủ", "", "sleep");
});

["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].forEach((d) =>
  set(d, 4, "IT", "14:00 – 16:30", "it"),
);

set("Thứ 2", 6, "Văn", "19:00 – 21:00", "van");

set("Thứ 6", 6, "Văn", "19:00 – 21:00", "van");

["Thứ 3", "Thứ 5", "Thứ 7"].forEach((d) =>
  set(d, 6, "Toán", "19:00 – 21:00", "toan"),
);

["Thứ 2", "Thứ 4", "Chủ nhật"].forEach((d) =>
  set(d, 8, "Hóa online", "21:45 – 23:00", "hoa"),
);

set("Thứ 4", 2, "Thể dục", "13:45 – 15:20", "sport");

set("Thứ 6", 2, "Thể dục + GDQP", "13:45 – 17:05", "sport");

let data = JSON.parse(localStorage.getItem("tkb-editable") || "null") || {
  rows: R,
  events: sample,
};

let cur = null;

function save() {
  localStorage.setItem("tkb-editable", JSON.stringify(data));

  render();
}

function esc(x) {
  return String(x).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[m],
  );
}

function render() {
  tb.innerHTML = "";

  data.rows.forEach((tm, r) => {
    let tr = document.createElement("tr");
    let td = document.createElement("td");

    td.className = "time";
    td.textContent = tm;
    td.ondblclick = () => editRow(r);

    tr.appendChild(td);

    D.forEach((d) => {
      let c = document.createElement("td");

      c.className = "cell";

      let e = (data.events[d] || [])[r];

      if (e) {
        let v = document.createElement("div");

        v.className = "event " + (e[2] || "rest");

        v.innerHTML =
          "<b>" +
          esc(e[0]) +
          "</b>" +
          (e[1] ? "<small>" + esc(e[1]) + "</small>" : "");

        v.onclick = () => openE(d, r);

        c.appendChild(v);
      } else {
        c.textContent = "—";
        c.onclick = () => openE(d, r);
      }

      tr.appendChild(c);
    });

    tb.appendChild(tr);
  });
}

function fill() {
  day.innerHTML = D.map((x) => `<option>${x}</option>`).join("");

  row.innerHTML = data.rows
    .map((x, i) => `<option value="${i}">${x}</option>`)
    .join("");
}

function openE(d, r) {
  cur = {
    d,
    r,
  };

  fill();

  day.value = d;
  row.value = r;

  let e = data.events[d]?.[r] || ["", "", "rest"];

  title.value = e[0] || "";
  etime.value = e[1] || data.rows[r];
  type.value = e[2] || "rest";

  mt.textContent = "Sửa lịch";

  modal.classList.add("show");
}

function addEvent() {
  cur = null;

  fill();

  title.value = "";
  etime.value = "";
  type.value = "rest";

  mt.textContent = "Thêm lịch";

  modal.classList.add("show");
}

function saveE() {
  let d = day.value;
  let r = +row.value;

  if (!data.events[d]) {
    data.events[d] = [];
  }

  data.events[d][r] = [title.value || "—", etime.value, type.value];

  closeM();
  save();
}

function del() {
  if (!cur) {
    return closeM();
  }

  data.events[cur.d][cur.r] = ["—", "", "rest"];

  closeM();
  save();
}

function closeM() {
  modal.classList.remove("show");
  cur = null;
}

function addRow() {
  let x = prompt("Nhập khung giờ mới, ví dụ 16:30 – 17:00");

  if (!x) return;

  data.rows.push(x);

  D.forEach((d) => data.events[d].push(["—", "", "rest"]));

  save();
}

function editRow(r) {
  let x = prompt("Sửa khung giờ:", data.rows[r]);

  if (x) {
    data.rows[r] = x;
    save();
  }
}

function resetData() {
  if (confirm("Khôi phục lịch mẫu?")) {
    data = {
      rows: [...R],
      events: structuredClone(sample),
    };

    save();
  }
}

function exportData() {
  let a = document.createElement("a");

  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    }),
  );

  a.download = "thoi-khoa-bieu.json";
  a.click();
}

function importData(e) {
  let f = e.target.files[0];

  if (!f) return;

  let q = new FileReader();

  q.onload = () => {
    try {
      let x = JSON.parse(q.result);

      if (!x.rows || !x.events) {
        throw 0;
      }

      data = x;

      save();

      alert("Đã nhập lịch!");
    } catch {
      alert("File không hợp lệ");
    }
  };

  q.readAsText(f);
}

render();
