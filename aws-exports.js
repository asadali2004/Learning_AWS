import { API, Amplify } from 'aws-amplify';
import awsExports from './aws-exports';  // Ensure this file exists

Amplify.configure(awsExports); // Correctly configure Amplify

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await API.get("https://0yiywbf4kb.execute-api.ap-south-1.amazonaws.com/dev", "/get"); // Ensure API name is correct

        const tableBody = document.getElementById("subscriberList");
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = `<tr>
                <td>${user.UserID}</td>
                <td>${user.Email}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching subscribers:", error);
    }
});
