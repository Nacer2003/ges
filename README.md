# StockPro - Application de Gestion de Stock Multi-Magasin

## 📋 Description

StockPro est une application web moderne de gestion de stock multi-magasin conçue pour un usage professionnel. Elle utilise React (frontend) et Django avec MySQL (backend).

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- JWT Authentication avec Django
- Application 100% privée (accès authentifié uniquement)
- Gestion de rôles : **admin** et **employé**
- Protection des routes selon les rôles
- Redirections automatiques selon le statut de connexion

### 👨‍💼 Gestion des Présences
- Pointage avec vérification de géolocalisation (rayon de 100m)
- Prévention du pointage frauduleux
- Historique des présences pour les administrateurs

### 📦 Gestion des Données
- **Produits** : CRUD complet avec images
- **Magasins** : Gestion avec coordonnées GPS
- **Fournisseurs** : CRUD complet
- **Stock** : Gestion par magasin avec alertes de seuil
- **Commandes** : Suivi des commandes fournisseurs

### 📊 Dashboard & Statistiques
- Tableau de bord administrateur avec graphiques (Recharts)
- Statistiques de stock et valeur
- Alertes visuelles pour les ruptures de stock
- Dashboard employé simplifié

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** pour le styling
- **React Router DOM** pour la navigation
- **Recharts** pour les graphiques
- **Lucide React** pour les icônes

### Backend
- **Django 4.2** + Django REST Framework
- **MySQL** (via XAMPP)
- **JWT Authentication**
- **Stockage local** des images
- **CORS** configuré pour React

## 🚀 Installation

### Prérequis
- Node.js 18+
- Python 3.8+
- XAMPP avec MySQL

### 1. Backend Django

```bash
# Aller dans le dossier backend
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données
cp .env.example .env
# Éditer .env avec vos paramètres MySQL

# Initialiser la base de données
python setup_database.py

# Démarrer le serveur Django
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### 2. Frontend React

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 👥 Comptes par défaut

Après l'installation du backend, un compte administrateur est créé :

- **Email** : `admin@stockpro.com`
- **Mot de passe** : `admin123`
- **Rôle** : Administrateur

⚠️ **Important** : Changez ce mot de passe en production !

## 📊 Structure de la base de données

### Tables principales

1. **accounts_user** - Utilisateurs avec authentification JWT
2. **stores_magasin** - Magasins avec coordonnées GPS
3. **products_produit** - Produits avec images
4. **suppliers_fournisseur** - Fournisseurs
5. **stock_stock** - Stocks par magasin
6. **stock_mouvement** - Mouvements de stock
7. **attendance_presence** - Présences/pointages
8. **messaging_message** - Messages entre utilisateurs

## 🔄 API Endpoints

### Authentification
```
POST /api/auth/login/          # Connexion
POST /api/auth/logout/         # Déconnexion
GET  /api/auth/me/             # Utilisateur actuel
```

### Produits
```
GET    /api/products/           # Liste des produits
POST   /api/products/           # Créer un produit
PUT    /api/products/{id}/      # Modifier un produit
DELETE /api/products/{id}/      # Supprimer un produit
```

### Magasins
```
GET    /api/stores/             # Liste des magasins
POST   /api/stores/             # Créer un magasin
PUT    /api/stores/{id}/        # Modifier un magasin
DELETE /api/stores/{id}/        # Supprimer un magasin
```

### Stock
```
GET    /api/stock/stocks/       # Liste des stocks
POST   /api/stock/stocks/       # Créer un stock
GET    /api/stock/mouvements/   # Liste des mouvements
POST   /api/stock/mouvements/   # Créer un mouvement
```

## 📁 Gestion des fichiers

Les images sont stockées localement dans Django :
- **Dossier** : `backend/media/`
- **URL** : `http://localhost:8000/media/...`

## 🔒 Sécurité

- **JWT Authentication** : Tokens sécurisés avec rotation
- **Géolocalisation sécurisée** : Pointage uniquement sur site (100m)
- **Rôles stricts** : Permissions selon le profil utilisateur
- **Protection CORS** : Accès contrôlé depuis React

## 🚢 Déploiement

### Production
1. Configurer une base de données MySQL de production
2. Mettre à jour les variables d'environnement
3. Collecter les fichiers statiques Django : `python manage.py collectstatic`
4. Builder React : `npm run build`
5. Configurer un serveur web (Nginx + Gunicorn)

## 📝 Notes Importantes

- **Pas de dépendances externes** : Plus de Firebase ou Cloudinary
- **Géolocalisation requise** : Le pointage nécessite l'autorisation GPS
- **Images optimisées** : Stockage local via Django
- **Responsive design** : Compatible mobile et desktop

## 🤝 Support

Pour toute question :
1. Vérifiez que XAMPP MySQL est démarré
2. Vérifiez la configuration dans `.env`
3. Consultez les logs Django et React
4. Vérifiez les URLs d'API dans le frontend

---

**StockPro** - Solution professionnelle 100% Django + React