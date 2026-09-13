# LAB-14 — Amazon EKS Üzerinde ArgoCD ile GitOps Sürekli Dağıtımı

Bu laboratuvarda EKS kümemize **ArgoCD** kuracak ve Git depomuzdaki manifestleri izleyerek kümedeki uygulamayı otomatik olarak güncelleyen, drift düzeltmesi (self-healing) yapan modern GitOps akışını kuracağız.

---

## 1. GitOps Dağıtım Mimarisi

```mermaid
flowchart LR
    subgraph GitRepository["GitHub Repository (Single Source of Truth)"]
        Manifests["k8s/eks/ Manifestleri<br/>(İstenen Durum / Desired State)"]
    end

    subgraph EKSCluster["Amazon EKS Kümesi (us-east-1)"]
        Argo["ArgoCD Controller<br/>(Continuous Reconciliation Loop)"]
        Actual["Canlı Pod ve Servisler<br/>(Mevcut Durum / Actual State)"]
    end

    Manifests -->|1. Sürekli Dinler (Poll/Webhook)| Argo
    Argo -->|2. Fark (Drift) Varsa Eşler (Auto-Sync)| Actual
    Actual -.->|3. Manuel Müdahale Olursa Düzeltir (Self-Heal)| Actual
```

---

## 2. Adım Adım Uygulama

### Adım 1: EKS Kümesinde ArgoCD Kurulumu
```bash
# 1. Namespace ve kurulum
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Podların hazır olmasını bekleyin
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

### Adım 2: İlk Yönetici (admin) Şifresini Alın
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
echo ""
```

### Adım 3: ArgoCD Uygulamasını (Application CRD) Tanımlayın
`argocd/application.yaml` dosyasını uygulayın:

```bash
kubectl apply -f argocd/application.yaml
```

### Adım 4: Arayüze Bağlanma ve GitOps Senkronizasyonunu İzleme
```bash
# Port-forward başlatın
kubectl port-forward svc/argocd-server -n argocd 8085:443 &
```
Tarayıcınızdan `https://localhost:8085` adresine gidin:
* **Kullanıcı:** `admin`
* **Şifre:** Adım 2'de aldığınız parola

Panoda `three-tier-app` uygulamasının **Synced** ve **Healthy** durumunda olduğunu gözlemleyin. Git üzerinde bir imaj etiketini değiştirdiğinizde ArgoCD'nin hiçbir sunucu komutu çalıştırmadan uygulamayı güncellediğini deneyimleyin!
