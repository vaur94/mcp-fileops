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

Bu depoda henuz dokuman icinde tanimlanmis ozel bir guvenlik bildirim kanali yoktur. Resmi bir surec eklenene kadar, istismar edilebilir detaylari erken asamada herkese acik sekilde paylasmaktan kacin.
