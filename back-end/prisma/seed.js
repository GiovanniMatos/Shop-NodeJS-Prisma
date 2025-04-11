const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Pineapple WiFi',
        description: 'Sniffer portátil pra redes Wi-Fi, ideal pra pentest wireless.',
        price: 599.90,
        image: 'https://ae01.alicdn.com/kf/Sb9803f92b23041bcb38a9d9af6f0b153k.jpg_640x640q90.jpg',
      },
      {
        name: 'Rubber Ducky',
        description: 'Dispositivo USB que injeta payloads como se fosse um teclado.',
        price: 349.99,
        image: 'https://i.ytimg.com/vi/r2Gd7BtE0i0/maxresdefault.jpg',
      },
      {
        name: 'Raspberry Pi 4',
        description: 'Mini computador versátil, perfeito pra projetos de automação e hacking.',
        price: 479.00,
        image: 'https://cdn-shop.adafruit.com/970x728/5017-03.jpg',
      },
      {
        name: 'Flipper Zero',
        description: 'Multiferramenta de hardware hacking com IR, RFID, GPIO, e mais.',
        price: 1199.00,
        image: 'https://hypescience.com/wp-content/uploads/2024/07/flipper-zero.jpg',
      },
      {
        name: 'USB Killer',
        description: 'Dispositivo que frita a porta USB de qualquer sistema.',
        price: 189.90,
        image: 'https://images.trustinnews.pt/uploads/sites/5/2019/12/9603114usb-killer-tester.jpg',
      },
      {
        name: 'Proxmark3 RDV4',
        description: 'Leitor/clonador de cartões RFID/NFC LF e HF pra pentest físico.',
        price: 999.00,
        image: 'https://lab401.com/cdn/shop/products/proxmark3-battery-bluetooth-6_1220x700.png?v=1570172108',
      },
      {
        name: 'HackRF One',
        description: 'Software Defined Radio pra sniffar sinais de 1 MHz a 6 GHz.',
        price: 1349.90,
        image: 'https://cdn-cosmos.bluesoft.com.br/products/636391493109',
      },
      {
        name: 'O.MG Cable',
        description: 'Cabo USB que parece comum mas injeta payloads com acesso remoto.',
        price: 629.99,
        image: 'https://files.tecnoblog.net/wp-content/uploads/2019/08/o-mg-cable-700x525.jpg',
      },
      {
        name: 'ProxGrind ChameleonMini',
        description: 'Emulador de cartões RFID para pentest físico e clonagem.',
        price: 449.00,
        image: 'https://lab401.com/cdn/shop/products/ChameleonMini-RevG-1.png?v=1581013352',
      },
    ],
  });

  console.log('🌱 Produtos inseridos com sucesso!');
  await prisma.$disconnect();
})();
