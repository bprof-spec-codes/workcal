# workcal
## Team members
|Position|Name|
|---|---|
|Scrum Master|Sörös Bence|
|Product Owner|Kiss Levente|
|Architect|Csizmadia Gergő|
|Full stack|Bognár Bence|
|Full stack|Juhász Márton Bendegúz|
|Full stack|Varga Márk|

## Bejelentkezés
Minden tesztfelhasználónak a jelszava: Almafa12. (ponttal együtt, de ezen zárójeles szöveg nélkül)
A root felhasználóba a root felhasználónévvel lehet bejelentkezni.

## Kezdőoldal
![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/26b2a09f-bdb1-410d-8c50-4ed768fd3779)
Alapból ezt az ablakot látjuk, a Log in gombra rákattintva bejelentkezhetünk (vagy regisztrálhatunk)

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/1d236a94-8829-4f32-b3cd-6635a2dc5d0a)
Admin jogú felhasználóként az alapon túl a Pictures menüpontot is láthatjuk, ahol a felhasználóknak tudunk profilképet feltölteni, ami az eseményeknél is látszik.

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/c81d6bc2-117d-4434-aa2e-6d566daec152)
A képkezelő oldal

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/94dea2cc-c73e-4193-a9ff-e7fd27992574)
A naptár oldalon rendszergazdaként minden eseményt látunk

<img width="257" alt="image" src="https://github.com/bprof-spec-codes/workcal/assets/92106195/e3e0008d-aa76-4cc9-b86d-e77c8ec24689">
Ahogy létrehozni is tudunk

<img width="242" alt="image" src="https://github.com/bprof-spec-codes/workcal/assets/92106195/94ebd579-a64d-48a1-8a87-28299407ab1e">
Vagy éppen szerkeszteni

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/efbf5506-4cf7-427d-bd94-f1f6f7c136da)
Az aznapi eseményeket nyomtatóbarátan meg tudjuk jeleníteni

<img width="696" alt="image" src="https://github.com/bprof-spec-codes/workcal/assets/92106195/18cfaa88-b16d-487a-b262-e333f5636149">
A nyomtatás csak trükközéssel működik megfelelően (bővebben a problémáknál)

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/b8699ac0-09fa-4c9b-b0d9-353832f4be32)
Adminisztrátorként az összes dolgozó munkaóráira rálátunk

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/02b16acf-447e-405d-bb6e-ccc77ef0ec80)
Amit tudunk xlsx fájlba exportálni

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/c7e593df-1d90-448c-8596-06fc57139b71)
Mind a statisztikát, mind az exportálást tudunk szűrést követően is készíteni, ebben az Excel fájlban csak Júlia szépségszaloni munkaórái láthatók.

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/bd636157-213f-4e57-a657-97e9fd5dcaff)
Admin felhasználóként belépve az Identity management fülön tudunk role-okat kezelni (jelenleg az alkalmazás worker, manager és admin role-okra van optimalizálva)

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/d5b86481-ed3a-4e5a-bb1f-9304551c4c54)
![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/417daebb-e763-47db-b55b-3c29dda2ac20)
Illetve felhasználókat is tudunk létrehozni, törölni, szerkeszteni

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/a1d7d149-d3f7-4087-a275-915ff10d2934)
![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/c4351fa4-9378-47e4-bbc3-f9717ee30e82)

A teljes naptárat és statisztikát látjuk managerként is, azonban egy kicsivel alacsonyabb a jogkörünk - felhasználókat csak létrehozni tudunk, törölni nem - továbbá a Pictures oldalt sem érjük el managerként.

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/1b52daf7-b06e-438d-8fe7-852b1ea94a47)
![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/bd599eff-f43c-4d92-b67b-687c8007fb3d)
Normál dolgozóként csak a saját statisztikánkhoz és csak a hozzánk (is) rendelt eseményekhez férünk hozzá

![image](https://github.com/bprof-spec-codes/workcal/assets/92106195/291d1373-b5ef-4ab4-afbc-9cc6ece1f601)
Ugyan tudhatunk arról, hogy kik a kollégáink, szerkeszteni senkinek sem tudunk az adatlapján.

## API
Az abp által biztosított végpontokon kívül a következőkre volt szükség:
### Event
 - A worker calendar alkalmazás legfontosabb objektuma egy event, és ezekhez különböző endpointok szükségesek (a normál CRUD műveleteken kívül le kell kérdezni kifejezetten az esemény koordinátáit, hogy igazoljuk, hogy a helyszínen vagyunk, illetve a hozzá tartozó kép lekérdezésére is kellett lehetőség.

### Identity
 - Hogy a megfelelő role-ú emberek a megfelelő dolgokat lássák, frontend és backend oldalon a validációhoz szükség volt arra, hogy lekérdezzük a konkrét szerepkörünket (erre direkt endpointot nem találtunk abp szinten, és egyszerűbb volt készíteni endpoint-ot, mint bonyolult lekérdezésekkel eljutni a kívánt célhoz)
 - Például a statisztika oldalon szükség van a saját user id-nkra, hogyha sima workerként vagyunk bejelentkezve, rá tudjon szűrni a ránk releváns munkaórákra

### Picture
 - A felhasználókhoz tartozó képek feltöltésére, frissítésére és törlésére használjuk (ehhez csak admin fér hozzá)
 - Valószínűleg szebb lett volna az abp által biztosított user-t kiterjeszteni a profilkép tulajdonsággal, azonban ennek módját nem sikerült megtalálnunk.
