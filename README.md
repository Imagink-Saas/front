# 🎨 Imagink - Plateforme de Génération d'Images IA & Print-on-Demand

## 📋 Vue d'ensemble du Projet

**Imagink** est une plateforme complète de génération d'images par IA et de création de produits personnalisés (print-on-demand). Le projet suit une architecture microservices moderne avec un frontend Next.js et plusieurs services backend spécialisés.

### 🎯 Fonctionnalités Principales
- **Génération d'images IA** avec Stability AI (Stable Diffusion 3.5)
- **Stockage sécurisé** des images via Supabase
- **Création de produits** personnalisés via Printify (T-shirts, mugs, etc.)
- **Système de crédits** avec paiements Stripe
- **Notifications automatiques** par email
- **Interface moderne** et responsive

## 🏗️ Architecture Microservices

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Service IA     │    │ Service Images  │
│   (Next.js)     │◄──►│  (Port 9000)    │◄──►│  (Port 5002)    │
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Service Payment │    │ Service BDD     │    │ Service Printify│
│ (Port 9001)     │    │ (Port 9002)     │    │ (Port 3004)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Service Notif.   │    │   Supabase      │    │   Printify      │
│(Port 3005)      │    │  (Storage/DB)   │    │   (External)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔗 Repositories des Services

### 🎨 Frontend (Ce repository)
- **Repository** : [front](https://github.com/Imagink-Saas/front)
- **Technologies** : Next.js 15, React 19, Tailwind CSS, Clerk
- **Port** : 3000
- **Description** : Interface utilisateur moderne pour la génération d'images et la gestion des produits

### 🤖 Service IA - Génération d'Images
- **Repository** : [ia-service](https://github.com/Imagink-Saas/ia-service)
- **Technologies** : Node.js, Express, Stability AI API
- **Port** : 9000
- **Description** : Service de génération d'images avec Stable Diffusion 3.5 Large

### 🖼️ Service Images - Stockage
- **Repository** : [image-service](https://github.com/Imagink-Saas/image-service)
- **Technologies** : Node.js, Express, Supabase Storage
- **Port** : 5002
- **Description** : Gestion et stockage des images générées par IA

### 🗄️ Service BDD - Base de Données
- **Repository** : [Bdd-service](https://github.com/Imagink-Saas/Bdd-service)
- **Technologies** : Node.js, Express, PostgreSQL, Prisma ORM
- **Port** : 9002
- **Description** : Service de base de données centralisée pour les métadonnées

### 🎨 Service Printify - Print-on-Demand
- **Repository** : [printify-service](https://github.com/Imagink-Saas/printify-service)
- **Technologies** : Node.js, Express, Printify API
- **Port** : 3004
- **Description** : Création de produits personnalisés via Printify

### 💳 Service Payment - Paiements
- **Repository** : [payment-service](https://github.com/Imagink-Saas/payment-service)
- **Technologies** : Node.js, Express, Stripe
- **Port** : 9001
- **Description** : Gestion des paiements et système de crédits

### 📧 Service Notifications
- **Repository** : [notifications-service](https://github.com/Imagink-Saas/notifications-service)
- **Technologies** : Node.js, Express, Nodemailer, Clerk Webhooks
- **Port** : 3005
- **Description** : Notifications par email automatiques

### 📊 Service Métriques (Optionnel)
- **Repository** : [metrics-service](https://github.com/Imagink-Saas/metrics-service)
- **Technologies** : Prometheus, Grafana
- **Description** : Monitoring et métriques des services

## 🔄 Workflow Complet

### 1. **Génération d'Image**
```
Frontend → Service IA → Service Images → Supabase + Service BDD
    ↓           ↓           ↓              ↓
Saisie    Génération   Stockage      Persistance
Prompt    IA          Image         Métadonnées
```

### 2. **Création de Produit**
```
Frontend → Service Printify → Service BDD → Supabase
    ↓           ↓              ↓           ↓
Sélection  Création      Enregistrement  Stockage
Image      Produit       Métadonnées     Fichiers
```

### 3. **Système de Paiement**
```
Frontend → Service Payment → Stripe → Webhook → Service BDD
    ↓           ↓            ↓        ↓         ↓
Achat      Création      Paiement  Confirmation Ajout
Crédits    Session       Sécurisé  Automatique  Crédits
```

## 🚀 Installation & Configuration

### 🔐 **Configuration Infisical (Recommandé)**

Le projet utilise **Infisical** pour la gestion sécurisée des variables d'environnement au lieu des fichiers `.env`.

#### **1. Installer Infisical CLI**
```bash
# macOS avec Homebrew
brew install infisical

# Ou avec npm
npm install -g infisical
```

#### **2. Configurer le token Infisical**
```bash
# Définir le token Infisical pour ce projet
export INFISICAL_TOKEN="st.72dc82a3-8735-438b-85fa-58f7c7d3cf8d.032a259cf84495e0717ee1998b13c078.ad1080a1dfa5c471ce65a36db60130e8"

# Vérifier la configuration
infisical secrets ls --env=dev --path=/front
```

#### **3. Démarrer le projet avec Infisical**
```bash
# Mode développement avec Infisical
npm run dev:infisical

# Mode production avec Infisical
npm run build:infisical
npm run start:infisical
```

### 🏠 **Installation standard**

#### **1. Cloner le repository**
```bash
git clone https://github.com/Imagink-Saas/front.git
cd front
```

#### **2. Installer les dépendances**
```bash
npm install
```

#### **3. Démarrer le projet**
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm run start
```

Le frontend sera accessible sur `http://localhost:3000`

## ⚙️ **Variables d'Environnement (Infisical)**

### **🔧 Variables requises dans Infisical**

```bash
# Configuration des services
NEXT_PUBLIC_IA_SERVICE_URL=http://localhost:9000
NEXT_PUBLIC_IMAGE_SERVICE_URL=http://localhost:5002
NEXT_PUBLIC_BDD_SERVICE_URL=http://localhost:9002
NEXT_PUBLIC_PRINTIFY_SERVICE_URL=http://localhost:3004
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:9001

# Configuration Clerk (Authentification)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Configuration Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Configuration Stability AI
STABILITY_API_KEY=sk-...
```

### **🔐 Gestion des secrets avec Infisical**

```bash
# Lister les variables configurées
infisical secrets ls --env=dev --path=/front

# Ajouter une nouvelle variable
infisical secrets set NEXT_PUBLIC_IA_SERVICE_URL=http://localhost:9000 --env=dev --path=/front

# Mettre à jour une variable
infisical secrets set NEXT_PUBLIC_IA_SERVICE_URL=https://new-url.com --env=dev --path=/front

# Supprimer une variable
infisical secrets delete NEXT_PUBLIC_IA_SERVICE_URL --env=dev --path=/front
```

## 🧪 **Tests**

### **Tests avec Infisical**
```bash
# Tests avec variables Infisical
npm run test:infisical

# Tests de couverture avec Infisical
npm run test:coverage:infisical

# Tests en mode watch avec Infisical
npm run test:watch:infisical
```

### **Tests standard**
```bash
# Tests unitaires
npm test

# Tests de couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 🔄 **Déploiement**

### **Déploiement avec Infisical**
```bash
# Build avec Infisical
npm run build:infisical

# Démarrage avec Infisical
npm run start:infisical
```

### **Déploiement standard**
```bash
# Build standard
npm run build

# Démarrage standard
npm run start
```

## 📧 Notifications
- Notifications automatiques par email
- Confirmation de génération d'image
- Confirmation de création de produit

## 🔧 Communication avec les Services

### Service IA
```typescript
// Génération d'image
const response = await fetch(`${process.env.NEXT_PUBLIC_IA_SERVICE_URL}/api/images/generate`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${await getToken()}`
  },
  body: JSON.stringify({ prompt, options })
});
```

### Service Images
```typescript
// Récupération des images
const response = await fetch(
  `${process.env.NEXT_PUBLIC_IMAGE_SERVICE_URL}/api/images?page=${page}&limit=${limit}`,
  {
    headers: {
      'Authorization': `Bearer ${await getToken()}`
    }
  }
);
```

### Service BDD
```typescript
// Récupération des produits
const response = await fetch(
  `${process.env.NEXT_PUBLIC_BDD_SERVICE_URL}/api/products?userId=${userId}`
);
```

### Service Printify
```typescript
// Création de produit
const response = await fetch('/api/printify/product/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${clerkToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

### Service Payment
```typescript
// Achat de crédits
const response = await fetch('/api/payment/create-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ packageId, userId })
});
```

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Palette cohérente
- **Typographie** : Inter pour une meilleure lisibilité
- **Espacement** : Système de spacing Tailwind
- **Composants** : Design system unifié

### Responsive Design
- **Mobile First** : Optimisé pour mobile
- **Tablette** : Adaptation pour écrans moyens
- **Desktop** : Interface complète pour grands écrans

## 📊 Gestion d'État

### React Hooks
```typescript
// Hook personnalisé pour les images
export function useImages(userId: string) {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getUserImages(userId)
      setImages(data.images)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])
  
  return { images, loading, error, fetchImages }
}
```

### Context API
```typescript
// Context pour les crédits utilisateur
export const UserCreditsContext = createContext<UserCreditsContextType | undefined>(undefined)

export function UserCreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  
  return (
    <UserCreditsContext.Provider value={{ credits, setCredits, loading, setLoading }}>
      {children}
    </UserCreditsContext.Provider>
  )
}
```

## 🔐 **Sécurité avec Infisical**

### **Avantages d'Infisical**
- **Gestion centralisée** des secrets
- **Chiffrement** des variables sensibles
- **Synchronisation** entre équipes
- **Audit trail** des modifications
- **Intégration** avec les outils de déploiement

### **Bonnes pratiques**
- **Ne jamais commiter** de tokens ou clés API
- **Utiliser Infisical** pour tous les secrets
- **Rotation régulière** des clés
- **Accès limité** aux secrets sensibles

## 🚀 **Évolution future**

- [x] **Migration vers Infisical** ✅
- [x] **Architecture microservices** ✅
- [x] **Interface moderne** ✅
- [ ] Support multi-langues
- [ ] Mode hors ligne
- [ ] PWA (Progressive Web App)
- [ ] Analytics avancés
- [ ] Tests E2E

## 🎉 **Statut actuel**

**✅ FRONTEND OPÉRATIONNEL AVEC INFISICAL**

- **Configuration** : Gestion sécurisée des secrets via Infisical
- **Architecture** : Microservices bien intégrés
- **Interface** : Moderne et responsive
- **Tests** : Couverture complète
- **Déploiement** : Prêt pour la production

---

**🎨 Le frontend Imagink est maintenant entièrement configuré avec Infisical pour une gestion sécurisée des variables d'environnement !**