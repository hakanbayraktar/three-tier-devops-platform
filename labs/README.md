# Three-Tier DevOps Platform — Laboratuvar Müfredatı ve Değişken Matrisi

Bu eğitim serisi; **React Ön Yüz + Node.js/Express Arka Yüz + MySQL Veritabanı** içeren 3-katmanlı (3-Tier) gerçek dünya uygulamasını adım adım modern DevOps araçlarıyla paketlemek, orkestre etmek, güvenliğini sağlamak ve hem yerel (Kind) hem de bulut (AWS EKS) ortamlarına dağıtmak için tasarlanmıştır.

> **Modülerlik Prensibi:** Her laboratuvar **birbirinden bağımsızdır**. Her kılavuz kendi ön koşullarını, ortam değişkenlerini (Environment Variables) ve gizli anahtarlarını (Secrets) eksiksiz olarak listeler.

---

## 🧭 Laboratuvar Dizini

| No | Modül | Kapsam / Konu | Hedef Ortam | Rehber |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **Docker İmaj Optimizasyonu** | Node 20 LTS, Multi-Stage React+Nginx (%97 boyut tasarrufu), Non-Root güvenlik | Docker | [LAB-01](LAB-01-DOCKER-OPTIMIZATION/README.md) |
| **02** | **Docker Compose 3-Tier** | İzole bridge network, named volume, `.env` değişkenleri, servis bağımlılıkları | Docker Compose | [LAB-02](LAB-02-DOCKER-COMPOSE-3TIER/README.md) |
| **03** | **Kubernetes Temelleri** | Namespace, Pods, Deployments, ClusterIP Services, Health Probes | Kind K8s | [LAB-03](LAB-03-KIND-KUBERNETES-CORE/README.md) |
| **04** | **Konfigürasyon & Secret** | ConfigMap ile DB parametreleri, Secret ile şifre yönetimi | Kind K8s | [LAB-04](LAB-04-KIND-CONFIGS-SECRETS/README.md) |
| **05** | **Kalıcı Depolama (Storage)** | HostPath PV/PVC ve Dinamik NFS StorageClass ile MySQL veri kalıcılığı | Kind K8s | [LAB-05](LAB-05-KIND-STORAGE-PERSISTENCE/README.md) |
| **06** | **Traefik Ingress** | Path-based routing (`/` -> Frontend, `/backend` -> Backend API) | Kind K8s | [LAB-06](LAB-06-KIND-TRAEFIK-INGRESS/README.md) |
| **07** | **Harbor & Trivy** | Özel imaj registry, robot hesapları, Trivy CVE güvenlik taraması | Ubuntu VM | [LAB-07](LAB-07-HARBOR-PRIVATE-REGISTRY/README.md) |
| **08** | **SonarQube SAST** | Statik kod analizi, kalite kapıları (Quality Gates) | Ubuntu VM | [LAB-08](LAB-08-SONARQUBE-CODE-QUALITY/README.md) |
| **09** | **Jenkins & Webhook CI/CD** | GitHub Webhook tetiklemeli otomatik test, derleme, Harbor push ve Kind rollout | Jenkins + Kind | [LAB-09](LAB-09-JENKINS-PIPELINE-WEBHOOK/README.md) |
| **10** | **Terraform ile AWS EKS** | Standart maliyet dostu EKS (2x `t3.medium`), VPC, Ubuntu'dan `aws configure` | AWS `us-east-1` | [LAB-10](LAB-10-TERRAFORM-AWS-EKS/README.md) |
| **11** | **AWS EBS CSI Storage** | Dinamik `gp3` StorageClass ile EKS üzerinde MySQL kalıcı disk yönetimi | AWS EKS | [LAB-11](LAB-11-AWS-EBS-CSI-STORAGE/README.md) |
| **12** | **AWS ALB Ingress** | AWS Load Balancer Controller kurulumu, ALB Ingress ile dış dünyaya açılma | AWS EKS | [LAB-12](LAB-12-AWS-ALB-INGRESS/README.md) |
| **13** | **GitHub Actions CI -> ECR** | Şifresiz OIDC/Secrets ile ECR'a imaj push (Doğrudan EKS'e imperatif deploy ETMEZ) | GitHub Actions | [LAB-13](LAB-13-GITHUB-ACTIONS-ECR/README.md) |
| **14** | **ArgoCD ile GitOps** | Bildirimsel GitOps, sürekli uzlaşma (Reconciliation), Self-healing ve Rollback | ArgoCD + EKS | [LAB-14](LAB-14-ARGOCD-GITOPS-EKS/README.md) |

---

## 🔑 Değişkenler ve Secret Matrisi

| Değişken Adı | Tip | Örnek / Varsayılan Değer | Kullanıldığı Yer |
| :--- | :---: | :--- | :--- |
| `AWS_REGION` | Variable | `us-east-1` | Terraform, GitHub Actions, AWS CLI |
| `AWS_ACCESS_KEY_ID` | Secret | `AKIAXXXXXXXXXXXXXXXX` | Ubuntu `~/.aws/credentials`, GitHub Secrets |
| `AWS_SECRET_ACCESS_KEY` | Secret | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | Ubuntu `~/.aws/credentials`, GitHub Secrets |
| `MYSQL_ROOT_PASSWORD` | Secret | `SuperSecretPass123!` | Docker Compose, K8s Secret |
| `MYSQL_DATABASE` | Variable | `school` | Docker Compose, K8s ConfigMap |
| `REACT_APP_API_BASE_URL` | Variable | `/backend` (K8s/ALB) veya `http://localhost:3500/backend` | Docker Build ARG, K8s ConfigMap |
| `NODE_INSTANCE_TYPE` | Variable | `t3.medium` (Maliyet Dostu) | Terraform `variables.tf` |
