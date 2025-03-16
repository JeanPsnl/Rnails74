document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Script reservation.js chargé");

    const form = document.getElementById("reservationForm");

    if (!form) {
        console.error("❌ Erreur : Formulaire introuvable !");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêche le rechargement de la page

        const deposeElement = document.getElementById("depose");
        const poseAilleursElement = document.getElementById("poseAilleurs");
        const prestationElement = document.getElementById("prestation");

        if (!deposeElement || !poseAilleursElement || !prestationElement) {
            console.error("❌ Erreur : Un ou plusieurs champs du formulaire sont introuvables !");
            return;
        }

        const depose = deposeElement.value;
        const poseAilleurs = poseAilleursElement.value;
        const prestation = prestationElement.value;

        console.log("📩 Envoi des données :", { depose, poseAilleurs, prestation });

        fetch("/reservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ depose, poseAilleurs, prestation })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Réponse reçue :", data);
            if (data.success && data.widget) {
                console.log("🚀 Redirection vers confirmation avec :", data.widget, prestation);
window.location.href = `/confirmation/${encodeURIComponent(data.widget)}?prestationId=${prestation}`;
            } else {
                alert("❌ Erreur : Impossible de récupérer le widget");
            }
        })
        .catch(error => {
            console.error("❌ Erreur requête :", error);
            alert("❌ Une erreur est survenue lors de la réservation.");
        });
    });
});