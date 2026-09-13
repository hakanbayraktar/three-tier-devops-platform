# LAB-13 — GitHub Actions ile Otomatik Derleme ve AWS ECR İmaj Gönderimi

Bu laboratuvarda `main` branch'ine kod pushlandığında **GitHub Actions** boru hattının tetiklenmesini ve Docker imajlarını derleyip **Amazon Elastic Container Registry (ECR)** deposuna göndermesini sağlayacağız.

> ⚠️ **Önemli Kural:** Bu boru hattı **asla doğrudan EKS kümesine imperatif dağıtım (`kubectl apply`) yapmaz**. İmajı ECR'a gönderir; dağıtım bir sonraki adımda GitOps (ArgoCD) tarafından deklaratif olarak gerçekleştirilir.

---

## 🛠️ GitHub Repository Secrets Matrisi

GitHub reponuzda **Settings** -> **Secrets and variables** -> **Actions** kısmına şu anahtarları ekleyin:

| Secret Adı | Değer | Açıklama |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | `AKIAXXXXXXXXXXXXXXXX` | AWS IAM kullanıcı erişim anahtarı |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/...` | AWS IAM gizli anahtarı |
| `AWS_REGION` | `us-east-1` | AWS Bölgesi (Kuzey Virginia) |

---

## 1. Uygulama Adımları

### Adım 1: AWS ECR Depolarını Açın
Ubuntu terminalinizden Frontend ve Backend için ECR depolarını oluşturun:

```bash
aws ecr create-repository --repository-name three-tier-backend --region us-east-1
aws ecr create-repository --repository-name three-tier-frontend --region us-east-1
```

### Adım 2: Kodu Pushlayarak Boru Hattını Tetikleyin
```bash
git add .
git commit -m "ci: test github actions build and push to ecr"
git push origin main
```

GitHub web arayüzünde **Actions** sekmesine giderek derleme ve ECR push adımlarını canlı olarak izleyin.
