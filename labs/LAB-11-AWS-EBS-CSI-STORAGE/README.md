# LAB-11 — Amazon EKS Üzerinde AWS EBS CSI Driver ve Dinamik gp3 Depolama

Bu laboratuvarda Kind üzerindeki yerel diski bırakıp, AWS'nin kurumsal blok depolama çözümü olan **Amazon EBS (gp3)** disklerini **EBS CSI Driver** ile EKS üzerindeki MySQL veritabanımıza dinamik olarak bağlayacağız.

---

## 1. AWS Depolama Mimarisi

```mermaid
flowchart LR
    subgraph EKS["Amazon EKS Kümesi (us-east-1)"]
        Pod[MySQL Pod] -->|VolumeMount /var/lib/mysql| PVC[PVC: mysql-pvc (10Gi)]
        PVC -->|Talep Eder| SC[StorageClass: ebs-gp3<br/>Provisioner: ebs.csi.aws.com]
    end

    subgraph AWSStorage["AWS Elastic Block Store (EBS)"]
        SC -.->|API Çağrısı ile Dinamik Üretir| EBS[(Amazon EBS gp3 Volume<br/>Otomatik Provision Edilen Disk)]
        EBS ==>|Block Device Attach| Pod
    end
```

---

## 2. Adım Adım Uygulama

### Adım 1: EBS CSI Driver Eklentisini Doğrulayın
Terraform modülümüz EBS CSI Driver eklentisini kümeye kurmuştur. Durumunu kontrol edin:

```bash
kubectl get pods -n kube-system -l app.kubernetes.io/name=aws-ebs-csi-driver
# ebs-csi-controller ve ebs-csi-node podlarının çalıştığını görün
```

### Adım 2: gp3 StorageClass'ı Oluşturun
```bash
kubectl apply -f k8s/eks/01-storageclass-gp3.yaml
kubectl get storageclass
# ebs-gp3 (default) olarak listelenecektir.
```

### Adım 3: MySQL PVC'yi EKS Üzerinde Başlatın
```bash
kubectl apply -f k8s/base/00-namespace.yaml
kubectl apply -f k8s/base/01-mysql-secrets.yaml
kubectl apply -f k8s/eks/02-mysql-pvc-ebs.yaml
kubectl apply -f k8s/base/03-mysql-deployment.yaml
```

Diskin AWS tarafından anında üretilip bağlandığını doğrulayın:
```bash
kubectl get pvc -n three-tier-app
# Status: Bound, Volume: vol-0xxxxxxxx (Gerçek bir AWS EBS diskidir!)
```
