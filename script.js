const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const TAGS = [
  { key: "school", label: "Trường" },
  { key: "it", label: "IT" },
  { key: "van", label: "Văn" },
  { key: "toan", label: "Toán" },
  { key: "hoa", label: "Hóa" },
  { key: "none", label: "Không" },
];

const DEFAULT_DATA = {
  title: "Thời Khóa Biểu Tuần",
  rows: [
    {
      time: "6:45 – 11:10",
      cells: [
        { text: "Trường\n• HĐTN\n• Anh\n• Lý\n• Toán\n• Sử", tag: "school" },
        { text: "Trường\n• Văn\n• Toán\n• Sử\n• Hóa", tag: "school" },
        { text: "Trường\n• Anh\n• Hóa\n• Toán\n• Tin", tag: "school" },
        { text: "Trường\n• Toán\n• Văn\n• CNTK\n• Hóa", tag: "school" },
        { text: "Trường\n• Lý\n• CNTK\n• HĐTN", tag: "school" },
        { text: "Không có tiết sáng", tag: "none" },
        { text: "—", tag: "none" },
      ],
    },
    {
      time: "11:10 – 13:45",
      cells: [
        { text: "Ăn trưa + nghỉ", tag: "none" },
        { text: "Ăn trưa + nghỉ", tag: "none" },
        { text: "Ăn trưa + nghỉ", tag: "none" },
        { text: "Ăn trưa + nghỉ", tag: "none" },
        { text: "Ăn trưa + nghỉ", tag: "none" },
        { text: "Nghỉ / về cá nhân", tag: "none" },
        { text: "Nghỉ / việc cá nhân", tag: "none" },
      ],
    },
    {
      time: "13:45 – 15:20",
      cells: [
        { text: "—", tag: "none" },
        { text: "—", tag: "none" },
        { text: "Thể dục (Trái buổi)", tag: "none" },
        { text: "—", tag: "none" },
        { text: "Thể dục + GDQP", tag: "none" },
        { text: "—", tag: "none" },
        { text: "—", tag: "none" },
      ],
    },
    {
      time: "16:30 – 17:05",
      cells: [
        { text: "IT\n14:00 – 16:30", tag: "it" },
        { text: "IT\n14:00 – 16:30", tag: "it" },
        { text: "Nghỉ / tự học", tag: "none" },
        { text: "IT\n14:00 – 16:30", tag: "it" },
        { text: "IT\n14:00 – 16:30", tag: "it" },
        { text: "IT\n14:00 – 16:30", tag: "it" },
        { text: "IT\n14:00 – 16:30", tag: "it" },
      ],
    },
    {
      time: "19:00 – 21:00",
      cells: [
        { text: "Văn\n19:00 – 21:00", tag: "van" },
        { text: "Toán\n19:00 – 21:00", tag: "toan" },
        { text: "—", tag: "none" },
        { text: "Toán\n19:00 – 21:00", tag: "toan" },
        { text: "Văn\n19:00 – 21:00", tag: "van" },
        { text: "Toán\n19:00 – 21:00", tag: "toan" },
        { text: "—", tag: "none" },
      ],
    },
    {
      time: "21:45 – 23:00",
      cells: [
        { text: "Hóa online\n21:45 – 23:00", tag: "hoa" },
        { text: "Nghỉ", tag: "none" },
        { text: "Hóa online\n21:45 – 23:00", tag: "hoa" },
        { text: "Nghỉ", tag: "none" },
        { text: "Nghỉ", tag: "none" },
        { text: "Nghỉ", tag: "none" },
        { text: "Hóa online\n21:45 – 23:00", tag: "hoa" },
      ],
    },
    {
      time: "23:00 – 6:45",
      cells: [
        { text: "Ngủ", tag: "none" },
        { text: "Ngủ", tag: "none" },
        { text: "Ngủ", tag: "none" },
        { text: "Ngủ", tag: "none" },
        { text: "Ngủ", tag: "none" },
        { text: "Ngủ", tag: "none" },
        { text: "Ngủ", tag: "none" },
      ],
    },
  ],
};

let data = JSON.parse(JSON.stringify(DEFAULT_DATA));
const STORAGE_KEY = "weekly-schedule-v1";

async function loadData() {
  try {
    const res = await window.storage.get(STORAGE_KEY, false);
    if (res && res.value) {
      data = JSON.parse(res.value);
    }
  } catch (e) {
    // chưa có dữ liệu lưu trước đó, dùng mẫu mặc định
  }
  render();
}

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  const statusEl = document.getElementById("statusMsg");
  statusEl.textContent = "Đang lưu...";
  saveTimer = setTimeout(async () => {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(data), false);
      statusEl.textContent = "Đã lưu ✓";
      setTimeout(() => {
        statusEl.textContent = "";
      }, 1200);
    } catch (e) {
      statusEl.textContent = "Không lưu được, thử lại sau.";
    }
  }, 500);
}

function render() {
  document.getElementById("mainTitle").textContent =
    data.title || "Thời Khóa Biểu Tuần";

  const headRow = document.getElementById("headRow");
  headRow.innerHTML = '<th class="time-head">Thời gian</th>';
  DAYS.forEach((day, i) => {
    const th = document.createElement("th");
    th.innerHTML = `<input class="day-input" data-day="${i}" value="${day}" />`;
    headRow.appendChild(th);
  });

  const body = document.getElementById("bodyRows");
  body.innerHTML = "";

  data.rows.forEach((row, rIdx) => {
    const tr = document.createElement("tr");

    const timeTd = document.createElement("td");
    timeTd.className = "time-cell";
    timeTd.innerHTML = `<input data-row="${rIdx}" class="time-input" value="${row.time}" />
      <div class="row-actions"><button data-del-row="${rIdx}">Xóa dòng</button></div>`;
    tr.appendChild(timeTd);

    row.cells.forEach((cell, cIdx) => {
      const td = document.createElement("td");
      td.className = `cell tag-${cell.tag}`;
      const dots = TAGS.map(
        (t) =>
          `<span class="tag-dot dot-${t.key} ${cell.tag === t.key ? "active" : ""}" data-row="${rIdx}" data-col="${cIdx}" data-tag="${t.key}" title="${t.label}"></span>`,
      ).join("");
      td.innerHTML = `
        <div class="tag-row">${dots}</div>
        <textarea data-row="${rIdx}" data-col="${cIdx}" placeholder="Bấm để nhập...">${cell.text}</textarea>
      `;
      tr.appendChild(td);
    });

    body.appendChild(tr);
  });

  attachEvents();
}

function attachEvents() {
  document.getElementById("mainTitle").oninput = (e) => {
    data.title = e.target.textContent;
    scheduleSave();
  };

  document.querySelectorAll(".day-input").forEach((inp) => {
    inp.oninput = (e) => {
      DAYS[+e.target.dataset.day] = e.target.value;
      scheduleSave();
    };
  });

  document.querySelectorAll(".time-input").forEach((inp) => {
    inp.oninput = (e) => {
      data.rows[+e.target.dataset.row].time = e.target.value;
      scheduleSave();
    };
  });

  document.querySelectorAll("textarea").forEach((ta) => {
    ta.oninput = (e) => {
      const r = +e.target.dataset.row,
        c = +e.target.dataset.col;
      data.rows[r].cells[c].text = e.target.value;
      scheduleSave();
    };
  });

  document.querySelectorAll(".tag-dot").forEach((dot) => {
    dot.onclick = (e) => {
      const r = +e.target.dataset.row,
        c = +e.target.dataset.col,
        tag = e.target.dataset.tag;
      data.rows[r].cells[c].tag = tag;
      scheduleSave();
      render();
    };
  });

  document.querySelectorAll("[data-del-row]").forEach((btn) => {
    btn.onclick = (e) => {
      const r = +e.target.dataset.delRow;
      if (data.rows.length <= 1) return;
      data.rows.splice(r, 1);
      scheduleSave();
      render();
    };
  });
}

document.getElementById("addRowBtn").onclick = () => {
  data.rows.push({
    time: "Giờ mới",
    cells: DAYS.map(() => ({ text: "", tag: "none" })),
  });
  scheduleSave();
  render();
};

document.getElementById("resetBtn").onclick = () => {
  if (confirm("Đặt lại toàn bộ về mẫu gốc? Mọi chỉnh sửa hiện tại sẽ mất.")) {
    data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    scheduleSave();
    render();
  }
};

loadData();
