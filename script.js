let shareCount = 0;
const maxShares = 5;

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("formSubmitted") === "true") {
    disableForm("🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!");
  }

  document.getElementById("whatsappShare").addEventListener("click", () => {
    if (shareCount < maxShares) {
      shareCount++;
      document.getElementById("shareCounter").innerText = `Click count: ${shareCount}/5`;
      const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community");
      window.open(`https://wa.me/?text=${message}`, "_blank");

      if (shareCount === maxShares) {
        document.getElementById("messageBox").innerText = "Sharing complete. Please continue.";
      }
    }
  });

  document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (shareCount < maxShares) {
      alert("Please complete WhatsApp sharing first (5 times).");
      return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const college = document.getElementById("college").value;
    const file = document.getElementById("screenshot").files[0];

    if (!file) {
      alert("Please upload a screenshot.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const base64Data = reader.result.split(',')[1];
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("college", college);
      formData.append("screenshotData", base64Data);
      formData.append("fileName", file.name);
      formData.append("fileType", file.type);

      try {
        const response = await fetch("YOUR_GOOGLE_SCRIPT_URL", {
          method: "POST",
          body: formData
        });

        const result = await response.text();
        if (result.includes("Success")) {
          disableForm("🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!");
          localStorage.setItem("formSubmitted", "true");
        } else {
          alert("Submission failed: " + result);
        }
      } catch (error) {
        alert("Submission failed: " + error.message);
      }
    };

    reader.readAsDataURL(file);
  });
});

function disableForm(message) {
  document.querySelectorAll("input, button").forEach(el => el.disabled = true);
  document.getElementById("messageBox").innerText = message;
}
