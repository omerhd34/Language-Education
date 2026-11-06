import type { VocabularyCategory } from "@/data/vocabulary/types";

export const vocabularyCategory1: VocabularyCategory = {
  id: "1",
  title: "Ev Aletleri & Cihazlar",
  words: [
    {
      id: "1-1",
      en: "Alarm Clock",
      tr: "Çalar Saat",
      examples: [
        {
          en: "My alarm clock goes off at 7 AM every morning.",
          tr: "Çalar saatim her sabah saat 7'de çalıyor.",
        },
        {
          en: "I forgot to set the alarm clock last night.",
          tr: "Dün gece çalar saati kurmayı unuttum.",
        },
        {
          en: "She placed the alarm clock on her nightstand.",
          tr: "Çalar saati komodinin üzerine koydu.",
        },
      ],
    },
    {
      id: "1-2",
      en: "Equipment",
      tr: "Ekipman",
      similar: [
        {
          en: "Gear",
          tr: "Gereç / Ekipman",
          example: {
            en: "We need heavy gear for mountain climbing.",
            tr: "Dağ tırmanışı için ağır gereçlere ihtiyacımız var.",
          },
        },
      ],
      examples: [
        {
          en: "The gym has modern fitness equipment.",
          tr: "Spor salonunda modern fitness ekipmanları var.",
        },
        {
          en: "Make sure all camping equipment is packed.",
          tr: "Tüm kamp ekipmanlarının paketlendiğinden emin ol.",
        },
        {
          en: "Workers must wear protective equipment at all times.",
          tr: "İşçiler her zaman koruyucu ekipman giymelidir.",
        },
      ],
    },
    {
      id: "1-3",
      en: "Device",
      tr: "Cihaz",
      similar: [
        {
          en: "Gadget",
          tr: "Alet / Küçük Cihaz",
          example: {
            en: "He loves buying the latest tech gadgets.",
            tr: "En son teknolojik aletleri satın almayı seviyor.",
          },
        },
      ],
      examples: [
        {
          en: "This smart device connects to your Wi-Fi network.",
          tr: "Bu akıllı cihaz Wi-Fi ağınıza bağlanır.",
        },
        {
          en: "Please turn off all electronic devices during takeoff.",
          tr: "Lütfen kalkış sırasında tüm elektronik cihazları kapatın.",
        },
        {
          en: "The company launched a new medical device this year.",
          tr: "Şirket bu yıl yeni bir tıbbi cihaz piyasaya sürdü.",
        },
      ],
    },
    {
      id: "1-4",
      en: "Loudspeaker",
      tr: "Hoparlör",
      similar: [
        {
          en: "Speaker",
          tr: "Hoparlör",
          example: {
            en: "The speaker produces crystal clear sound.",
            tr: "Hoparlör kristal netliğinde ses üretiyor.",
          },
        },
      ],
      examples: [
        {
          en: "Turn up the volume on the loudspeaker.",
          tr: "Hoparlörün sesini biraz aç.",
        },
        {
          en: "We listened to music through a Bluetooth loudspeaker.",
          tr: "Bluetooth hoparlörden müzik dinledik.",
        },
        {
          en: "An announcement was made over the public loudspeaker.",
          tr: "Anons hoparlöründen bir duyuru yapıldı.",
        },
      ],
    },
    {
      id: "1-5",
      en: "Camera",
      tr: "Kamera",
      examples: [
        {
          en: "She took a wonderful photo with her new camera.",
          tr: "Yeni kamerasıyla harika bir fotoğraf çekti.",
        },
        {
          en: "Security cameras were installed around the house.",
          tr: "Evin etrafına güvenlik kameraları kuruldu.",
        },
        {
          en: "Adjust the camera lens to get a clearer picture.",
          tr: "Daha net bir görüntü almak için kamera merceğini ayarlayın.",
        },
      ],
    },
    {
      id: "1-6",
      en: "Dishwasher",
      tr: "Bulaşık Makinesi",
      examples: [
        {
          en: "Please load the dirty plates into the dishwasher.",
          tr: "Lütfen kirli tabakları bulaşık makinesine doldur.",
        },
        {
          en: "The dishwasher uses less water than washing by hand.",
          tr: "Bulaşık makinesi elde yıkamaktan daha az su harcar.",
        },
        {
          en: "Empty the dishwasher after the cycle finishes.",
          tr: "Program bittikten sonra bulaşık makinesini boşalt.",
        },
      ],
    },
    {
      id: "1-7",
      en: "Washing Machine",
      tr: "Çamaşır Makinesi",
      examples: [
        {
          en: "I put my dirty clothes into the washing machine.",
          tr: "Kirli kıyafetlerimi çamaşır makinesine koydum.",
        },
        {
          en: "Our washing machine has a quick cycle option.",
          tr: "Çamaşır makinemizin hızlı yıkama seçeneği var.",
        },
        {
          en: "The washing machine makes a loud noise during spinning.",
          tr: "Çamaşır makinesi sıkma sırasında çok ses çıkarıyor.",
        },
      ],
    },
    {
      id: "1-8",
      en: "Oven",
      tr: "Fırın",
      examples: [
        {
          en: "Bake the cake in a preheated oven for 30 minutes.",
          tr: "Keki önceden ısıtılmış fırında 30 dakika pişirin.",
        },
        {
          en: "Be careful when taking hot dishes out of the oven.",
          tr: "Sıcak yemekleri fırından çıkarırken dikkatli olun.",
        },
        {
          en: "She cleaned the inside of the oven after cooking.",
          tr: "Yemek pişirdikten sonra fırının içini temizledi.",
        },
      ],
    },
    {
      id: "1-9",
      en: "Coffee Maker",
      tr: "Kahve Makinesi",
      examples: [
        {
          en: "I brew fresh coffee every morning with this coffee maker.",
          tr: "Her sabah bu kahve makinesiyle taze kahve demlerim.",
        },
        {
          en: "Don't forget to turn off the coffee maker before leaving.",
          tr: "Çıkmadan önce kahve makinesini kapatmayı unutma.",
        },
        {
          en: "This espresso coffee maker is very easy to use.",
          tr: "Bu espresso kahve makinesini kullanmak çok kolay.",
        },
      ],
    },
    {
      id: "1-10",
      en: "Toaster oven",
      tr: "Mini Fırın",
      examples: [
        {
          en: "A toaster oven is great for reheating leftover pizza.",
          tr: "Mini fırın, artan pizzayı yeniden ısıtmak için harikadır.",
        },
        {
          en: "She toasted her sandwich in the toaster oven.",
          tr: "Sandviçini mini fırında kızarttı.",
        },
        {
          en: "The toaster oven fits conveniently on the kitchen counter.",
          tr: "Mini fırın tezgahın üzerine rahatça sığıyor.",
        },
      ],
    },
    {
      id: "1-11",
      en: "Air Conditioner",
      tr: "Klima",
      similar: [
        {
          en: "AC",
          tr: "Klima",
          example: {
            en: "The AC is set to 22 degrees.",
            tr: "Klima 22 dereceye ayarlı.",
          },
        },
      ],
      examples: [
        {
          en: "Turn on the air conditioner because it is hot today.",
          tr: "Bugün hava sıcak olduğu için klimayı aç.",
        },
        {
          en: "The air conditioner keeps the bedroom cool all night.",
          tr: "Klima gece boyunca yatak odasını serin tutar.",
        },
        {
          en: "We need to clean the air conditioner filter before summer.",
          tr: "Yazdan önce klima filtresini temizlememiz gerekiyor.",
        },
      ],
    },
    {
      id: "1-12",
      en: "Heater",
      tr: "Isıtıcı",
      examples: [
        {
          en: "It was freezing outside, so we plugged in the electric heater.",
          tr: "Dışarısı buz gibiydi, bu yüzden elektrikli ısıtıcıyı fişe taktık.",
        },
        {
          en: "The bathroom heater warms up the room quickly.",
          tr: "Banyo ısıtıcısı odayı hızlıca ısıtır.",
        },
        {
          en: "Be careful not to put towels near the space heater.",
          tr: "Portatif ısıtıcının yakınına havlu koymamaya dikkat edin.",
        },
      ],
    },
    {
      id: "1-13",
      en: "Radio",
      tr: "Radyo",
      examples: [
        {
          en: "My grandfather loves listening to news on the radio.",
          tr: "Dedem radyoda haber dinlemeyi çok sever.",
        },
        {
          en: "She tuned the radio to her favorite music station.",
          tr: "Radyoyu en sevdiği müzik kanalına ayarladı.",
        },
        {
          en: "We listened to live sports coverage on the car radio.",
          tr: "Araba radyosundan canlı spor yayınını dinledik.",
        },
      ],
    },
    {
      id: "1-14",
      en: "Telephone",
      tr: "Telefon",
      similar: [
        {
          en: "Phone",
          tr: "Telefon",
          example: {
            en: "I left my phone on the kitchen table.",
            tr: "Telefonumu mutfak masasında bıraktım.",
          },
        },
      ],
      examples: [
        {
          en: "The telephone rang while I was taking a shower.",
          tr: "Duş alırken telefon çaldı.",
        },
        {
          en: "Please pick up the telephone and answer the call.",
          tr: "Lütfen telefonu kaldırıp aramaya cevap ver.",
        },
        {
          en: "An old rotary telephone was sitting on the wooden desk.",
          tr: "Ahşap masanın üzerinde eski çevirmeli bir telefon duruyordu.",
        },
      ],
    },
    {
      id: "1-15",
      en: "Line",
      tr: "Telefon Hattı",
      similar: [
        {
          en: "Landline",
          tr: "Sabit Hat",
          example: {
            en: "Many homes no longer have a landline.",
            tr: "Birçok evde artık sabit hat yok.",
          },
        },
      ],
      examples: [
        {
          en: "The telephone line was busy when I tried to call.",
          tr: "Aradığımda telefon hattı meşguldü.",
        },
        {
          en: "Heavy rain caused damage to the main line.",
          tr: "Şiddetli yağmur ana hatta hasara yol açtı.",
        },
        {
          en: "Hold the line, please; I will transfer your call.",
          tr: "Hatta kalın lütfen; aramanızı aktaracağım.",
        },
      ],
    },
    {
      id: "1-16",
      en: "Hair dryer",
      tr: "Saç Kurutma Makinesi",
      similar: [
        {
          en: "Blow dryer",
          tr: "Fön Makinesi",
          example: {
            en: "Hand me the blow dryer, please.",
            tr: "Bana fön makinesini uzatır mısın lütfen.",
          },
        },
      ],
      examples: [
        {
          en: "She used a hair dryer to dry her hair after taking a shower.",
          tr: "Duş aldıktan sonra saçını kurutmak için saç kurutma makinesi kullandı.",
        },
        {
          en: "Don't touch the hair dryer with wet hands.",
          tr: "Saç kurutma makinesine ıslak ellerle dokunmayın.",
        },
        {
          en: "This compact hair dryer is perfect for traveling.",
          tr: "Bu kompakt saç kurutma makinesi seyahat için mükemmeldir.",
        },
      ],
    },
    {
      id: "1-17",
      en: "Fan",
      tr: "Vantilatör",
      examples: [
        {
          en: "The ceiling fan keeps the air circulating in the room.",
          tr: "Tavan vantilatörü odadaki havanın sirküle olmasını sağlar.",
        },
        {
          en: "We turned on the fan because the room felt stuffy.",
          tr: "Oda havasız hissettirdiği için vantilatörü açtık.",
        },
        {
          en: "A small electric fan stood on his office desk.",
          tr: "Çalışma masasında küçük elektrikli bir vantilatör duruyordu.",
        },
      ],
    },
    {
      id: "1-18",
      en: "Vacuum Cleaner",
      tr: "Elektrikli Süpürge",
      similar: [
        {
          en: "Hoover",
          tr: "Elektrikli Süpürge",
          example: {
            en: "She used the hoover to clean the living room.",
            tr: "Oturma odasını temizlemek için elektrikli süpürgeyi kullandı.",
          },
        },
      ],
      examples: [
        {
          en: "I use the vacuum cleaner to clean the carpet twice a week.",
          tr: "Halıyı haftada iki kez temizlemek için elektrikli süpürge kullanırım.",
        },
        {
          en: "The new cordless vacuum cleaner is lightweight and quiet.",
          tr: "Yeni kablosuz elektrikli süpürge hafif ve sessizdir.",
        },
        {
          en: "Empty the dust container after using the vacuum cleaner.",
          tr: "Elektrikli süpürgeyi kullandıktan sonra toz haznesini boşaltın.",
        },
      ],
    },
    {
      id: "1-19",
      en: "Iron",
      tr: "Ütü",
      examples: [
        {
          en: "He used a steam iron to remove wrinkles from his shirt.",
          tr: "Gömleğindeki kırışıklıkları gidermek için buharlı ütü kullandı.",
        },
        {
          en: "Make sure the iron is unplugged when you finish.",
          tr: "İşiniz bittiğinde ütünün fişten çekildiğinden emin olun.",
        },
        {
          en: "She accidentally touched the hot iron and burned her fingers.",
          tr: "Sıcak ütüye kazara dokundu ve parmaklarını yaktı.",
        },
      ],
    },
    {
      id: "1-20",
      en: "Remote control",
      tr: "Kumanda",
      similar: [
        {
          en: "Remote",
          tr: "Uzaktan Kumanda",
          example: {
            en: "Pass me the remote, please.",
            tr: "Bana kumandayı uzatır mısın lütfen.",
          },
        },
      ],
      examples: [
        {
          en: "Where did you leave the TV remote control?",
          tr: "TV kumandasını nereye bıraktın?",
        },
        {
          en: "The remote control needs new batteries to work.",
          tr: "Uzaktan kumandanın çalışması için yeni piller gerekiyor.",
        },
        {
          en: "You can change channels using the remote control.",
          tr: "Uzaktan kumandayı kullanarak kanalları değiştirebilirsiniz.",
        },
      ],
    },
    {
      id: "1-21",
      en: "Smoke detector",
      tr: "Duman Dedektörü",
      examples: [
        {
          en: "The smoke detector started beeping when the toast burned.",
          tr: "Tost yanınca duman dedektörü ötmeye başladı.",
        },
        {
          en: "You should test the smoke detector batteries every year.",
          tr: "Duman dedektörü pillerini her yıl test etmelisiniz.",
        },
        {
          en: "Installing a smoke detector in the hallway saves lives.",
          tr: "Koridora duman dedektörü takmak hayat kurtarır.",
        },
      ],
    },
    {
      id: "1-22",
      en: "Flashlight",
      tr: "El Feneri",
      similar: [
        {
          en: "Torch",
          tr: "El Feneri (İngiltere)",
          example: {
            en: "He pointed the torch towards the dark garage.",
            tr: "Feneri karanlık garaja doğru tuttu.",
          },
        },
      ],
      examples: [
        {
          en: "We used a flashlight to find our way during the power outage.",
          tr: "Elektrik kesintisi sırasında yolumuzu bulmak için el feneri kullandık.",
        },
        {
          en: "Keep a working flashlight near your bed in case of emergency.",
          tr: "Acil durumlar için yatağınızın yakınında çalışan bir el feneri bulundurun.",
        },
        {
          en: "The flashlight shines a bright beam into the dark room.",
          tr: "El feneri karanlık odaya parlak bir ışık saçıyor.",
        },
      ],
    },
    {
      id: "1-23",
      en: "Carpet",
      tr: "Halı",
      similar: [
        {
          en: "Rug",
          tr: "Kilim / Küçük Halı",
          example: {
            en: "A small rug was placed at the entrance.",
            tr: "Girişe küçük bir kilim serilmişti.",
          },
        },
      ],
      examples: [
        {
          en: "We bought a warm wool carpet for the living room.",
          tr: "Oturma odası için sıcak tutan bir yün halı aldık.",
        },
        {
          en: "She spilled coffee on the white carpet by accident.",
          tr: "Yanlışlıkla beyaz halının üzerine kahve döktü.",
        },
        {
          en: "Vacuuming the carpet regularly keeps it clean and dust-free.",
          tr: "Halıyı düzenli olarak süpürmek onu temiz ve tozsuz tutar.",
        },
      ],
    },
    {
      id: "1-24",
      en: "Furniture",
      tr: "Mobilya",
      examples: [
        {
          en: "They moved into a new apartment and ordered new furniture.",
          tr: "Yeni bir daireye taşındılar ve yeni mobilya sipariş ettiler.",
        },
        {
          en: "This shop sells high-quality wooden furniture.",
          tr: "Bu dükkan yüksek kaliteli ahşap mobilya satıyor.",
        },
        {
          en: "We rearranged the furniture to create more space.",
          tr: "Daha fazla alan yaratmak için mobilyaların yerini değiştirdik.",
        },
      ],
    },
  ],
};
