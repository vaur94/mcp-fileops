# 🛡️ Guvenlik Modeli

## Temel kurallar

- varsayilan olarak kapali
- cozulenen her yol izinli bir root icinde kalmak zorunda
- shell execution kapsam disi
- sessiz fallback davranisi yok
- varsayilan olarak dosya icerigi loglanmaz

## Root politikasi

- tum islemler tanimli mutlak root dizinleriyle sinirlidir
- traversal denemeleri normalize islemi sonrasinda reddedilir
- v1 icinde rootlar arasi move islemi reddedilir

## Symlink ve gizli yol politikasi

- `followSymlinks` varsayilan olarak `false`
- izinli root disina cikan symlinkler reddedilir
- `allowHiddenPaths` varsayilan olarak `false`

## Icerik politikasi

- v1 metin odaklidir
- binary dosyalar acik hatalarla reddedilmelidir
- `maxFileBytes` muhafazakar boyut sinirlari saglar
- metin is akislari icin varsayilan karakter seti UTF-8 kabul edilir

## Mutation politikasi

- degistirici araclar `security.readOnly` acikken basarisiz olmalidir
- feature flag yapisi tek tek degistirici araclari kapatabilir
- batch edit hatalari acik ve yapisal olmalidir

## Log politikasi

- loglar stderr uzerinden gider
- metadata, sure ve sayim bilgileri loglanabilir
- varsayilan olarak ham dosya icerigi loglanmamali
