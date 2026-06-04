let totalDays = 0;

window.onload = function () {

     loadActivities();
};

async function addDay() {
    alert("גרסה חדשה");

    const date = document.getElementById("date").value;
    const unit = document.getElementById("unit").value;
    const activity = document.getElementById("activity").value;
    const days = document.getElementById("days").value;

    if (!date || !unit || !days) {
        alert("יש למלא את כל השדות");
        return;
    }

    addRow(date, unit, activity, days);

    totalDays += Number(days);

    updateTotal();

    alert("מגיע ל-fetch");

    try {

        const response = await fetch(
            "https://0w8ortde9e.execute-api.us-east-1.amazonaws.com/activity",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date,
                    unit,
                    activity,
                    days
                })
            }
        );

        const data = await response.text();

        alert("תשובת שרת: " + data);

    } catch (error) {

        alert("שגיאה: " + error.message);
    }

    document.getElementById("date").value = "";
    document.getElementById("unit").value = "";
    document.getElementById("activity").value = "";
    document.getElementById("days").value = "";
}

function addRow(date, unit, activity, days) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${date}</td>
        <td>${unit}</td>
        <td>${activity}</td>
        <td>${days}</td>
        <td>
            <button onclick="deleteRow(this, ${days})">
                מחק
            </button>
        </td>
    `;

    document.getElementById("tableBody")
        .appendChild(row);
}

function updateTotal() {

    document.getElementById("totalDays").innerText =
        'סה"כ ימי מילואים: ' + totalDays;
}

function deleteRow(button, days) {

    button.parentElement.parentElement.remove();

    totalDays -= Number(days);

    updateTotal();
}
async function loadActivities() {

    try {

        const response = await fetch(
            "https://0w8ortde9e.execute-api.us-east-1.amazonaws.com/activities"
        );

        const data = await response.json();

        document.getElementById("tableBody").innerHTML = "";

        totalDays = 0;

        data.forEach(item => {

            addRow(
                item.date,
                item.unit,
                item.activity,
                item.days
            );

            totalDays += Number(item.days);
        });

        updateTotal();

    } catch (error) {

        alert("שגיאה בטעינת הנתונים");
    }
}

