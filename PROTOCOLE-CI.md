# 📋 PROTOCOLE D'INTÉGRATION CONTINUE

**Nom du projet / application :** Frontend Imagink (Next.js)  
**Version :** 2.0.0  
**Date :** Août 2025  
**Responsable :** Malick Siguy NDIAYE  
**Participants :** Équipe de développement Imagink  

---

## 1. Introduction

Ce document décrit le protocole d'intégration continue (CI) de l'application **Frontend Imagink**. Il définit les environnements, les étapes de build et de tests, les outils utilisés, ainsi que les critères de validation.

**Objectif :** Garantir une base de code stable et de qualité en automatisant les vérifications à chaque modification du code source, avec un pipeline complet incluant le packaging Docker.

---

## 2. Environnements et Outils

### **🏗️ Gestion du code source :**
- **GitHub** (Organisation : Imagink-Saas)
- **Repository :** `front-MalicknND`
- **Branches :** `main`, `develop`, `feature/*`

### **🚀 Serveur CI :**
- **GitHub Actions** (intégré à GitHub)
- **Workflow :** `.github/workflows/ci.yml`
- **Environnement :** Ubuntu Latest

### **🔧 Outils de build :**
- **Node.js** : Version 20 LTS
- **npm** : Gestionnaire de paquets
- **Next.js** : Framework React avec mode standalone
- **Infisical CLI** : Gestion des variables d'environnement

### **🧪 Tests :**
- **Jest** : Framework de tests
- **React Testing Library** : Tests des composants
- **TypeScript** : Vérification des types

### **🔍 Qualité :**
- **ESLint** : Linting du code
- **Next.js ESLint** : Configuration intégrée
- **TypeScript** : Vérification statique

### **🐳 Containerisation :**
- **Docker** : Conteneurisation de l'application
- **Multi-stage build** : Optimisation des images
- **Infisical intégré** : Variables d'environnement sécurisées

---

## 3. Flux d'Intégration Continue

### **🔄 Étapes principales du pipeline CI :**

#### **Étape 1 : Vérification basique** ✅ IMPLÉMENTÉE
1. ✅ Commit & Push du code
2. ✅ Déclenchement automatique du pipeline CI
3. ✅ Checkout du code source
4. ✅ Installation des dépendances
5. ✅ Installation d'Infisical CLI
6. ✅ Vérification de l'environnement

#### **Étape 2 : Build et compilation** ✅ IMPLÉMENTÉE
7. ✅ Compilation / Build Next.js avec Infisical
8. ✅ Vérification des fichiers générés (.next/)
9. ✅ Validation du BUILD_ID
10. ✅ Vérification de la taille du build

#### **Étape 3 : Analyse statique** ✅ IMPLÉMENTÉE
11. ✅ Analyse statique du code (ESLint)
12. ✅ Vérification des règles qualité
13. ✅ Linting automatisé

#### **Étape 4 : Tests unitaires** ✅ IMPLÉMENTÉE
14. ✅ Exécution des tests Jest
15. ✅ Mesure de couverture de code
16. ✅ Validation des rapports de couverture

#### **Étape 5 : Packaging Docker** ✅ IMPLÉMENTÉE
17. ✅ Build de l'image Docker
18. ✅ Tests de l'image (Node.js, Infisical)
19. ✅ Validation de la fonctionnalité

---

## 4. Pipeline CI Implémenté (YAML)

### **🚀 Workflow CI Complet - 5 Étapes :**

```yaml
name: 🚀 CI Frontend - Tests, Lint & Build

on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: "20"

jobs:
  # 🔍 Étape 1 : Vérification basique
  basic-check:
    name: 🔍 Vérification basique
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4
        
      - name: 🟢 Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📦 Installation des dépendances
        run: npm ci
        
      - name: 🔧 Installation d'Infisical CLI
        run: npm install -g @infisical/cli
        
      - name: ✅ Vérification de l'installation
        run: |
          echo "✅ Vérification de l'installation :"
          echo "📁 Dossier courant : $(pwd)"
          echo "📦 Node modules : $(ls -la node_modules | wc -l) éléments"
          echo "🔧 Version Node : $(node --version)"
          echo "📦 Version npm : $(npm --version)"
          echo "📁 Fichiers du projet :"
          ls -la

  # 🏗️ Étape 2 : Build et compilation
  build:
    name: 🏗️ Build & Compilation
    runs-on: ubuntu-latest
    needs: [basic-check]
    
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4
        
      - name: 🟢 Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📦 Installation des dépendances
        run: npm ci
        
      - name: 🔧 Installation d'Infisical CLI
        run: npm install -g @infisical/cli
        
      - name: 🏗️ Build de production
        run: npm run build:infisical
        
      - name: 🔍 Vérification du build
        run: |
          echo "📁 Vérification des fichiers générés :"
          ls -la .next/
          echo "📊 Taille du build :"
          du -sh .next/
          echo "🔍 Vérification des chunks :"
          ls -la .next/static/chunks/ || echo "Aucun chunk trouvé"
          
      - name: ✅ Validation du build
        run: |
          if [ -d ".next" ]; then
            echo "✅ Build réussi - dossier .next créé"
            if [ -f ".next/BUILD_ID" ]; then
              echo "✅ BUILD_ID généré : $(cat .next/BUILD_ID)"
            fi
          else
            echo "❌ Build échoué - dossier .next manquant"
            exit 1
          fi

  # 🔍 Étape 3 : Analyse statique
  lint:
    name: 🔍 Linting ESLint
    runs-on: ubuntu-latest
    needs: [build]
    
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4
        
      - name: 🟢 Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📦 Installation des dépendances
        run: npm ci
        
      - name: 🔧 Installation d'Infisical CLI
        run: npm install -g @infisical/cli
        
      - name: 🔍 Linting ESLint
        run: npm run lint

  # 🧪 Étape 4 : Tests unitaires
  test:
    name: 🧪 Tests unitaires
    runs-on: ubuntu-latest
    needs: [lint]
    
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4
        
      - name: 🟢 Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📦 Installation des dépendances
        run: npm ci
        
      - name: 🔧 Installation d'Infisical CLI
        run: npm install -g @infisical/cli
        
      - name: 🧪 Exécution des tests Jest
        run: npm test
        
      - name: 📊 Vérification de la couverture
        run: |
          echo "📊 Couverture des tests :"
          if [ -f "coverage/lcov-report/index.html" ]; then
            echo "✅ Rapport de couverture généré"
            echo "📁 Dossier coverage créé"
            ls -la coverage/
          else
            echo "❌ Rapport de couverture manquant"
            exit 1
          fi

  # 📦 Étape 5 : Package Docker
  package:
    name: 📦 Package Docker
    runs-on: ubuntu-latest
    needs: [test]
    
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v4
        
      - name: 🟢 Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📦 Installation des dépendances
        run: npm ci
        
      - name: 🔧 Installation d'Infisical CLI
        run: npm install -g @infisical/cli
        
      - name: 🏗️ Build avec Infisical
        run: npm run build:infisical
        
      - name: 🐳 Build Docker
        run: |
          echo "🔨 Construction de l'image Docker..."
          docker build -t frontend:${{ github.sha }} .
          echo "✅ Image Docker construite"
          docker images frontend:test
          
      - name: ✅ Test Docker
        run: |
          echo "🧪 Test de l'image Docker..."
          docker run --rm frontend:${{ github.sha }} node --version
          docker run --rm frontend:${{ github.sha }} infisical --version
          echo "✅ Image Docker fonctionnelle"
```

---

## 5. Gestion des Erreurs

### **❌ Critères d'échec implémentés :**
- ❌ Échec si checkout impossible
- ❌ Échec si Node.js non disponible
- ❌ Échec si installation des dépendances impossible
- ❌ Échec si Infisical CLI non installable
- ❌ Échec si build Next.js impossible
- ❌ Échec si dossier .next manquant
- ❌ Échec si linting ESLint échoue
- ❌ Échec si tests unitaires échouent
- ❌ Échec si rapport de couverture manquant
- ❌ Échec si build Docker impossible
- ❌ Échec si tests Docker échouent

### **📋 Critères d'échec à implémenter :**
- 📋 Échec si taux de couverture < 80 %
- 📋 Échec si vulnérabilités critiques détectées
- 📋 Échec si taille de l'image Docker > seuil défini

---

## 6. Rapports et Notifications

### **📊 Rapports implémentés :**
- ✅ Affichage des informations d'installation
- ✅ Liste des fichiers du projet
- ✅ Versions des outils (Node.js, npm)
- ✅ Vérification des fichiers générés (.next/)
- ✅ Taille du build Next.js
- ✅ Validation du BUILD_ID
- ✅ Rapport de couverture des tests
- ✅ Informations sur l'image Docker
- ✅ Tests de fonctionnalité Docker

### **📋 Rapports à implémenter :**
- 📋 Rapport de build détaillé avec métriques
- 📋 Rapport de qualité du code (ESLint)
- 📋 Rapport de sécurité (npm audit)
- 📋 Rapport de performance Docker

### **🔔 Notifications à implémenter :**
- 📋 Notifications via Slack/Teams/Email
- 📋 Notifications en cas d'échec
- 📋 Notifications de succès
- 📋 Notifications de déploiement

---

## 7. Critères de Validation

### **✅ Critères implémentés :**
- ✅ Code checkouté sans erreur
- ✅ Dépendances installées correctement
- ✅ Node.js et npm disponibles
- ✅ Infisical CLI installé et fonctionnel
- ✅ Code compilé sans erreur (Next.js)
- ✅ Fichiers de build générés (.next/)
- ✅ BUILD_ID valide
- ✅ Linting ESLint réussi
- ✅ Tests unitaires passent
- ✅ Rapport de couverture généré
- ✅ Image Docker construite
- ✅ Tests Docker réussis

### **📋 Critères à implémenter :**
- 📋 Seuil minimal de couverture atteint (80%)
- 📋 Pas de vulnérabilités critiques
- 📋 Types TypeScript valides
- 📋 Performance Docker optimisée

---

## 8. Plan d'Implémentation Étape par Étape

### **🎯 Étape 1 : Vérification basique** ✅ TERMINÉE
- [x] Workflow GitHub Actions créé
- [x] Checkout du code
- [x] Installation des dépendances
- [x] Installation d'Infisical CLI
- [x] Vérification de l'environnement

### **🎯 Étape 2 : Build et compilation** ✅ TERMINÉE
- [x] Ajout de l'étape de build Next.js avec Infisical
- [x] Vérification des fichiers générés
- [x] Validation du BUILD_ID
- [x] Test de l'étape complète

### **🎯 Étape 3 : Analyse statique** ✅ TERMINÉE
- [x] Intégration d'ESLint
- [x] Linting automatisé
- [x] Test de l'étape complète

### **🎯 Étape 4 : Tests unitaires** ✅ TERMINÉE
- [x] Exécution des tests Jest
- [x] Mesure de la couverture
- [x] Validation des rapports
- [x] Test de l'étape complète

### **🎯 Étape 5 : Packaging Docker** ✅ TERMINÉE
- [x] Build de l'image Docker
- [x] Tests de l'image
- [x] Validation de la fonctionnalité
- [x] Test de l'étape complète

---

## 9. Configuration Docker

### **🐳 Dockerfile implémenté :**
```dockerfile
# Dockerfile simple pour Next.js avec Infisical
FROM node:20-alpine

# Install Infisical CLI
RUN npm install -g @infisical/cli

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:infisical

# Expose port
EXPOSE 3000

# Start with Infisical for environment variables
CMD ["infisical", "run", "--env=dev", "--path=/front", "--", "npm", "start"]
```

### **📁 Fichiers Docker :**
- ✅ **Dockerfile** : Configuration de l'image
- ✅ **.dockerignore** : Exclusion des fichiers inutiles
- ✅ **Scripts npm** : Commandes Docker intégrées

---

## 10. Test du Pipeline CI Complet

### **🧪 Comment tester :**

1. **Commit et push** du code sur la branche `main`, `develop` ou `feature/*`
2. **Vérifier** que le workflow se déclenche automatiquement
3. **Observer** l'exécution des 5 étapes dans l'onglet "Actions" de GitHub
4. **Vérifier** que tous les jobs passent avec succès

### **📊 Résultats attendus :**
- ✅ **Étape 1** : Vérification basique réussie
- ✅ **Étape 2** : Build Next.js réussi avec Infisical
- ✅ **Étape 3** : Linting ESLint réussi
- ✅ **Étape 4** : Tests unitaires passent avec couverture
- ✅ **Étape 5** : Image Docker construite et testée

---

## 11. Métriques et Performances

### **📊 Métriques actuelles :**
- **Tests** : 427 passed, 1 skipped ✅
- **Couverture** : 88.05% ✅
- **Build Next.js** : ~2-3 minutes ✅
- **Build Docker** : ~2 minutes ✅
- **Pipeline total** : ~8-10 minutes ✅

### **🎯 Objectifs de performance :**
- **Couverture** : Maintenir > 80%
- **Build Next.js** : < 3 minutes
- **Build Docker** : < 3 minutes
- **Pipeline total** : < 12 minutes

---

## 12. Conclusion

**Pipeline CI complet implémenté avec succès !** 🎉

Le protocole d'intégration continue est maintenant opérationnel avec **5 étapes complètes** :
1. ✅ Vérification basique
2. ✅ Build et compilation Next.js
3. ✅ Analyse statique ESLint
4. ✅ Tests unitaires Jest
5. ✅ Packaging Docker

**Bénéfices obtenus :**
- 🔄 **Intégration continue** automatisée
- 🧪 **Tests automatisés** à chaque commit
- 🐳 **Packaging Docker** prêt pour le déploiement
- 🔒 **Gestion sécurisée** des variables d'environnement avec Infisical
- 📊 **Qualité du code** garantie
- 🚀 **Déploiement continu** facilité

Ce protocole garantit une base de code stable et de qualité. Il est exécuté automatiquement à chaque modification du code source et prépare l'application pour le déploiement continu.

---

**Document généré le :** Août 2025  
**Version :** 2.0.0  
**Statut :** Pipeline CI complet (5 étapes) implémenté et testé  
**Prochaine étape :** Implémentation du déploiement continu (CD)
