document.getElementById("loginBtn").onclick = async () => {
  const res = await fetch("http://localhost:3000/authUrl");
  const data = await res.json();
  window.open(data.url, "_blank");
};

document.getElementById("refreshBtn").onclick = fetchEvents;
document.getElementById("addEventBtn").onclick = addEvent;
document.getElementById("updateEventBtn").onclick = updateEvent;
document.getElementById("deleteEventBtn").onclick = deleteEvent;

async function fetchEvents() {
  const res = await fetch("http://localhost:3000/events");
  const events = await res.json();

  const list = document.getElementById("eventsList");
  list.innerHTML = "";

  events.forEach((e) => {
    const li = document.createElement("li");
    li.textContent = `${e.summary} — ${e.start?.dateTime || "No date"}`;
    list.appendChild(li);
  });
}

async function addEvent() {
  const summary = prompt("Event title:");
  const start = prompt("Start (YYYY-MM-DDTHH:MM:SS)");
  const end = prompt("End (YYYY-MM-DDTHH:MM:SS)");

  if (!summary || !start || !end) return;

  const res = await fetch("http://localhost:3000/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary,
      startTime: start,
      endTime: end,
    }),
  });

  const data = await res.json();
  alert("✅ Event added: " + data.summary);
  fetchEvents();
}

async function updateEvent() {
  const res = await fetch("http://localhost:3000/events", { method: "PUT" });
  const data = await res.json();
  alert("✏️ Updated: " + data.summary);
  fetchEvents();
}

async function deleteEvent() {
  const res = await fetch("http://localhost:3000/events", { method: "DELETE" });
  const data = await res.json();
  alert(data.message);
  fetchEvents();
}
