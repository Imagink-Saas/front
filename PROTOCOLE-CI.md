# 📋 PROTOCOLE D'INTÉGRATION CONTINUE

**Nom du projet / application :** Frontend Imagink (Next.js)  
**Version :** 1.0.0  
**Date :** Juillet 2025  
**Responsable :** Malick Siguy NDIAYE  
**Participants :** Équipe de développement Imagink  

---

## 1. Introduction

Ce document décrit le protocole d'intégration continue (CI) de l'application **Frontend Imagink**. Il définit les environnements, les étapes de build et de tests, les outils utilisés, ainsi que les critères de validation.

**Objectif :** Garantir une base de code stable et de qualité en automatisant les vérifications à chaque modification du code source.

---

## 2. Environnements et Outils

### **🏗️ Gestion du code source :**
- **GitHub** (Organisation : Imagink-Saas)
- **Repository :** `front-MalicknND`

### **🚀 Serveur CI :**
- **GitHub Actions** (intégré à GitHub)
- **Workflow :** `.github/workflows/ci.yml`

### **🔧 Outils de build :**
- **Node.js** : Version 20 LTS
- **npm** : Gestionnaire de paquets
- **Next.js** : Framework React

### **🧪 Tests :**
- **Jest** : Framework de tests
- **React Testing Library** : Tests des composants
- **TypeScript** : Vérification des types

### **🔍 Qualité :**
- **ESLint** : Linting du code
- **Next.js ESLint** : Configuration intégrée
- **TypeScript** : Vérification statique

---

## 3. Flux d'Intégration Continue

### **🔄 Étapes principales du pipeline CI :**

#### **Étape 1 : Vérification basique** ✅ IMPLÉMENTÉE
1. ✅ Commit & Push du code
2. ✅ Déclenchement automatique du pipeline CI
3. ✅ Checkout du code source
4. ✅ Installation des dépendances

#### **Étape 2 : Build et compilation** 🔄 EN COURS
5. 🔄 Compilation / Build Next.js
6. 🔄 Vérification des fichiers générés

#### **Étape 3 : Analyse statique** 📋 PLANIFIÉE
7. 📋 Analyse statique du code (ESLint, TypeScript)
8. 📋 Vérification des règles qualité

#### **Étape 4 : Tests unitaires** 📋 PLANIFIÉE
9. 📋 Exécution des tests unitaires
10. 📋 Mesure de couverture de code

#### **Étape 5 : Analyse sécurité** 📋 PLANIFIÉE
11. 📋 Analyse sécurité (SAST, dépendances)
12. 📋 Audit des vulnérabilités

#### **Étape 6 : Packaging** 📋 PLANIFIÉE
13. 📋 Packaging des artefacts si succès des tests
14. 📋 Upload des artefacts de build

---

## 4. Pipeline CI Actuel (YAML)

### **🚀 Workflow CI Basique - Étape 1 :**

```yaml
name: 🚀 CI Basique - Étape 1

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '20'

jobs:
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
        
      - name: ✅ Vérification de l'installation
        run: |
          echo "✅ Vérification de l'installation :"
          echo "📁 Dossier courant : $(pwd)"
          echo "📦 Node modules : $(ls -la node_modules | wc -l) éléments"
          echo "🔧 Version Node : $(node --version)"
          echo "📦 Version npm : $(npm --version)"
          echo "📁 Fichiers du projet :"
          ls -la
```

---

## 5. Gestion des Erreurs

### **❌ Critères d'échec actuels :**
- ❌ Échec si checkout impossible
- ❌ Échec si Node.js non disponible
- ❌ Échec si installation des dépendances impossible

### **📋 Critères d'échec à implémenter :**
- 📋 Échec si compilation impossible
- 📋 Échec si taux de couverture < 80 %
- 📋 Échec si vulnérabilités critiques détectées
- 📋 Échec si linting échoue
- 📋 Échec si tests unitaires échouent

---

## 6. Rapports et Notifications

### **📊 Rapports actuels :**
- ✅ Affichage des informations d'installation
- ✅ Liste des fichiers du projet
- ✅ Versions des outils

### **📋 Rapports à implémenter :**
- 📋 Rapport de build détaillé
- 📋 Rapport de tests avec couverture
- 📋 Rapport de qualité du code
- 📋 Rapport de sécurité

### **🔔 Notifications à implémenter :**
- 📋 Notifications via Slack/Teams/Email
- 📋 Notifications en cas d'échec
- 📋 Notifications de succès

---

## 7. Critères de Validation

### **✅ Critères actuels :**
- ✅ Code checkouté sans erreur
- ✅ Dépendances installées correctement
- ✅ Node.js et npm disponibles

### **📋 Critères à implémenter :**
- 📋 Code compilé sans erreur
- 📋 100 % des tests unitaires passent
- 📋 Seuil minimal de couverture atteint (80%)
- 📋 Pas de vulnérabilités critiques
- 📋 Code conforme aux règles ESLint
- 📋 Types TypeScript valides

---

## 8. Plan d'Implémentation Étape par Étape

### **🎯 Étape 1 : Vérification basique** ✅ TERMINÉE
- [x] Workflow GitHub Actions créé
- [x] Checkout du code
- [x] Installation des dépendances
- [x] Vérification de l'installation

### **🎯 Étape 2 : Build et compilation** 🔄 EN COURS
- [ ] Ajout de l'étape de build Next.js
- [ ] Vérification des fichiers générés
- [ ] Test de l'étape complète

### **🎯 Étape 3 : Analyse statique** 📋 PLANIFIÉE
- [ ] Intégration d'ESLint
- [ ] Vérification TypeScript
- [ ] Test de l'étape complète

### **🎯 Étape 4 : Tests unitaires** 📋 PLANIFIÉE
- [ ] Exécution des tests Jest
- [ ] Mesure de la couverture
- [ ] Test de l'étape complète

### **🎯 Étape 5 : Analyse sécurité** 📋 PLANIFIÉE
- [ ] Audit des dépendances
- [ ] Vérification des vulnérabilités
- [ ] Test de l'étape complète

### **🎯 Étape 6 : Packaging** 📋 PLANIFIÉE
- [ ] Génération des artefacts
- [ ] Upload des artefacts
- [ ] Test de l'étape complète

---

## 9. Test de l'Étape 1

### **🧪 Comment tester :**

1. **Commit et push** ce fichier sur la branche `main` ou `develop`
2. **Vérifier** que le workflow se déclenche automatiquement
3. **Observer** l'exécution dans l'onglet "Actions" de GitHub
4. **Vérifier** que tous les steps passent avec succès

### **📊 Résultats attendus :**
- ✅ Workflow déclenché automatiquement
- ✅ Checkout réussi
- ✅ Node.js 20 installé
- ✅ Dépendances installées
- ✅ Informations affichées correctement

---

## 10. Conclusion

**Étape 1 terminée avec succès !** 🎉

Le pipeline CI basique est maintenant opérationnel et teste automatiquement :
- Le checkout du code
- L'installation des dépendances
- La vérification de l'environnement

**Prochaine étape :** Ajout de l'étape de build et compilation Next.js.

Ce protocole garantit une base de code stable et de qualité. Il doit être exécuté automatiquement à chaque modification du code source avant toute phase de déploiement continu.

---

**Document généré le :** Juillet 2025  
**Version :** 1.0.0  
**Statut :** Étape 1 implémentée et testée
