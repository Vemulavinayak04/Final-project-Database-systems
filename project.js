// Script for Tax and Payment Tracker

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("record-form");
    const recordsTableBody = document.querySelector("#records-table tbody");

    // Function to fetch all records
    async function fetchRecords() {
        try {
            const response = await fetch("/records");
            const records = await response.json();
            renderRecords(records);
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    }

    // Function to render records in the table
    function renderRecords(records) {
        recordsTableBody.innerHTML = ""; // Clear existing rows
        records.forEach(record => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${record[0]}</td>
                <td>${record[1]}</td>
                <td>${record[2]}</td>
                <td>${record[3]}</td>
                <td>${record[4]}</td>
                <td>${record[5]}</td>
                <td>
                    <button class="edit-btn" data-id="${record[0]}">Edit</button>
                    <button class="delete-btn" data-id="${record[0]}">Delete</button>
                </td>
            `;
            recordsTableBody.appendChild(row);
        });

        attachEventListeners();
    }

    // Function to handle form submission
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            await fetch("/record", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            form.reset();
            fetchRecords();
        } catch (error) {
            console.error("Error adding record:", error);
        }
    });

    // Function to attach event listeners to edit and delete buttons
    function attachEventListeners() {
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEdit);
        });
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
    }

    // Handle record editing
    async function handleEdit(event) {
        const recordId = event.target.dataset.id;
        const recordRow = event.target.closest("tr");
        const [id, category, amount, date, type, description] = Array.from(recordRow.children).map(td => td.textContent);

        // Prefill the form with existing data
        form.elements["category"].value = category;
        form.elements["amount"].value = amount;
        form.elements["record_date"].value = date;
        form.elements["record_type"].value = type;
        form.elements["description"].value = description;

        // Update submission behavior
        form.removeEventListener("submit", handleFormSubmit);
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            try {
                await fetch(`/record/${recordId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                form.reset();
                fetchRecords();
            } catch (error) {
                console.error("Error updating record:", error);
            }
        }, { once: true });
    }

    // Handle record deletion
    async function handleDelete(event) {
        const recordId = event.target.dataset.id;

        try {
            await fetch(`/record/${recordId}`, {
                method: "DELETE",
            });
            fetchRecords();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    }

    // Initial fetch of records
    fetchRecords();
});
