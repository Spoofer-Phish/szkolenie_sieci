# Koło Naukowe — Podstawy Sieci Komputerowych (Ścieżka CCNA)
## Zajęcia 1: Overview cyklu i Warstwa 1 (Fizyczna)

---

## 1. Mapa drogowa cyklu (Overview — pierwsze 10 minut)

Droga **od gołego kabla (L1) do zabezpieczonego ruchu aplikacji (L7)** w układzie wzorowanym na ścieżce Cisco CCNA:

| Spotkanie | Temat przewodni (Warstwa OSI) | Kluczowe zagadnienia | Lab praktyczny (Packet Tracer / sprzęt) |
| :--- | :--- | :--- | :--- |
| **Zajęcia 1** | **Overview + Warstwa 1 (Fizyczna)** | Zadania sieci, rodzaje sieci, topologie, domeny kolizyjne i rozgłoszeniowe, duplex, urządzenia (stare i nowe), okablowanie, standardy L1 + wstęp do MAC/IP | Budowa sieci od zera w PT, eksperyment **Hub vs Switch (kolizje w Simulation Mode)**, pierwszy `ping`, zajawka routera |
| **Zajęcia 2** | **Warstwa 2 (Łącza danych) & Switching** | Budowa ramki Ethernet, tablica MAC, **VLAN-y**, Trunking (**802.1Q**), wstęp do **STP** (pętle w L2) | Segmentacja sieci firmowej/akademickiej na VLAN-y (np. Admin, Studenci, Goście) |
| **Zajęcia 3** | **Warstwa 3 (Sieciowa) cz. 1 — Adresacja i Routing statyczny** | Adresacja IPv4, maski podsieci, **subnetting (VLSM)**, ARP w detalu, brama domyślna, routing statyczny, **Inter-VLAN Routing** (Router-on-a-Stick) | Podział puli adresowej dla oddziałów i spięcie VLAN-ów przez router |
| **Zajęcia 4** | **Warstwa 3 (Sieciowa) cz. 2 — Routing dynamiczny** | Tablica routingu, metryka vs Administrative Distance, protokoły stanu łącza vs wektora odległości, **OSPFv2** (Single Area), diagnostyka (`traceroute`) | Budowa szkieletu z 3–4 routerami na OSPF + symulacja awarii łącza (redundancja) |
| **Zajęcia 5** | **Wyższe warstwy OSI (L4–L7) & Usługi** | **TCP vs UDP** (3-way handshake, porty, okna), **DHCP**, **DNS**, **NAT/PAT**, HTTP/HTTPS | Konfiguracja serwera DHCP/DNS + analiza pakietów krok po kroku (Wireshark / PT Simulation) |
| **Zajęcia 6** | **Network Security & Hardening** | **Port Security** (ochrona przed MAC flooding / obcymi urządzeniami), **ACL** (standard/extended jako firewall bezstanowy), wstęp do firewalla stanowego i DHCP Snooping | Zabezpieczenie stworzonej wcześniej sieci przed podsłuchem i nieautoryzowanym dostępem |
| **Zajęcia 7 (Bonus)** | **Troubleshooting & Mini-CTF** | Metodyka diagnostyki *Bottom-Up* (od L1 do L7) | Sieć z celowo zaszytymi błędami (zły kabel, zły VLAN, zła maska, blokujące ACL) do naprawy na czas |

---

## 2. Agenda Zajęć 1 (90 minut)

| Czas | Blok | Zakres materiału i aktywności | Cel / Punkt kluczowy |
| :--- | :--- | :--- | :--- |
| **00:00 – 00:10** (10 min) | **Start i Mapa Drogowa** | • Krótkie przywitanie i cel cyklu: droga od gołego kabla (L1) do zabezpieczonej sieci (L7)<br>• Omówienie planu na cały semestr (Switching → Routing → Usługi → Security → Mini-CTF)<br>• Weryfikacja techniczna: upewnienie się, że każdy ma odpalony **Cisco Packet Tracer** | Zbudowanie kontekstu i wyeliminowanie problemów z softem przed labem. |
| **00:10 – 00:20** (10 min) | **Po co sieci i gdzie jesteśmy?** | • Zadania sieci i 4 filary CCNA (odporność, skalowalność, QoS, bezpieczeństwo)<br>• Rodzaje sieci: PAN, LAN, WLAN, MAN, WAN + Intranet/Extranet<br>• Szybki rzut oka na model OSI (7 warstw) i wprowadzenie zasady diagnostyki **Bottom-Up** („zielona dioda to dopiero początek”) | Zrozumienie skali sieci i ustawienie wspólnego słownika pojęć. |
| **00:20 – 00:35** (15 min) | **Topologie, Domeny i Sprzęt** | • Topologie nieużywane (Magistrala, Pierścień) i przyczyny ich upadku vs współczesne (Gwiazda, Siatka)<br>• Tryby transmisji: Simplex, Half-Duplex, Full-Duplex<br>• **Domena kolizyjna** (CSMA/CD) vs **Domena rozgłoszeniowa**<br>• Przegląd urządzeń: Repeater, Hub, Bridge vs Switch, Router, AP<br>• **Wstawka Cybersec:** pasywny podsłuch ruchu na Hubie i współczesne *Network TAP-y* | Złota zasada CCNA: *Switch tnie domeny kolizyjne, Router tnie domeny rozgłoszeniowe.* |
| **00:35 – 00:45** (10 min) | **Okablowanie, Standardy L1 i Most do L2/L3** | • Kable historyczne/serwisowe: Koncentryk (BNC), Serial, **kabel konsolowy (Rollover)**<br>• Skrętka: fizyka skrętu (Crosstalk/EMI), UTP vs FTP/STP, kategorie (5e/6/6A), drut vs linka, T568A/B, Auto-MDIX, limit 100 m<br>• Światłowód: SMF vs MMF, złącza LC/SC + **Wstawka Cybersec:** brak emisji EM (*TEMPEST*)<br>• Standardy L1: IEEE 802.3, kodowanie liniowe, Auto-Negotiation, **PoE**<br>• Minimum z L2/L3 do labu: czym różni się **MAC** od **IP** | Połączenie fizyki kabli z realnymi parametrami łącza i przygotowanie pod adresację w labie. |
| **00:45 – 00:50** (5 min) | **„Sprzęt w dłoń” (Przerwa aktywna)** | • Puszczenie po sali fizycznych rekwizytów: skrętka UTP vs FTP (krzyżyk, folia), tester kabli RJ-45 z celowo uszkodzonym patchcordem, moduł SFP + światłowód LC-LC<br>• Krótka zasada BHP: nie patrzymy w końcówkę aktywnego światłowodu | Przełamanie zmęczenia teorią i zobaczenie omawianych elementów na żywo. |
| **00:50 – 01:25** (35 min) | **Lab 1 w Packet Tracerze** | • **Etap 1 (5 min):** Połączenie PC ↔ PC (kabel prosty vs krosowany)<br>• **Etap 2 (15 min):** Eksperyment **Hub vs Switch** w trybie *Simulation* (obserwacja ARP broadcast, wywołanie kolizji z ikonką płomienia na Hubie, podmiana na Switch 2960 i brak kolizji)<br>• **Etap 3 (5 min):** Dołożenie drugiego switcha, montaż modułów SFP i spięcie ich światłowodem<br>• **Etap 4 (10 min):** Zajawka L3 — podpięcie PC z innej podsieci (`192.168.2.10/24`), brak pingu mimo zielonych diod, wstawienie routera<br>• **Wstawka Cybersec:** pytanie otwarte o zaufanie do ARP (zapowiedź ARP Spoofingu) | Praktyczne utrwalenie L1, zobaczenie kolizji na własne oczy i naturalny most do kolejnych zajęć. |
| **01:25 – 01:30** (5 min) | **Mini-Quiz i Zamknięcie** | • 3 szybkie pytania sprawdzające (Kahoot / Mentimeter / podnoszenie rąk)<br>• Udostępnienie jednostronicowego *Cheat Sheeta* na Discordzie/GitHubie<br>• Zapowiedź Zajęć 2: *Switching, tablica MAC i VLAN-y* | Utrwalenie kluczowych zasad i podtrzymanie zaangażowania przed kolejnym spotkaniem. |

---

## 3. Pytania na Mini-Quiz (ostatnie 5 minut)

1. **Ile domen kolizyjnych i rozgłoszeniowych ma sieć złożona z jednego Switcha 2960, do którego podpięto 4 komputery?**
   * **Odpowiedź:** **4 domeny kolizyjne** (każdy aktywny port switcha to osobna domena) i **1 domena rozgłoszeniowa**.
2. **Podpinasz komputer do switcha sprawnym kablem prostym, diody świecą na zielono, ale `ping` na serwer w innej podsieci nie przechodzi. W której warstwie OSI niemal na pewno NIE leży problem?**
   * **Odpowiedź:** W **Warstwie 1 (Fizycznej)** — zielony link oznacza poprawną synchronizację fizyczną i wynegocjowane parametry łącza.
3. **Dlaczego w serwerowni łączysz dwa oddalone od siebie o 250 metrów budynki światłowodem, a nie skrętką Cat 6A?**
   * **Odpowiedź:** Maksymalny standardowy zasięg skrętki to **100 metrów**, a dodatkowo światłowód zapewnia izolację galwaniczną (ochrona przed przepięciami między budynkami) i odporność na zakłócenia EMI.

---

