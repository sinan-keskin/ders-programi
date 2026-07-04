# Haftalık Ders Planı Oluşturucu

Bu uygulama, tamamen tarayıcı üzerinde (client-side) çalışan, statik bir web uygulamasıdır. Öğretmenler veya bireyler için haftalık ders/etkinlik planlarını kolayca oluşturmayı, kaydetmeyi ve cihazlar arası paylaşıma uygun formatlarda (PNG/PDF) dışa aktarmayı sağlar.

## Özellikler

- **İnternetsiz Çalışma:** Herhangi bir backend, veritabanı veya sunucu gerektirmez (statik dosyalar kullanır).
- **Otomatik Hafta/Gün Hesaplama:** Sadece iş günlerini (Pazartesi - Cuma) gösterir, ay geçişlerini otomatik hesaplar. Boş günleri akıllıca düzenler.
- **Otomatik Kaydetme:** Girilen tüm etkinlikler `localStorage` üzerinde kaydedilir. Sayfayı kapatsanız bile verileriniz kaybolmaz.
- **Sabit Etkinlikler:** Güne başlama ve günü bitirme etkinlikleri şablonda sabitlenmiştir.
- **Gelişmiş Çıktı Alma:** `html2canvas` ve `jsPDF` kullanılarak yüksek çözünürlüklü yatay A4 PDF ve PNG çıktı alınabilir.
- **Mobil Paylaşım:** Desteklenen cihazlarda tek tıkla planı WhatsApp, Telegram vb. uygulamalara PNG formatında doğrudan gönderilebilir (Web Share API).

## Kurulum ve Çalıştırma

Proje tamamen statik (HTML/CSS/JS) olduğu için bir npm paketi kurmanıza veya derleme (build) işlemine gerek yoktur.

1. Proje dosyalarını indirin.
2. `index.html` dosyasına çift tıklayarak tarayıcınızda açın.
3. Veya bir lokal sunucu (Live Server vb.) ile çalıştırın.

### GitHub Pages'e Yükleme

Projeyi anında canlıya almak için:
1. Bu proje dosyalarını bir GitHub reposuna yükleyin (push yapın).
2. Reponun `Settings > Pages` kısmına gidin.
3. `Source` bölümünden `main` (veya `master`) dalını seçin ve kaydedin.
4. Birkaç dakika sonra uygulamanız verilen link üzerinden erişilebilir olacaktır.

## Şablon Görseli Değiştirme

Arkaplanda bulunan tasarım (varsa logo, çerçeveler vb.) `assets/template.png` dosyasından çekilmektedir.
Görseli değiştirmek isterseniz, yeni şablon dosyanızı `assets` klasörü içine `template.png` adıyla kaydedin ve üzerine yazın. Eğer şablon görsel kullanmak istemezseniz, `style.css` dosyasındaki `.export-wrapper` sınıfı içinden `background-image: url('assets/template.png');` satırını silebilir veya değiştirebilirsiniz.

## Kullanım

- Üst paneldeki dropdown menülerden Ay ve Yıl seçimi yapın.
- "Önceki Hafta" ve "Sonraki Hafta" butonlarıyla haftalar arasında gezinin.
- Sol taraftaki "Etkinlik Girişi" alanından günlük ara etkinliklerinizi yazın. Plan sağ tarafta otomatik güncellenecektir.
- **Temizle** butonu o an bulunduğunuz haftanın kayıtlı verilerini sıfırlar.
- **PNG İndir / PDF İndir** butonlarıyla cihazınıza kaydedin.
- **Paylaş** butonu ile uyumlu tarayıcılarda (özellikle iOS/Android telefonlar) dosyayı direkt diğer uygulamalara aktarabilirsiniz. Desteklenmeyen masaüstü sistemlerinde manuel indirmeniz için uyarılacaksınız.
