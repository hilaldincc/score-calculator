// **Global Değişkenler**
let alertShown = false; // Hata mesajının bir kez gösterilmesini kontrol eder.
let closeTimeout; // Modal kapanması için timeout tanımlanır.
let jobCompleted = false; // İşin tamamlanıp tamamlanmadığını kontrol eder.
let intervalId; // Interval ID'yi global tanımladık

// **Input ve Slider Değerlerini Senkronize Etme**
function syncValues(inputId, value) {
  const roundedValue = Math.round(value * 10) / 10; // Değeri 1 ondalık basamağa yuvarla

  const inputElement = document.getElementById(inputId);
  const sliderElement = document.getElementById(`slider_${inputId}`);

  // Değerin minimum ve maksimum sınırları aşıp aşmadığını kontrol et
  if (roundedValue < inputElement.min) {
    inputElement.value = inputElement.min;
    sliderElement.value = inputElement.min;
  } else if (roundedValue > inputElement.max) {
    inputElement.value = inputElement.max;
    sliderElement.value = inputElement.max;
  } else {
    inputElement.value = roundedValue;
    sliderElement.value = roundedValue;
  }

  // Slider değerini de güncelle
  document.getElementById(`slider_value_${inputId}`).textContent = roundedValue;

  checkTotal(); // Her değişiklikte toplamı kontrol et
}

// <-------------------------------------------------------------->

// **Slider ve Input Event Listener'ları**r
document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.addEventListener("input", (event) => {
    const inputId = event.target.id;
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      syncValues(inputId, value);
    }
  });
});

// <----------------------------------------------------------->

// Hata mesajını göstermek için fonksiyon
function showError(message) {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block"; // Hata mesajını göster
}

// Hata mesajını gizlemek için fonksiyon
function hideError() {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.style.display = "none"; // Hata mesajını gizle
}

// <-------------------------------------------------------------->

// **Toplam Değeri Kontrol Etme**
function checkTotal() {
  const inputs = document.querySelectorAll('input[type="number"]');
  let total = 0;

  inputs.forEach((input) => {
    total += parseFloat(input.value) || 0;
  });

  // Toplamı belirli bir hassasiyete göre yuvarla
  total = parseFloat(total.toFixed(1));

  // Toplam değeri kontrol et ve hataları ortadan kaldır
  if (Math.abs(total) < 0.1) {
    total = 0;
  } else if (Math.abs(total - 100) < 0.1) {
    total = 100;
  }

  // Toplam yüzdeyi göster
  const submitButton = document.getElementById("submitBtn");
  const progressElement = document.getElementById("progress");
  const panelMessage = document.getElementById("panel-message");

  if (total > 100) {
    panelMessage.textContent = "Toplam değer 100'ü geçemez!";
    panelMessage.className = "error";
    panelMessage.style.display = "block";
    submitButton.disabled = true;
  } else if (total === 100) {
    panelMessage.textContent = "Toplam değer 100'e eşit! Gönderilmeye hazır.";
    panelMessage.className = "success";
    panelMessage.style.display = "block";
    submitButton.disabled = false;
  } else {
    panelMessage.style.display = "none";
    submitButton.disabled = true;
  }

  // Yüzde ilerlemesini güncelle
  progressElement.textContent = `Toplam: ${total}%`;

  return total;
}

// <-------------------------------------------------------------->

// Form gönderildiğinde toplam değeri kontrol eden fonksiyon
document.getElementById("submitBtn").addEventListener("click", function (e) {
  e.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
  disableSubmitButton(); // Butonu devre dışı bırak
  showLoading(); // Yükleniyor göstergesini aç

  const total = checkTotal(); // Toplamı hesapla ve kontrol et

  if (total > 100) {
    showError("Toplam değer 100'ü geçemez!"); // Hata mesajı göster
    enableSubmitButton(); // Butonu tekrar etkinleştir
    return; // İşlem durduruluyor
  }

  // Form verilerini `this` üzerinden değil, `scoreForm` kullanarak toplayın
  const formElement = document.getElementById("scoreForm");
  const formData = new FormData(formElement); // Form verilerini doğru şekilde topla

  var inpP = {
    f: "pjson",
    Toplam_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Toplam_Erkek_Nüfus_Skor_Katsayı: 0.01,
    Toplam_Kadın_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Alım_Gücü_Endeksi_Skor_Katsayısı_Giriniz: 0.01,
    Toplam_Alım_Gücü_Skor_Katsayısı_Giriniz: 0.01,
    Kişi_Başına_Alım_Gücü_Skor_Katsayısı_Giriniz: 0.01,
    İşsiz_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Bekar_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Evli_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Boşanmış_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Dul_Nüfus_Skor_Katsayısı_Giriniz: 0.01,
    Okuma_Yazma_Bilmeyen_Skor_Katsayısı_Giriniz: 0.01,
    Okuma_Yazma_Bilen_Diplomasız_Skor_Katsayısı_Giriniz: 0.01,
    İlkokul_Mezunu_Skor_Katsayısı_Giriniz: 0.01,
    Lise_Mezunu_Skor_Katsayısı_Giriniz: 0.01,
    Yüksek_Lisans_Mezunu_Skor_Katsayısı_Giriniz: 0.01,
    Dokora_Mezunu_Skor_Katsayısı_Giriniz: 0.01,
    Bilinmeyen_Eğitim_Durumu_Skor_Katsayısı_Giriniz: 0.01,
    Gıda_İçecek_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Elektronik_Bilgisayar_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Kıyafet_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Alkollü_İçecek_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Ayakkabı_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Tütün_Ürünleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Ev_Tekstili_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Mobilya_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Ev_Aletleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Ev_Bahçe_Malzemeleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Ev_Gereçleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Ev_Bakım_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Dayanıklı_Rekreasyon_Ürünleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Tıbbi_Ürün_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Şahsi_Bakım_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Şahsi_Eşya_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Kitap_Kırtasiye_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Yemek_Hizmetleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Eğlence_Hizmetleri_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    Oyuncak_Spor_Evcil_Hayvan_Harcaması_Skor_Katsayısı_Giriniz: 0.01,
    İlkokula_Giden_Öğrenci_Sayısı_Skor_Katsayısı_Giriniz: 0.01,
    Liseye_Giden_Öğrenci_Sayısı_Skor_Katsayısı_Giriniz: 0.01,
    Üniversiteye_Giden_Öğrenci_Sayısı_Skor_Katsayısı_Giriniz: 0.01,
    Toplam_Erzak_Yardım_Sayısı_Skor_Katsayısı_Giriniz: 0.01,
    Maski_Kesinti_Sayısı_Skor_Katsayısı_Giriniz: 0.01,
  }; // Parametrelerin tutulduğu nesne

  // Form verilerini inpP nesnesine ekle
  formData.forEach((value, key) => {
    inpP[key] = value;
  });

  // **Fetch ile Veri Gönderme**
  fetch(
    "https://harita.manisa.bel.tr/arcgis/rest/services/test/SkorHesaplama/GPServer/Model/submitJob",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(inpP),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.jobId) {
        console.log(`Gönderildi: İşlem başarılı! Job ID: ${data.jobId}`);
        checkJobStatus(data.jobId); // Tek seferlik iş durumu sorgulaması

        // İş başarılı gönderildiğinde bekleme modalını gösterin
        showModal("Gönderiliyor..", "İşlem devam ediyor, lütfen..", false);

        // İş durumu kontrolünü başlat
        checkJobStatus(data.jobId);
      } else {
        showError("Job ID bulunamadı!"); // Hata mesajı
        enableSubmitButton(); // Hata durumunda butonu tekrar etkinleştir
      }
    })
    .catch((error) => {
      console.error("Hata:", error.message);
      showModal("Hata", `Form gönderilirken hata oluştu: ${error.message}`);
    })
    .finally(() => {
      hideLoading(); // Yükleniyor göstergesini kapat
      enableSubmitButton(); // Butonu tekrar aktif et
    });
});

// <-------------------------------------------------------------->

// **Job Status Kontrol Fonksiyonu**
function checkJobStatus(jobId) {
  let elapsedTime = 0; // Geçen zamanı tutmak için değişken
  const maxTime = 60000; // Maksimum 1 dakika (60 saniye) zaman aşımı

  const intervalId = setInterval(() => {
    // Eğer iş tamamlandıysa veya zaman aşımı gerçekleştiyse sorgulama durduruluyor
    if (jobCompleted || elapsedTime >= maxTime) {
      clearInterval(intervalId);
      if (elapsedTime >= maxTime && !jobCompleted) {
        console.log("Zaman aşımı gerçekleşti, kontrol sonlandırıldı.");
        showModal("Hata", "İş durumu kontrolü zaman aşımına uğradı.");
        enableSubmitButton(); // Zaman aşımında butonu tekrar etkinleştir
      }
      return; // İşlemi sonlandır
    }

    elapsedTime += 3000; // Her kontrol aralığını ekle
    console.log(
      `Job ID ile sorgulama yapılıyor: ${jobId}, Geçen süre: ${elapsedTime}`
    );

    fetch(
      `https://harita.manisa.bel.tr/arcgis/rest/services/test/SkorHesaplama/GPServer/Model/jobs/${jobId}?f=pjson`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sunucu hatası: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (jobCompleted) {
          // Eğer job tamamlandıysa, başka bir işlem yapmadan dön yani true ise
          return;
        }

        console.log("İş durumu yanıtı (JSON olarak işlenmiş):", data);

        if (data && data.jobStatus) {
          if (data.jobStatus === "esriJobSucceeded") {
            console.log("İş başarılı, interval durduruldu.");
            jobCompleted = true; // İş tamamlandı, değişkeni yani bayrağı güncelle
            clearInterval(intervalId); // Timer'ı durdur
            showModal("Gönderildi", "İşlem başarıyla tamamlandı!", true);
            enableSubmitButton();
            console.log(`İşlem başarılı! Job ID: ${data.jobId}`);
          } else if (data.jobStatus === "esriJobFailed") {
            console.log("İş başarısız, interval durduruluyor.");
            jobCompleted = true; // İş başarısız, bayrağı güncelle
            clearInterval(intervalId); // Timer'ı durdur
            showModal("Hata", "İş başarısız oldu!", true);
            enableSubmitButton();
          } else {
            console.log("İş durumu devam ediyor:", data.jobStatus);
          }
        } else {
          console.error("Yanıtta beklenen jobStatus alanı bulunamadı:", data);
          clearInterval(intervalId); // Yanıt doğru değilse sorgulamayı durdur
          jobCompleted = true; // Hatalı durum, bayrağı güncelle
          showModal(
            "Hata",
            "İş durumu yanıtı hatalı: jobStatus bilgisi alınamadı.",
            true
          );
        }
      })
      .catch((error) => {
        if (!jobCompleted) {
          console.error("İş durumu sorgusunda hata:", error);
          jobCompleted = true; // Hatalı durum, bayrağı güncelle
          clearInterval(intervalId); // Hata oluştuğunda sorgulamayı durdur
          showModal(
            "Hata",
            `İş durumu sorgusunda bir hata oluştu: ${error.message}`,
            true
          );
        }
      });
  }, 3000); // Her 3 saniyede bir iş durumu kontrolü
}

// <-------------------------------------------------------------->

// **Modals - Kullanıcıya Mesaj Göstermek için Fonksiyon**
function showModal(title, message, isFinal = false) {
  // Eski modal veya overlay varsa temizle
  const existingModal = document.getElementById("modalOverlay");
  const existingModalContent = document.querySelector(".modal");

  if (existingModal) {
    existingModal.remove(); // Eski overlay'i kaldır
  }
  if (existingModalContent) {
    existingModalContent.remove(); // Eski modal içeriğini kaldır
  }

  // Gönder butonunu devre dışı bırak (Modal açıldığında)
  disableSubmitButton();

  // Yeni overlay ve modal oluştur
  const overlay = document.createElement("div");
  overlay.id = "modalOverlay";
  overlay.classList.add("modal-overlay"); // CSS dosyasındaki sınıf
  overlay.style.display = "block"; // Overlay'i görünür yap
  document.body.appendChild(overlay);

  const modal = document.createElement("div");
  modal.classList.add("modal"); // CSS dosyasındaki sınıf
  modal.innerHTML = `
    <div class="modal-header"><h2>${title}</h2></div>
    <div class="modal-body"><p>${message}</p></div>
    <div class="modal-footer">
      ${
        isFinal
          ? '<button id="closeModalBtn" tabindex="0">Tamam</button>'
          : '<span id="loadingDots">Bekleyiniz...</span>'
      }
    </div>
  `;
  document.body.appendChild(modal);

  // Eğer işlem sonlandıysa, "Tamam" butonunu kontrol edip işleme alalım
  if (isFinal) {
    const closeButton = document.getElementById("closeModalBtn");
    if (closeButton) {
      closeButton.focus(); // Butonun odaklanmasını sağla
      closeButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Tıklama olayının modal dışında bir yerde kapanmayı tetiklemesini engelle
        console.log("Modal kapatma butonuna tıklandı");
        clearTimeout(closeTimeout); // Timeout'u temizle
        closeModal(modal, overlay); // Modalı kapat
        enableSubmitButton(); // Modal kapandığında gönder butonunu tekrar aktif hale getir
      });
    } else {
      console.log("Tamam butonu oluşturulmadı, isFinal yanlış olabilir");
    }
  } else {
    const loadingDots = document.getElementById("loadingDots");
    let dotCount = 0;
    setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      loadingDots.textContent = "Bekleyiniz" + ".".repeat(dotCount);
    }, 500);
  }
}

// **Modal Kapatma Fonksiyonu**
function closeModal(modal, overlay) {
  if (modal) modal.remove();
  if (overlay) overlay.remove();
  console.log("Modal kapatıldı ve sayfa yenileniyor"); // Hata ayıklama için log
  location.reload(); // Sayfayı yenile
}

// <-------------------------------------------------------------->

// **Yükleniyor Göstergesi Fonksiyonları**
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingSpinner";
  loadingDiv.innerHTML = `
    <div class="loading-spinner">
      <p>İşlem devam ediyor... Lütfen bekleyiniz.</p>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  // Kontrol panelini gizle
  const controlPanel = document.getElementById("fixedControlPanel");
  if (controlPanel) {
    controlPanel.style.display = "none";
  }
}

function hideLoading() {
  const loadingDiv = document.getElementById("loadingSpinner");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// Kontrol panelini yeniden göster
const controlPanel = document.getElementById("fixedControlPanel");
if (controlPanel) {
  controlPanel.style.display = "block";
}

// <-------------------------------------------------------------->

// Gönder butonunu devre dışı bırakma fonksiyonu
function disableSubmitButton() {
  const submitButton = document.getElementById("submitBtn");
  if (submitButton) {
    submitButton.disabled = true; // Butonu devre dışı bırak
    submitButton.innerText = "Gönderiliyor..."; // Buton metnini güncelle
  }
}

function enableSubmitButton() {
  const submitButton = document.getElementById("submitBtn");
  if (submitButton) {
    submitButton.disabled = false; // Butonu tekrar aktif hale getir
    submitButton.innerText = "Çalıştır"; // Buton metnini eski haline döndür
  }
}

// Sayfa yüklendiğinde toplam değeri kontrol etmek için
window.addEventListener("DOMContentLoaded", function () {
  checkTotal(); // Sayfa yüklendiğinde toplamı kontrol eder
});

// <-------------------------------------------------------------->
