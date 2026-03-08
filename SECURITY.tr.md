# Guvenlik

> [English](./SECURITY.md) | Turkce

`mcp-fileops`, dosya sistemine erisen bir MCP sunucusudur. Bu nedenle guvenlik davranisi urunun ana sozlesmesinin bir parcasidir.

## Guncel politika

- varsayilan olarak kapali erisim
- yalnizca tanimli mutlak kok dizinlerde calisma
- traversal ve root escape denemelerini reddetme
- shell execution destegi olmamasi
- varsayilan olarak ham dosya icerigi loglamamasi

## Ayrintili model

Detayli guvenlik modeli su dosyalarda aciklanir:

- [English security documentation](./docs/en/security.md)
- [Turkce guvenlik dokumani](./docs/tr/security.md)

## Bildirim

`mcp-fileops` icin guvenlik acigi buldugunuzu dusunuyorsaniz, GitHub private vulnerability reporting yolunu kullanin.

Onerilen surec:

1. repository Security sekmesini acin
2. private vulnerability report veya security advisory taslagi olusturun
3. etkiyi, etkilenen yolları, tekrar adimlarini ve varsa cozum onerilerini ekleyin
4. exploitable bulgular icin maintainer yanit vermeden public issue acmayin

Private reporting gecici olarak kullanilamiyorsa, maintainer ile GitHub uzerinden iletisime gecin ve bir duzeltme veya azaltma hazirlanana kadar exploit detaylarini herkese acik paylasmayin.
