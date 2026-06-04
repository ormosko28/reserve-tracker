let totalDays = 0;

window.onload = function () {
    loadActivities();
};

async function addDay() {

    const date = document.getElementById("date").value;
    const unit = document.getElementById("unit").value;
    const activity = document.getElementById("activity").value;
    const days = document.getElementById("days").value;

    if (!date || !unit || !days) {
        alert("יש למלא את כל השדות");
        return;
    }

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

        await response.json();

        document.getElementById("date").value = "";
        document.getElementById("unit").value = "";
        document.getElementById("activity").value = "";
        document.getElementById("days").value = "";

        await loadActivities();

    } catch (error) {

        alert("שגיאה: " + error.message);
    }
}

async function loadActivities() {

    try {

        const response = await fetch(
            "https://0w8ortde9e.execute-api.us-east-1.amazonaws.com/activities"
        );

        const data = await response.json();

        const tableBody = document.getElementById("tableBody");

        tableBody.innerHTML = "";

        totalDays = 0;

        data.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.date}</td>
                <td>${item.unit}</td>
                <td>${item.activity}</td>
                <td>${item.days}</td>
                <td>
                    <button onclick="deleteRow('${item.soldierId}', ${item.days})">
                        מחק
                    </button>
                </td>
            `;

            tableBody.appendChild(row);

            totalDays += Number(item.days);
        });

        updateTotal();

    } catch (error) {

        console.error(error);
        alert("שגיאה בטעינת הנתונים");
    }
}

function updateTotal() {

    document.getElementById("totalDays").innerText =
        'סה"כ ימי מילואים: ' + totalDays;
}

async function deleteRow(soldierId, days) {

    try {

        await fetch(
            `https://0w8ortde9e.execute-api.us-east-1.amazonaws.com/activity/${soldierId}`,
            {
                method: "DELETE"
            }
        );

        await loadActivities();

    } catch (error) {

        alert("שגיאה במחיקה");
    }
}
