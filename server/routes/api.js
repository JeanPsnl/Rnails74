const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Connexion à MySQL

// Récupérer toutes les prestations
router.get("/prestations", (req, res) => {
    db.query("SELECT * FROM prestations", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Ajouter une nouvelle prestation (Admin)
router.post("/admin/prestations", (req, res) => {
    const { nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs } = req.body;

    // Vérifier si tous les champs sont remplis
    if (!nom || !niveau || !prix_sans_depose || !prix_avec_depose || !prix_depose_ailleurs || !temps_sans_depose || !temps_avec_depose || !calendly_url_sans_depose || !calendly_url_avec_depose || !calendly_url_depose_ailleurs) {
        return res.status(400).json({ success: false, message: "Tous les champs doivent être remplis !" });
    }

    const query = `
        INSERT INTO prestations (nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.redirect("/admin"); // Redirige correctement vers la page admin
    });
});

// Modifier une prestation (Admin)
router.post("/admin/update-prestation/:id", (req, res) => {
    const { id } = req.params;
    const { nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs } = req.body;

    if (!nom || !niveau || !prix_sans_depose || !prix_avec_depose || !prix_depose_ailleurs) {
        return res.status(400).json({ success: false, message: "Tous les champs doivent être remplis !" });
    }

    const query = `
        UPDATE prestations 
        SET nom = ?, niveau = ?, prix_sans_depose = ?, prix_avec_depose = ?, prix_depose_ailleurs = ? 
        WHERE id = ?
    `;

    db.query(query, [nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Prestation mise à jour !" });
    });
});

// Supprimer une prestation (Admin)
router.delete("/admin/delete-prestation/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM prestations WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Prestation supprimée !" });
    });
});

module.exports = router;