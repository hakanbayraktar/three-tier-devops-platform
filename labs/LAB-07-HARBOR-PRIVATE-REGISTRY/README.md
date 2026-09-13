# LAB-07 — Harbor Özel Kayıt Defteri (Registry) ve Trivy Zafiyet Taraması

Bu laboratuvarda Docker Hub yerine yerel Ubuntu sunucumuzda koşan kurumsal **Harbor OCI Registry** üzerinde `three-tier` projesini açacak, robot hesapları oluşturacak ve dahili **Trivy** güvenlik tarayıcısı ile zafiyet analizi yapacağız.

---

## 🛠️ Değişkenler ve Secret Matrisi

| Parametre | Değer | Açıklama |
| :--- | :--- | :--- |
| `HARBOR_URL` | `http://<UBUNTU_IP>:18082` | Harbor web arayüzü |
| `HARBOR_PROJECT` | `three-tier` | İmajların yükleneceği izole proje |
| `HARBOR_ROBOT_USER` | `robot$three-tier+builder` | Jenkins / CI servis hesabı |
| `HARBOR_ROBOT_TOKEN` | Secret | Robot hesap erişim anahtarı |

---

## 1. Uygulama Adımları

### Adım 1: Harbor Üzerinde Proje ve Robot Hesabı Açma
1. `http://<UBUNTU_IP>:18082` adresine gidin (Kullanıcı: `admin`, Şifre: `Harbor12345`).
2. **Projects** -> **+ New Project** -> Ad: `three-tier`, Erişim: **Public** veya **Private** seçin.
3. Proje içinde **Robot Accounts** -> **+ Add Robot Account** -> Yetkiler: `push`, `pull` verin ve üretilen token'ı kopyalayın.

### Adım 2: İmajları Harbor'a Etiketleyip Gönderin
```bash
# Harbor login
docker login <UBUNTU_IP>:18082 -u "robot\$three-tier+builder" -p "<ROBOT_TOKEN>"

# Etiketleme ve Push
docker tag three-tier-backend:v1 <UBUNTU_IP>:18082/three-tier/backend:v1.0.0
docker tag three-tier-frontend:v1 <UBUNTU_IP>:18082/three-tier/frontend:v1.0.0

docker push <UBUNTU_IP>:18082/three-tier/backend:v1.0.0
docker push <UBUNTU_IP>:18082/three-tier/frontend:v1.0.0
```

### Adım 3: Trivy CVE Zafiyet Taramasını İnceleyin
Harbor arayüzünde `three-tier/backend` reposuna tıklayın. Trivy otomatik olarak CVE taramasını başlatır. **Critical** ve **High** zafiyet durumlarını panel üzerinden raporlayın.
