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

### Adım 2: App Deploy Boru Hattını Tetikleyin (2 Farklı Seçenek)

#### Seçenek A: Kodu Pushlayarak Otomatik Tetikleme
`backend/` veya `frontend/` dizininde herhangi bir değişiklik yapıp `main` branch'ine pushladığınızda:
```bash
git add backend/ frontend/
git commit -m "feat: improve api performance and trigger app deploy"
git push origin main
```
`02 — AWS App (ECR Build & GitOps Deploy)` workflow'u otomatik olarak başlar.

#### Seçenek B: GitHub Actions Arayüzünden Manuel Tetikleme (workflow_dispatch)
1. GitHub reponuzda **Actions** sekmesine gidin.
2. Sol menüden **`02 — AWS App (ECR Build & GitOps Deploy)`** seçin.
3. **Run workflow** butonuna tıklayın (İsteğe bağlı olarak özel bir imaj etiketi `v1.2.0` girebilirsiniz).

---

## 2. Boru Hattı Neler Yapar?

1. **ECR Kontrolü:** ECR depoları (`three-tier-backend` ve `three-tier-frontend`) yoksa AWS CLI ile otomatik oluşturur.
2. **Multi-Stage Build:** Backend ve Frontend Docker imajlarını derler.
3. **İmaj Etiketleme & Push:** İmajları commit SHA'sı (örn: `sha-a1b2c3d`) ve `latest` etiketleriyle ECR'a gönderir.
4. **GitOps Manifest Güncellemesi:** `k8s/eks/kustomization.yaml` dosyasındaki imaj etiketlerini yeni SHA ile günceller ve repoya otomatik commit atar (`[skip ci]`).
5. **ArgoCD Entegrasyonu:** ArgoCD bu Git commit'ini anında algılayarak EKS kümesindeki podları kesintisiz (RollingUpdate) günceller.

