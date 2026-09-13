# LAB-08 — SonarQube ile Statik Kod Analizi (SAST) ve Kalite Kapıları

Bu laboratuvarda Node.js API ve React kaynak kodlarını SonarQube üzerinde statik analizden geçirerek kod kokuları (code smells), potansiyel bug'lar ve güvenlik açıklarını tespit edeceğiz.

---

## 🛠️ Değişkenler ve Parametreler

| Parametre | Değer | Açıklama |
| :--- | :--- | :--- |
| `SONAR_HOST_URL` | `http://<UBUNTU_IP>:19000` | SonarQube sunucu adresi |
| `SONAR_PROJECT_KEY` | `three-tier-app` | Proje tekil anahtarı |
| `SONAR_TOKEN` | Secret | Proje analiz erişim belirteci |

---

## 1. Uygulama Adımları

### Adım 1: SonarQube Projesi ve Token Oluşturma
1. `http://<UBUNTU_IP>:19000` adresine gidin (admin / admin).
2. **Create Project** -> **Manually** -> Key: `three-tier-app`.
3. **Generate Analysis Token** butonuna basarak bir proje token'ı oluşturun.

### Adım 2: Docker ile SonarScanner Çalıştırın
Yerel makinenize herhangi bir Java veya scanner kurmadan doğrudan Docker ile analiz koşturun:

```bash
docker run --rm \
    -e SONAR_HOST_URL="http://<UBUNTU_IP>:19000" \
    -e SONAR_TOKEN="<SONAR_TOKEN>" \
    -v "$(pwd):/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectKey=three-tier-app \
    -Dsonar.sources=backend,frontend/src \
    -Dsonar.exclusions=**/node_modules/**,**/build/**
```

SonarQube arayüzüne dönerek **Quality Gate Passed / Failed** durumunu inceleyin.
