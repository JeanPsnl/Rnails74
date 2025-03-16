const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();

// Configuration du moteur de template
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à la base de données MySQL avec un pool de connexions
const db = mysql.createPool({
    host: "82.29.168.143", // Vérifie bien que MySQL tourne ici
    user: "root",
    password: "Romanesite74#", // Mets ton vrai mot de passe MySQL
    database: "rnails",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Servir les fichiers statiques
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Route de vérification du bon fonctionnement du serveur
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
app.get("/admin", async (req, res) => {
    try {
        console.log("🔄 Tentative d'affichage de la page admin...");

        // Récupération des prestations
        const [prestations] = await db.execute("SELECT * FROM prestations");
        console.log("✅ Prestations récupérées :", prestations);

        // Affichage de la page admin avec les prestations
        res.render("admin", { prestations });

    } catch (error) {
        console.error("❌ Erreur chargement Admin :", error);
        res.status(500).send("Erreur serveur (Admin)");
    }
});
app.post("/admin/prestations", async (req, res) => {
    try {
        const { nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs } = req.body;

        if (!nom || !niveau || !prix_sans_depose || !prix_avec_depose || !prix_depose_ailleurs || !temps_sans_depose || !temps_avec_depose || !calendly_url_sans_depose || !calendly_url_avec_depose || !calendly_url_depose_ailleurs) {
            return res.status(400).json({ success: false, message: "Tous les champs doivent être remplis !" });
        }

        const query = `
            INSERT INTO prestations (nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(query, [nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs]);

        res.json({ success: true });

    } catch (error) {
        console.error("❌ Erreur lors de l'ajout d'une prestation :", error);
        res.status(500).json({ success: false, message: "Erreur serveur (Ajout prestation)" });
    }
});
app.post("/admin/update-prestation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs } = req.body;

        if (!nom || !niveau || !prix_sans_depose || !prix_avec_depose || !prix_depose_ailleurs || !temps_sans_depose || !temps_avec_depose || !calendly_url_sans_depose || !calendly_url_avec_depose || !calendly_url_depose_ailleurs) {
            return res.status(400).json({ success: false, message: "Tous les champs doivent être remplis !" });
        }

        const query = `
            UPDATE prestations 
            SET nom = ?, niveau = ?, prix_sans_depose = ?, prix_avec_depose = ?, prix_depose_ailleurs = ?, temps_sans_depose = ?, temps_avec_depose = ?, calendly_url_sans_depose = ?, calendly_url_avec_depose = ?, calendly_url_depose_ailleurs = ? 
            WHERE id = ?
        `;

        await db.execute(query, [nom, niveau, prix_sans_depose, prix_avec_depose, prix_depose_ailleurs, temps_sans_depose, temps_avec_depose, calendly_url_sans_depose, calendly_url_avec_depose, calendly_url_depose_ailleurs, id]);

        res.json({ success: true });

    } catch (error) {
        console.error("❌ Erreur lors de la modification d'une prestation :", error);
        res.status(500).json({ success: false, message: "Erreur serveur (Modification prestation)" });
    }
});
app.delete("/admin/delete-prestation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM prestations WHERE id = ?";
        await db.execute(query, [id]);

        res.json({ success: true });

    } catch (error) {
        console.error("❌ Erreur lors de la suppression d'une prestation :", error);
        res.status(500).json({ success: false, message: "Erreur serveur (Suppression prestation)" });
    }
});

// Test de connexion à MySQL
app.get("/test-db", async (req, res) => {
    try {
        console.log("🛠 Test de connexion MySQL...");
        const connection = await db.getConnection();
        console.log("✅ Connexion MySQL réussie !");
        connection.release(); // Libère la connexion
        res.status(200).send("Connexion MySQL OK !");
    } catch (error) {
        console.error("❌ Erreur de connexion MySQL :", error);
        res.status(500).send("Erreur MySQL : " + error.message);
    }
});

// Route principale (accueil)
app.get("/", (req, res) => {
    res.render("index");
});

// Route pour afficher les prestations
app.get("/prestations", async (req, res) => {
    try {
        console.log("🔄 Récupération des prestations...");
        const [prestations] = await db.execute("SELECT * FROM prestations");
        console.log("✅ Prestations récupérées :", prestations);
        res.render("prestations", { prestations });
    } catch (error) {
        console.error("❌ ERREUR SQL :", error);
        res.status(500).send("Erreur serveur (Prestations)");
    }
});

// Route pour afficher la page de réservation
app.get("/reservation", async (req, res) => {
    try {
        console.log("🔄 Chargement de la page de réservation...");
        const [prestations] = await db.execute("SELECT * FROM prestations");
        console.log("✅ Prestations chargées :", prestations);
        res.render("reservation", { prestations });
    } catch (error) {
        console.error("❌ ERREUR SQL :", error);
        res.status(500).send("Erreur serveur (Réservation)");
    }
});

// Route pour gérer la soumission du formulaire de réservation
app.post("/reservation", async (req, res) => {
    try {
        console.log("📩 Données reçues :", req.body);

        if (!req.body || !req.body.depose || !req.body.poseAilleurs || !req.body.prestation) {
            console.warn("⚠️ Erreur : Données du formulaire incomplètes !");
            return res.status(400).json({ success: false, message: "Données incomplètes" });
        }

        const { depose, poseAilleurs, prestation } = req.body;

        const [rows] = await db.execute("SELECT * FROM prestations WHERE id = ?", [prestation]);

        if (rows.length === 0) {
            console.warn("⚠️ Aucune prestation trouvée avec cet ID :", prestation);
            return res.status(404).json({ success: false, message: "Prestation non trouvée" });
        }

        const service = rows[0];
        let widget;

        if (depose === "Oui") {
            widget = poseAilleurs === "Oui" ? service.calendly_url_depose_ailleurs : service.calendly_url_avec_depose;
        } else {
            widget = service.calendly_url_sans_depose;
        }

        if (!widget) {
            console.error("❌ Aucun widget trouvé pour cette prestation.");
            return res.status(500).json({ success: false, message: "Aucun widget trouvé" });
        }

        console.log("✅ Widget sélectionné :", widget);
        res.json({ success: true, widget });
    } catch (error) {
        console.error("❌ Erreur lors du traitement de la réservation :", error);
        res.status(500).json({ success: false, message: "Erreur serveur (Réservation)" });
    }
});


// Route de confirmation avec paramètre prestation
app.get("/confirmation/:widget", async (req, res) => {
    try {
        const { widget } = req.params;
        const prestationId = req.query.prestationId; // Récupération via query params
        console.log("📩 ID de prestation reçu :", prestationId);

        const widgetUrl = decodeURIComponent(widget);

        if (!widgetUrl.startsWith("https://calendly.com/")) {
            return res.status(400).send("URL du widget invalide");
        }

        // Vérification si un ID de prestation est bien envoyé
        if (!prestationId) {
            return res.status(400).send("ID de prestation manquant.");
        }

        // 🔍 Récupération des infos de la prestation depuis MySQL
        const [rows] = await db.execute(
            "SELECT nom, temps_sans_depose, prix_sans_depose FROM prestations WHERE id = ?", 
            [prestationId]
        );

        if (rows.length === 0) {
            console.warn("⚠️ Aucune prestation trouvée avec l'ID :", prestationId);
            return res.status(404).send("Prestation non trouvée");
        }

        const prestation = rows[0];

        console.log("✅ Prestation trouvée :", prestation);

        // 🔄 Affichage de la page confirmation avec les infos de la prestation
        res.render("confirmation", { widget: widgetUrl, prestation });

    } catch (error) {
        console.error("❌ Erreur dans la route de confirmation :", error);
        res.status(500).send("Erreur serveur (Confirmation)");
    }
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).render("404", { url: req.originalUrl });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});