# LAB-04 — Kubernetes Konfigürasyon ve Gizli Veri Yönetimi (ConfigMaps & Secrets)

Bu laboratuvarda hassas verileri (parolalar, kullanıcı adları) ve ortam konfigürasyonlarını kod tabanından ayırarak Kubernetes `Secret` ve `ConfigMap` objeleri üzerinden podlara nasıl enjekte edildiğini öğreneceğiz.

---

## 🛠️ Değişkenler ve Secret Matrisi

| Anahtar (Key) | Obje Tipi | Değer | Açıklama |
| :--- | :---: | :--- | :--- |
| `MYSQL_ROOT_PASSWORD` | `Secret` | `SuperSecretPass123!` | Veritabanı kök kullanıcı parolası |
| `MYSQL_PASSWORD` | `Secret` | `SchoolUserPass456!` | Uygulama kullanıcısı parolası |
| `MYSQL_DATABASE` | `ConfigMap` | `school` | Açılacak veritabanı adı |
| `MYSQL_USER` | `ConfigMap` | `school_user` | Standart veritabanı kullanıcısı |
| `DB_HOST` | Pod Env | `mysql-service` | K8s dahili DNS çözümlemesi |

---

## 1. Uygulama Adımları

### Adım 1: Mevcut Secret'ı İnceleyin
```bash
kubectl get secret mysql-secrets -n three-tier-app -o yaml
```
> [!NOTE]
> Değerler Base64 formatında saklanır. Şifreyi terminalde çözmek için:
> ```bash
> kubectl get secret mysql-secrets -n three-tier-app -o jsonpath="{.data.MYSQL_ROOT_PASSWORD}" | base64 --decode
> ```

### Adım 2: Pod İçerisinde Ortam Değişkenlerini Doğrulayın
Backend podunun bu secret'ı başarıyla okuyup okumadığını kontrol edin:
```bash
BACKEND_POD=$(kubectl get pod -n three-tier-app -l app=backend -o jsonpath="{.items[0].metadata.name}")
kubectl exec -it $BACKEND_POD -n three-tier-app -- env | grep DB_
```
