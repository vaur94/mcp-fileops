# 🧰 Araclar

## Uygulanan v1 araclari

### Salt-okunur

- `list_directory`: anlik cocuk girdilerini metadata ile listeler
- `get_path_info`: bir yolun durumunu ve normalize metadata bilgisini verir
- `read_file`: tek bir metin dosyasini guvenli sekilde okur
- `read_files`: bir cagrida birden fazla metin dosyasini okur
- `find_paths`: izinli kokler altinda dosya ve dizin bulur
- `search_text`: dosya iceriginde arama yapar ve yapisal sonuclar doner

### Degistirici

- `write_file`: acik kurallarla dosya olusturur veya uzerine yazar
- `replace_in_file`: deterministik metin degistirme islemi yapar
- `apply_batch_edits`: dogrulanmis coklu duzenlemeleri yapisal sonuc ile uygular
- `create_directory`: dizin yolunu guvenli sekilde olusturur
- `move_path`: izinli kokler icinde dosya veya dizin tasir ya da yeniden adlandirir

## Kayit sirasi

Tum araclar `src/tools/index.ts` icinde kayitlidir.

## Ortak beklentiler

- her arac tanimli root sinirlari icinde calisir
- her arac makine tarafinda kullanilabilir yapisal icerik doner
- degistirici araclar `security.readOnly` ayarina uyar
- degistirici araclar `features` altindaki bayraklara da uyar

## Bilerek ertelenen yetenekler

Bilerek ertelenen alanlar:

- `delete_path`
- `copy_path`
- AST-aware kod duzenleme
- yapisal JSON veya YAML editorleri
