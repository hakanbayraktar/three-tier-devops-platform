# LAB-10 — Terraform ile AWS EKS Kümesi Kurulumu ve Ubuntu'dan Bağlantı

Bu laboratuvarda Terraform kullanarak AWS **`us-east-1`** bölgesinde maliyet dostu ve standart bir **Amazon EKS** kümesi (2x `t3.medium` Worker Node, VPC, Subnet'ler) kuracak ve Ubuntu terminalimizden AWS CLI ile kümeye bağlanacağız.

---

## 🛠️ Değişkenler ve Secret Matrisi

| Parametre / Değişken | Tip | Değer | Açıklama |
| :--- | :---: | :--- | :--- |
| `AWS_REGION` | Variable | **`us-east-1`** (Kuzey Virginia) | Sabit eğitim bölgesi |
| `AWS_ACCESS_KEY_ID` | Secret | `AKIAXXXXXXXXXXXXXXXX` | AWS IAM kullanıcı erişim anahtarı |
| `AWS_SECRET_ACCESS_KEY` | Secret | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | AWS IAM gizli anahtarı |
| `CLUSTER_NAME` | Variable | `three-tier-eks-cluster` | EKS küme adı |
| `NODE_INSTANCE_TYPE` | Variable | `t3.medium` | Maliyet tasarrufu sağlayan standart node |
| `DESIRED_NODES` | Variable | `2` | Çalışacak worker node sayısı |

---

## 1. AWS Bulut Mimarisi

```mermaid
flowchart TD
    subgraph AWS["AWS Cloud (Region: us-east-1)"]
        subgraph VPC["VPC (10.0.0.0/16)"]
            subgraph PublicSubnets["Public Subnets (us-east-1a, us-east-1b)"]
                NAT[NAT Gateway (Maliyet Dostu Tekil)]
                IGW[Internet Gateway]
            end

            subgraph PrivateSubnets["Private Subnets"]
                subgraph EKSControlPlane["Amazon EKS Control Plane (v1.29)"]
                    API[K8s API Server]
                end

                subgraph ManagedNodeGroup["EKS Managed Node Group (2x t3.medium)"]
                    Node1[Worker Node 1: t3.medium]
                    Node2[Worker Node 2: t3.medium]
                end
            end
        end
    end

    Ubuntu[Ubuntu Sunucusu / Terminal] -->|aws configure & kubectl| API
    API --> Node1
    API --> Node2
    Node1 --> NAT --> IGW
```

---

## 2. Adım Adım Uygulama

### Adım 1: Ubuntu Sunucusunda AWS CLI Yapılandırması
AWS CLI kurulu değilse kurun ve kimlik bilgilerinizi girin:

```bash
# AWS CLI kurulumu (Ubuntu)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install
rm -rf aws awscliv2.zip

# AWS Kimlik Bilgilerini Yapılandırın
aws configure
```
İstenen bilgileri şu şekilde girin:
* **AWS Access Key ID:** `<SIZIN_ACCESS_KEYINIZ>`
* **AWS Secret Access Key:** `<SIZIN_SECRET_KEYINIZ>`
* **Default region name:** `us-east-1`
* **Default output format:** `json`

Bağlantıyı doğrulayın:
```bash
aws sts get-caller-identity
```

### Adım 2: EKS Kümesini Başlatın (2 Farklı Seçenek)

#### Seçenek A: GitHub Actions Infra Workflow ile (Önerilen / Tek Tıkla)
1. GitHub reponuza gidin -> **Actions** sekmesini açın.
2. Sol menüden **`01 — AWS Infra (Terraform EKS)`** workflow'unu seçin.
3. **Run workflow** butonuna tıklayın:
   * **Action:** `apply` (veya test için `plan`, eğitimi bitirip silmek için `destroy`)
   * **Auto approve:** `true`
4. Yaklaşık 10-12 dakika içinde kümeniz AWS `us-east-1` üzerinde otomatik olarak kurulacaktır.

#### Seçenek B: Ubuntu Terminalinden Doğrudan Terraform ile
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars

terraform init
terraform plan
terraform apply -auto-approve
```
> [!NOTE]
> EKS kontrol düzlemi ve worker node group oluşumu yaklaşık **10-12 dakika** sürer.


### Adım 3: Ubuntu'dan EKS Kümesine Kubeconfig ile Bağlanın
Terraform çıktısından aldığınız bağlantı komutunu çalıştırın:

```bash
aws eks update-kubeconfig --region us-east-1 --name three-tier-eks-cluster
```

Bağlantıyı ve Worker Node'ları listeleyin:
```bash
kubectl get nodes -o wide
# Beklenen: 2 adet t3.medium node Ready durumunda listelenir.
```
