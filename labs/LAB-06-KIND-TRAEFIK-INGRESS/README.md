# LAB-06 — Kind Traefik Ingress ile Path-Based Yönlendirme

Bu laboratuvarda Port-Forward kullanmak yerine, Kubernetes cluster'ının dış dünya giriş kapısı olan **Ingress Controller** üzerinden tek bir port/domain ile hem Frontend hem de Backend katmanına erişeceğiz.

---

## 🛠️ Yönlendirme Kuralları

| İstek Yolu (Path) | Hedef Servis | Servis Portu | Açıklama |
| :--- | :--- | :---: | :--- |
| `/` | `frontend-service` | `80` | React web arayüzü SPA sayfaları |
| `/backend` | `backend-service` | `3500` | Node.js Express REST API uç noktaları |

---

## 1. Uygulama Adımları

### Adım 1: Ingress Manifestini Uygulayın
```bash
kubectl apply -f k8s/base/06-ingress-traefik.yaml
```

Ingress objesini kontrol edin:
```bash
kubectl get ingress -n three-tier-app
```

### Adım 2: Canlı Test Edin
Kind Traefik HTTP portu `18081` üzerinden dış dünyaya açıktır:

```bash
# 1. Frontend Testi (HTML yanıtı döner)
curl -s http://localhost:18081/ | grep -o "title"

# 2. Backend Testi (JSON döner)
curl -s http://localhost:18081/backend
# Çıktı: "From Backend!!!"

curl -s http://localhost:18081/backend/student
```

Tarayıcınızdan `http://<UBUNTU_IP>:18081/` adresini açarak uygulamayı doğrudan Ingress üzerinden kullanabilirsiniz.
