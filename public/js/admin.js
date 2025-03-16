document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script admin.js chargé !");

    // ✅ Ouvrir la pop-up de modification avec affichage en plein écran
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", function () {
            const prestationId = this.dataset.id;
            const row = this.closest("tr");

            document.getElementById("editId").value = prestationId;
            document.getElementById("editNom").value = row.children[0].innerText;
            document.getElementById("editNiveau").value = row.children[1].innerText;
            document.getElementById("editPrixSansDepose").value = row.children[2].innerText.replace("€", "");
            document.getElementById("editPrixAvecDepose").value = row.children[3].innerText.replace("€", "");
            document.getElementById("editPrixDeposeAilleurs").value = row.children[4].innerText.replace("€", "");
            document.getElementById("editTempsSansDepose").value = row.children[5].innerText;
            document.getElementById("editTempsAvecDepose").value = row.children[6].innerText;
            document.getElementById("editCalendlySansDepose").value = row.children[7].innerText;
            document.getElementById("editCalendlyAvecDepose").value = row.children[8].innerText;
            document.getElementById("editCalendlyDeposeAilleurs").value = row.children[9].innerText;

            // ✅ Appliquer les styles pour s'assurer que la pop-up est bien visible
            const modal = document.getElementById("editModal");
            modal.style.display = "flex";
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
        });
    });

    // ✅ Fermer la pop-up de modification
    document.querySelector(".close").addEventListener("click", function () {
        document.getElementById("editModal").style.display = "none";
    });

    // ✅ Gestion de la soumission du formulaire de modification
    document.getElementById("editForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const prestationId = document.getElementById("editId").value;
        const formData = {
            nom: document.getElementById("editNom").value,
            niveau: document.getElementById("editNiveau").value,
            prix_sans_depose: document.getElementById("editPrixSansDepose").value,
            prix_avec_depose: document.getElementById("editPrixAvecDepose").value,
            prix_depose_ailleurs: document.getElementById("editPrixDeposeAilleurs").value,
            temps_sans_depose: document.getElementById("editTempsSansDepose").value,
            temps_avec_depose: document.getElementById("editTempsAvecDepose").value,
            calendly_url_sans_depose: document.getElementById("editCalendlySansDepose").value,
            calendly_url_avec_depose: document.getElementById("editCalendlyAvecDepose").value,
            calendly_url_depose_ailleurs: document.getElementById("editCalendlyDeposeAilleurs").value
        };

        fetch(`/admin/update-prestation/${prestationId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        }).then(() => location.reload());
    });
});