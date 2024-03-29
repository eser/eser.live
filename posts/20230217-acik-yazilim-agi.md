---
title: Açık Yazılım Ağı
publishedAt: 2023-02-17T00:00:00.000Z
---

6 Şubat 2023’de yaşadığımız coğrafyada elim bir olay gerçekleşti.
Kahramanmaraş’ta gerçekleşen ve en az 10 ilimizi daha etkileyen deprem felaketi
sonucunda aynı coğrafyayı paylaştığımız insanlar kayıplar ve travmalar yaşadık.

Daha önce herhangi bir arama-kurtarma eğitimi almamış, bölgeye gitmek istese
yolda durdurulacak, örgütsüz ve bir şeyler yapmak için gönüllü olabilecek
insanların ilk aklına gelen şeyi gerçekleştirmek istedik: profesyoneli olduğumuz
konular üzerinden felaketten etkilenenlere yardımcı olmak.

Bu acı olay vesilesiyle, son kontrol ettiğimde nüfusu 23,950 kişiyi aşmış,
yazılım alanında faaliyet gösteren gönüllüler olarak bir Discord sunucusunda bir
araya geldik ve kendimizi Açık Yazılım Ağı olarak isimlendirmeye başladık.

**Açıklama:** 6 Şubat’tan bu yana zamanı efektif kullanmak için hep kısa kısa
yazdım, kimsenin zamanını fazladan tüketmemeye çalıştım. Discord’da dahi sahnede
en az benim konuştuğumu, twitter’da oldukça az tweet attığımı
gözlemlemişsinizdir. Bugün bu uzun yazıyı kaleme almamın nedeni insanların
bundan sonrasına ilişkin özelden ilettikleri mesajları teker teker değil, toplu
halde yanıtlamak. Ve halen iletişim yapamadığımız konular, soru işaretleri varsa
açık bir biçimde yanıtlamak için bu yazıyı yayınlıyorum.

## Nasıl toplandık?

Hem daha önce topluluk adına birçok yayın yaptığım hem de mesai arkadaşım Furkan
Kılıç’ın Twitter’da yine yazılım ekosisteminden tanıdığım İrem Kömürcü ile
mesajlaşmalarını gördüm, nasıl yardım edebileceklerini tartışıyorlardı. Ben
şahsen henüz hiçbir haber takip edememiş, şirketin planlama toplantımıza
hazırlanıyordum. Toplantımız esnasında bir yandan Twitter’daki mesajları göz
ucuyla okuyor, Furkan’ın ortaya attığı “bir ısı haritası oluşturalım” fikri için
açılan Telegram grubunu takip etmeye çalışıyordum.

Toplantımız biter bitmez Discord’a geçtik. Furkan’la “benim genel yetkilendirme
ile ilgileneceğim, onların uygulamaya başlayacağı” ufak bir planlama yaptık.

Furkan’ın “sosyal medya’da insanların ürettiği yardım çağrılarının ısı
haritasını oluşturma fikri” o kadar temel bir doğruya dayanıyordu ki... Makro
ölçekte ülkede yetkililer dışında kalan hiç kimsenin bölgeden haber alamaması,
mikro ölçekte ise olayın canlılığı ile daha mahallesinde ne olduğunu
kavrayamamış insanların hangi bölgede nasıl bir yoğunluk olduğunu
gözlemleyebilmesi sağlanıyordu. Bu basit ama güçlü fikri “gelin birlikte
geliştirelim” çağrısı ile dalga dalga yayıldı. İnsanlar “IT Deprem Yardım”
ismiyle oluşturduğumuz Discord sunucusunda toparlanmaya başladılar.

## Nasıl büyüdük?

Bilişim sektörüne temas eden herkese yaptığımız açık çağrı yanıt bulunca
Furkan’la ilk stratejimiz, onun projeyle ilgilenmesi, benimse biraz daha genel
resme bakıp yetkilendirmeleri yapmak, repository’leri açmam üzerine oldu.

Kendi adıma yapacaklarım zaten kafamda netti,
[github.com/acikkaynak](https://github.com/acikkaynak) 2015 yılından bu yana
vardı ve zaten tam da insanlarla birlikte geliştirme yapmaya hazırdı. Kendi
çevremde, topluluktan tanıdığım arkadaşlarımızla da yürütülen ufak projelerde
benimsenen fikirsel altyapı birçok profesyonelin de bu çalışmalara dahil
olabileceği bir zemine elverişliydi.

Furkan ise frontend, backend, tasarım gibi ekipler oluşturup bu kişilerden
bazılarını projelerde yetkilendirilmek için bana yönlendiriyordu.

Projelerimizi o noktadan itibaren Apache 2.0 açık kaynak lisansı ile herkesçe
denetlenebilir, herkesin nezaretinde geliştirilen bir yapıya kavuşturduk. Veri
dışında her konuda şeffaf olduk, verileri yalnızca STKlar/yetkili
kurumlar/akredite kurumlar ile paylaşacak şekilde bir ilke belirledik. Bu bizim
süreç boyunca hassasiyetle koruduğumuz temel iki ilkemizi oluşturdu.

Son kontrol ettiğimde yalnızca discord sunucumuzda 24,000 kişi olmamıza az
kalmıştı. Süreçte mutlaka küstürdüğümüz, kendini dahil olamamış hissederek
uzaklaşan kişiler de olmuştur.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676612473943/89951b44-d922-4e81-a0cb-9404d16c9701.png
align="center")

## Açık kaynak olmasının anlamı nedir?

Projelerin açık kaynak olmalı kriterini benimsedik çünkü başından bu yana
amacımız: yaptığımız iş denetlenebilir, gerektiğinde belirli sistemlere entegre
edilebilir ve diğer insanların da az bir eforla bir ucundan tutabileceği şekilde
geliştirmeye açık olmalıydı.

Kurumsal bir şirkette bir projeye dahil olan birileri, belki 3. haftasının
sonunda “süreçlere uygun” geliştirme yapmaya başlayabilir durumda oluyorsa bizde
bu süre 5-6 dakikaya indi.

O an “projeyi çıkartma” motivasyonuyla düşünemediğimiz ama sonradan da fark
ettiğimiz bir nokta ise; gün 1’den açık kaynak ilerleyerek aslında ileride
bizden bağımsız bu sistemlerin herhangi bir ülkedeki başka herhangi bir
STKsının/yetkili kurumunun/akredite kurumunun bunları kullanabilmesini sağladık.

Açık kaynak olarak geliştirdiği için artık bizim bu projelerin kaynak kodlarını
“kapatma” veya başka bir yerde kullanılmasına engel olma şansımız yok. Bu
anlamda projenin kaynak kodları kimsenin sahipliğinde veya tekelinde değil. Kötü
bir vesileyle de olsa, bizim bu çalışmaları “gönüllüler” olarak yapıp, dünya
bilgi hazinesine bağışlamış duruma geldik.

## Ne tür projeler geliştiriliyor?

İlk olarak [afetharita.com](https://afetharita.com) ile çıktık. Daha sonra yeni
fikirler geldikçe yine açık kaynak bir yazılım vakfı gibi (Apache Foundation,
CloudNative Computing Foundation, Free Software Foundation, Linux Foundation,
Mozilla Foundation v.s.) gelen projeleri değerlendirip, bunlara gönüllü ekipler
kurup ilerlemelerinin önündeki engelleri kaldırmaya çalıştık.

Bir proje listesi üzerine çalışıyoruz, çok yakın zamanda iç süreçlerimiz daha da
düzene girmiş olacak. Ancak bugünlük “yayına hazır” projeleri
[https://afet.org/](https://afet.org/) adresi altından görüntüleyebilirsiniz.

## Denetim ve güvenlik ne aşamada?

Konu açık kaynaklı geliştirme olunca akla gelen ilk sorulardan birisini
eleyelim: Hayır, herkes dilediğince müdahale edemiyor. Öncelikle proje liderleri
projelerde yetkili oluyor. Ancak herkes geliştirilen kodları okuyup, yeni
değişiklik önerilerinde bulunabiliyorlar. Bunu bir meclis yapısı gibi
düşünebilirsiniz. Nasıl kanunlar herkese açıksa ve ve her kanun önerisi kabul
edilmiyorsa, bu süreç de “öneriler” ile gidiyor. Projede yetkili olanlar da bu
önerileri kabul edip, kendi şerhlerini düşüp projeye dahil etme veya etmeme
tasarrufunda bulunabiliyorlar.

Yine süreçte gönüllü olarak gece gündüz çalışan bir altyapı ekibimiz oluştu ve
onlar da bize süreç boyunca desteklerini esirgemeyen bulut sağlayıcılarla
birlikte güvenilir bir ortam sağlıyorlar.

Özellikle afetten sonraki 2. gün siber saldırıların da gelmesiyle yine sektörden
çok deneyimli siber güvenlik firmalarının ve uzmanlarının destekleri ile hem kod
tarafındaki hem de altyapı tarafındaki zaafiyetlerimizi belirli aralıklarla
kontrol ettirdiğimiz bir yapıya kavuştuk.

## Kimlerden destek aldık?

Neredeyse herkesten!

Gün 0’da gönüllülerden.

Saatler sonra bilinen bulut hizmetleri sağlayan tüm firmalar bize yardımcı
olmaya çalıştı. Hiçbir hizmet talebimizde hayır denilmediği gibi, mevcut
hizmetlerindeki limitleri bizler için kaldırdıkları oldu.

Proje ekiplerindeki insanların firmalarına haber vermesiyle birlikte firmalar da
bize ulaşıp “nasıl yardımcı olacaklarını” sordular. Birçok firma çalışanlarının
açık kaynaklı olarak katkıda bulunabilmelerini desteklediler. İlgili alanlarda
nasıl destek verebilecekleri konusunda kafa yorduk ve iletişime her zaman açık
haldelerdi.

## Sektörel kazanımlarımız neler oldu?

Bu afet durumu ile bir araya gelmenin ülkemize, coğrafyamıza çok fazla kayıp
yaşattığı aşikar. **İşin sahadaki STKlara/yetkili kurumlara/akredite kurumlara
geri hizmet sağlamak kısımlarını dışarıda bırakarak** (diğer türlü haddimizi
aşıp, diğer kurumlarla yarıştığımız anlamı çıkabilir, o nedenle lütfen maruz
görün) Tüm bu kayıplarımızı aklımızda ve kalbimizde tutarak, yalnızca buradaki
çalışma kapsamında **teknik** bir değerlendirme yapmamız gerekirse:

- Bilişim sektöründeki kişiler twitter’daki hararetli tartışmaları,
  küskünlükleri gerilerinde bırakarak, zor anlarda yardımlaşma ve dayanışma
  zemininde bir araya gelip, birlilkte çalışabildiklerini hissettiler

- Sahaya nasıl yardım ulaştırabileceği konusunda sabahlara kadar tartışan
  yüzlerce kişi hepimizin birbirine inancını tazeledi

- İnsanlar açık kaynak geliştirme, bulut hizmetleri v.b. yeni çalışma
  disiplinleri ile tanıştılar

- Birçok organizasyonun seneler içinde alacağı yolu sektörün belirli
  pratikleriyle 2-3 günde bir düzene getirebildik

- Kaos gibi görünen bir yapıda çalışan, canlıda olan yazılımlar örebildik

- Kurumlara, geçmişte birçok kez “hukuki” nedenlerle çekince ile yaklaştıkları
  “açık kaynak geliştirmenin” çok kaygılanacak bir yönü olmadığını ispat ettik

- Farklı kurumlar altındaki insanlar birbirleri ile çalıştılar, farklı
  yaklaşımlar, farklı kültürler bir araya geldiler ve birbirlerini tanıyıp yeni
  ilişkiler başlattılar

- Yazılım alanında sürekli tartışan insanlar gibi görünüyorduk, hem kendimiz hem
  de dış partiler potansiyelimizi gözlemleyebilmiş oldu

- Kurumlara, medyaya, çevremize, bizden sonraki nesillere ve en çok da kendimize
  ilham “influence” oluşturduk. Bir arkadaşımla yaptığım toplantıda 1-2 aydır
  yazılım alanında kötü zamanlar geçirdiğini ama buradaki birlikle tekrar
  doğduğunu konuştuk.

  Dahası şöyle mesajlar aldık: “Hatay’da 12 yaşında öksüz kalan akrabam bana
  _abi çocuklar için de bölüm ekleyelim bana bilgisayar alalım kod yazcam_ dedi,
  _[afetcocuk.com](http://afetcocuk.com)’u bana al_ diyor.”

## Bundan sonra ne olacak?

Bunun bir kişisel bir de Açık Yazılım Ağı için yanıtı var.

Planlama esnasında naçizane belirli ilkeler etrafında kalmaya özen gösterdim,
ekipte koordinasyon tarafındaki diğer arkadaşlarımın da hemfikir olduğunu
gördükçe mutlu oldum:

- Yaptığımız çalışmalarda tekrarı önlemek ve odaklanmak,

- Gönüllü olan kişilerin sırtından angarya işleri mümkün olduğunca kaldırmak,

- Yasal zeminde kalmak,

- Gönüllü olarak katkıda bulunan insanlarda kötü bir his oluşturmamak,

- Taşıyabileceğimiz kadar yük kaldırmak,

- Açık kaynak olarak devam etmek,

- STKlara/yetkili kurumlara/akredite kurumlara destek vermeye devam etmek,

Plan listesi olarak somutlaştırmak gerekirse,

**Eser Özvataf olarak kişisel kısım:**

- Açık Yazılım Ağı hızlı başladı. Kendi adıma, bunun bundan sonra daha
  sürdürülebilir olması için çalışacağım

- Ekipten ikna edebildiğim arkadaşları ara ara
  [YouTube kanalım](https://eser.live)’a çağırıp Açık Yazılım Ağı için online
  hackathon’lar düzenleyeceğim

- Bazı kurumlardan destek alarak 2-3 ayda bir fiziksel Açık Yazılım Ağı
  Hackathonları düzenleyip odak projeler çıkartarak, yalnızca afet anlarında
  değil, sürekli bir açık kaynak bilinci oluşmasını sağlayacağım
  (başarabilirsem)

- Süreçte olduğu gibi, bundan sonra da kurumlar ile irtibatta olup ortak
  projeler yapmak, açık kaynak projelere katkıda sağlamaya çalışmak, içlerinde
  “Açık Kaynak Geliştirici” istihdam etmek için onları ikna etmeye çalışacağım

- Apache Foundation, CloudNative Computing Foundation, Free Software Foundation,
  Linux Foundation, Mozilla Foundation v.b. ne ise Türkiye’ye de bir yazılım
  vakfı kazandırmaya çalışacağım (işin hukuki/resmi tarafına değil fikir ve çatı
  kısmını inşa etmeye odaklı durumdayım)

- Bu ve benzeri durumlar için gelecekte kişisel olmayan verileri paylaşmak için
  nasıl bir veri platformu inşa ederiz’i planlamaya çalışacağım

- Açık Yazılım Ağı’nın mevcut çözümlerinin “paketlenmesi” kısmında çalışmalarım
  olacak

- Açık Yazılım Ağı’nın portföyündeki yazılımları tanıtıp bunları kullanıcılara
  ulaştıracağım

- Açık Yazılım Ağı’nın çözebileceği potansiyel sorunlar, durumları keşfe
  çıkacağım

**Açık Yazılım Ağı kısmı:**

- Hali hazırda olan
  [code of conduct](https://10forward.io/agreements/code-of-conduct/)’ımızın
  üzerine bir inclusion policy yayınlayacağız (her dilde) (bkz:
  [https://github.com/mozilla/inclusion](https://github.com/mozilla/inclusion))

- Süreç boyunca kendi mesai saatlerinde dahi gece/gündüz çalışan arkadaşlarla
  iletişimi senkron iletişimden asenkron iletişime döndürülecek

- Çok tekrar eden süreçler için akış yapıları kurgulayıp formlarla ilerlenecek

  - Yeni proje formları

  - Yeni katılımcı formları

  - Kaynak ihtiyaçları

  - İş talepleri

  - Ve benzerleri...

- Sürecin hukuki kısmı ile ilgili gereken yükümlülükler yerine getirilecek
  (kişisel verileri yok etme v.b.). Bunun için bir deklarasyon çalışmamız
  gelecek hafta başına kadar yayınlanacak

- Projeler belirli portfolyolara oturtulacak. Bunun için web sitesi üzerinde
  projelerimizin olduğu çalışmamız gelecek hafta başına kadar yayınlanacak

- Projeler tek bir çözüm gibi paketlenecek, bir araya getirilecek

- Paketlenen çözüm white-label ürünler olarak kurulabilir hale getirilecek (bir
  wordpress benzeri blog kurar gibi düşünün)

- Discord çatımızın altında yer alan kitle ile bağlantıda kalmanın yollarını
  arayacağız

**Kısacası** aslında “biz tam gaz devam edeceğiz, KVKK, GPDR başta olmak üzere
yasalara uyumlu bir şekilde, STKlara/yetkili kurumlara/akredite kurumlara
çözümler sağlayacağız. projeler konusunda da odak sağlamak için birkaç gün
içinde yeni bir yönelge yayınlayacağız”.

## Bize nasıl destek olunabilir?

Öncelikle gönüllü başladık ve servis sağlayıcı kurumların bizlere açtığı bazı
hesaplar dışında hiçbir bağış, teşvik, fon v.b. ile ilerlemedik. Bir yazılım
topluluğunun ötesinde davranışlarımız olmadı.

Dolayısıyla bir yazılım topluluğunun temel ihtiyaçları olan bilinirlik, çevre
oluşturma, katılımlarla büyüme ihtiyaçlarımız halen devam ediyor. Özellikle
projede yer aldığını bildiğiniz insanları takip ederseniz zaten destek olmuş
olacaksınız. İlk olarak Twitter, ikinci aşamada Instagram bu süreçte en net
kitlesel aktarımın olduğu platformlar oldu. Bu kanallardan açık yazılım ağı
gönüllülerini ve açık yazılım ağının kendisini takip edebilirsiniz. Ben bilhassa
bu süreçte [kendi Twitter hesabım](https://twitter.com/eser)da yazmaktansa diğer
arkadaşlarımızın tweetlerini dolaşıma sokmaya odaklandım (zaten birçoğumuzun
tweet yazacak zamanımız olmadı).

Farkındaysanız destek için sosyal medyaya yönlendirdim. Çünkü somut bir plan
çıktığında Açık Yazılım Ağı’nın eylemlerini duyuracak bir kanal oluşturmaya
ihtiyacımız var. O nedenle iletişimde kalalım!

## İletişim

İlk günden itibaren sunucudaki moderasyonu tek kişi düzenlemeye çalıştığım an
bile aklımda en kritik işlerden biri “iç iletişim” idi. Discord’un “sahne”
özelliğini oluşturmak, ve o kısmı Furkan’a devrettiğimiz için periyodik
güncellemeler verme konusunda bayağı baskılamış olabilirim. Daha sonra bu
Discord içerisinde bir ritüel haline geldi.

Şimdi iletişimi bir halka daha şeffaf, erişilebilir ve dışa dönük yapma zamanı.

Yukarıda da bahsettim, buradaki eforlara dair hem geri bildirimler almak hem de
daha net konuları aktarmak, hem işin başındaki insanlarla iletişimde bulunmak
için kendi adıma Açık Yazılım Ağı ile ilgilendiğim süreçte
[https://eser.live](https://eser.live) adresinde yayında olmaya çalışacağım.
Eminim bu yayınlarda topluluktan birçok kişi bana katılacaktır, onların
taraflarını dinleyip bir yandan da neler yapabiliriz birlikte konuşmuş olacağız.

## Kapanış ve kişisel öngörülerim

Korkunç bir afet yaşadık. Birçoğumuz için bunun travmatik sonuçları olacak.
Atlattığımız her badirede olduğu gibi biz her ne kadar eski hayatlarımıza dönmek
istersek isteyelim, bir şeyler değişecek veya kendimizi aynı noktada bulmamak
için değişmek zorunda olacak.

Açık kaynak ile tanıştığım yıllarda, okulunu henüz bitirmemiş alaylı bir
yazılımcı olduğum ve çalışmaya devam ettiğim için “uzaktan çalışma”yı da pratik
ediyordum. Pandemi tüm dünyada birçok hasar bıraktı, uzaktan çalışma artık
garipsenmeyen bir pratik olarak hayatımıza girdi.

Açık Yazılım Ağı da kötü bir vesileyle olsa da bizim açık kaynak’ın önemini ve
birlikte öreceğimiz sistemleri tanımak için değişimde rolü olan bir çark haline
gelebilir. Yeter ki biz coğrafya olarak aynı kaderi tekrar yaşamamak için bir
şeyler yapmak isteyelim.

## Sıklıkla sorulan sorular

**Birlikte yapılan ürünlerin kişisel PR malzemesi olduğunu düşünüyor musunuz?**

Bunun hatalı bir soru olduğunu düşünüyorum. Açık kaynak geliştirmede herkes
kendi katkısını ortaya koyarken bundan kıvanç duyabilir, çalışmanın spesifik bir
bölümüne vurguda bulunup kendini veya yakın arkadaşlarının çabasına daha fazla
değer atfedebilir. Bana kalırsa projenin tamamına görünürlük sağladığı için
bunun çok da büyük bir sakıncası yok. Siz de projelerin doğru tanıtılmadığı,
eksik kaldığı kısımlar için tanıtım yazabilir, README’leri güncelleyebilir,
sosyal medyada bahsedebilirsiniz. Ben elimden gelince kendi kaynaklarımla
bunları desteklemeye çalışıyorum.

Herkes bu çalışmalar esnasında tanıştığı kişileri etiketleme, onlara
minnettarlık gösterme anlamında serbest olursa bu daha çok olumlu bir paylaşım
doğurur. Elbette buradaki 24000’e yakın kişiyi tek tweet’de etiketleyemeyiz ama
herkesin katkısı burada, aynı zeminde olarak zaten eşit derecede kıymetli.

**Neden formlarla iletişim yapıyoruz?**

İlk 1 hafta boyunca birçok gönüllü ellerinden geldiğince insan üstü eforlarla
bir çalıştılar. Ancak ikinci hafta itibariyla ulusal yas’ın da bitmesiyle hem
daha az zaman ayırabilir hem de nöbetleşe çalışır bir düzene dönmek zorunda
kaldılar. Bu anlamda taleplerin, “cloud ekibi”, “ML ekibi” gibi nöbetleşe
bakabileceği ve sistem üzerinden kontrol edebileceği ve kaybolmayacağı asenkron
iletişimle ilerlenebileceği bir yapıya geçmek istiyoruz. Bu işin
sürdürülebilirliği için şart görünüyor.

**Neden bazı projeler iptal ediliyor?**

Biz istiyoruz ki, bir sonraki afette hazırlıksız yakalanmayalım. Hatta
Kahramanmaraş depreminde üzerimize düşen vazifeyi tamamladıktan sonra olası bir
sonraki afette yine tüm her şeye 0’dan başlamayalım.

Coğrafyamızı koruduktan sonra, gerekirse dünyanın diğer taraflarında da
kullanılabilecek yangın, tsunami, fırtına, yangın v.b. felaketlerde de insanlığa
yardımcı olabileceğimiz bir açık kaynaklı, Wordpress gibi kurulabilen, bize
bağımlı olmayan bir sistem geliştirelim.

Bunu yaparken de odaklanmak ve birbirinin benzeri işleri yapan proje ekiplerini
birleştirmek, devamında da insan ve hesaplama/computing kaynaklarımızı efektif
kullanmamız gerekmekte.

Aslında burada bir iptal değil, yazılım vakıflarının da yaptığı gibi projeleri
basamak sistemiyle sıralama söz konusu olacak.

**Biz form doldurduk ama geri dönüş olmadı. Neden önemsemediniz?**

Önemsedik, ancak 4 günde herhangi bir kurumsal firmanın bile kolay kolay
altından kalkamayacağı bir organizasyon ve görev dağılımı oluşturduk. İnanın bu
tarihte birkaç yerde “case study” olarak anılacak bir çalışma ve gönüllüler
olarak hepimiz bunun bir parçası olduk.

Ancak bir süre sonra STKlarla/yetkili kurumlarla/akredite kurumlarla
irtibatlanarak mevcut talepleri sahaya yansıtmaya odaklanmamız gerekiyordu ve
bir noktada proje sayısını limitleyerek yeni proje alamaz hale geldik. Özellikle
altyapı ekiplerimiz orada güvenlik kontrolleriyle birlikte insanüstü bir eforla
çalıştılar. İnanın zaman sınırına takıldık. Siz açık yazılım ağı çatısı altında
projelerinizi sürdürdüğünüz sürece, ben şahsen birkaç hafta içinde gelip sizinle
tanışmak ve konuşmak için elimden geleni yapacağım. Eminim diğer arkadaşlarım da
dönüş gerçekleştirecektir. Eğer ulaşamazsam twitter üzerinden de
erişebilirsiniz. Halen tüm mesajlara dönemedim. Kusura bakmayın.

## Bazı bağlantılar

Entegre yapılar:

- [https://www.mynet.com/deprem-yardim-agi](https://www.mynet.com/deprem-yardim-agi)

- [https://crypto.ahbap.org/en](https://crypto.ahbap.org/en)

Videolar:

- **Deprem Dayanışma YouTube Ortak Yayını**\
  (linki bulamadım, güncelleyeceğim)

- **Webtekno röportajımız**\
  [https://www.youtube.com/watch?v=2rmDUQYQc3k](https://www.youtube.com/watch?v=2rmDUQYQc3k)

Bizden bahseden makaleler:

- **WIRED**\
  [https://www.wired.com/story/tech-volunteers-rush-to-save-turkeys-earthquake-survivors/](https://www.wired.com/story/tech-volunteers-rush-to-save-turkeys-earthquake-survivors/)

- **TIME**\
  [https://time.com/6254500/turkey-earthquake-twitter-musk-rescue/](https://time.com/6254500/turkey-earthquake-twitter-musk-rescue/)

- **Euronews**\
  [https://www.euronews.com/next/2023/02/10/how-twitter-helped-find-survivors-trapped-beneath-rubble-after-turkeys-earthquakes](https://www.euronews.com/next/2023/02/10/how-twitter-helped-find-survivors-trapped-beneath-rubble-after-turkeys-earthquakes)

- **Google Türkiye Resmi Blog**\
  [https://turkiye.googleblog.com/2023/02/yasanan-deprem-felaketinin-ardndan.html?m=1](https://turkiye.googleblog.com/2023/02/yasanan-deprem-felaketinin-ardndan.html?m=1)

- **Milliyet**\
  [https://www.milliyet.com.tr/yazarlar/hanife-bas/yazilim-ordusu-seferber-oldu-6902301](https://www.milliyet.com.tr/yazarlar/hanife-bas/yazilim-ordusu-seferber-oldu-6902301)

- [https://www.ekonomim.com/kose-yazisi/girisimci-z-kusagi-tarih-yaziyor/682924](https://www.ekonomim.com/kose-yazisi/girisimci-z-kusagi-tarih-yaziyor/682924)
