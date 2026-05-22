# 🚀 Packify - Infrastructure as Code

Infrastructure automatisée pour Packify avec Ansible + Monitoring Grafana.

## 📦 Contenu

```
infrastructure/
├── deploy.yml                 # Déploiement (SANS secrets)
├── monitoring.yml             # Installation monitoring
├── secrets.yml.example        # Template pour secrets
├── secrets.yml                # VOS SECRETS (ne pas commiter!)
├── grafana-dashboard.json     # Dashboard pré-configuré
├── .gitignore                 # Ignore secrets.yml
└── README.md                  # Ce fichier
```

## ⚡ Installation rapide

### 1. Prérequis

```bash
sudo apt update
sudo apt install ansible -y
ansible-galaxy collection install community.docker
```

### 2. Configuration des secrets

```bash
cd infrastructure

# Copier le template
cp secrets.yml.example secrets.yml

# Éditer avec VOS vraies valeurs
nano secrets.yml
```

### 3. Ajouter au .gitignore

```bash
# À la racine de votre projet Packify
echo "infrastructure/secrets.yml" >> .gitignore
```

### 4. Déploiement

```bash
# Déployer l'application
ansible-playbook -i "VOTRE_IP," deploy.yml -e @secrets.yml --ask-become-pass

# Installer le monitoring
ansible-playbook -i "VOTRE_IP," monitoring.yml -e @secrets.yml --ask-become-pass
```

## 🌐 Accès aux services

| Service | URL |
|---------|-----|
| Frontend | http://VOTRE_IP:3000 |
| API | http://VOTRE_IP:8081 |
| Grafana | http://VOTRE_IP:3001 (admin/admin) |
| Prometheus | http://VOTRE_IP:9090 |

## 🔒 Sécurité

- ✅ `deploy.yml` : Peut être commité (pas de secrets)
- ❌ `secrets.yml` : NE PAS commiter (dans .gitignore)
- ✅ `secrets.yml.example` : Template (peut être commité)

## 🛠️ Commandes utiles

```bash
# Mettre à jour l'application
ansible-playbook -i "IP," deploy.yml -e @secrets.yml --ask-become-pass

# Voir les logs
ssh ubuntu@IP "docker logs -f packify-api"

# Redémarrer
ssh ubuntu@IP "cd /opt/packify/app && docker-compose restart"
```

## ❓ Problèmes courants

**"Variable vault_mysql_password not found"**
```bash
# Vous avez oublié -e @secrets.yml
ansible-playbook -i "IP," deploy.yml -e @secrets.yml --ask-become-pass
```

**secrets.yml apparaît dans git status**
```bash
echo "infrastructure/secrets.yml" >> .gitignore
git rm --cached infrastructure/secrets.yml
```
