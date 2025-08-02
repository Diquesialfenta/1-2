// Script centralizado para actualizar todos los avatares
const fs = require("fs");

console.log("🚀 Iniciando actualización centralizada de avatares...");

// Todos los avatares centralizados (copiado del archivo playerAvatars.ts)
const allPlayerAvatars = {
  // Manchester City
  "man-city-ederson": "https://img.a.transfermarkt.technology/portrait/header/238223-1713391842.jpg?lm=1",
  "man-city-ortega": "https://img.a.transfermarkt.technology/portrait/header/85941-1668065114.jpg?lm=1",
  "man-city-bettinelli": "https://img.a.transfermarkt.technology/portrait/header/116648-1700671752.jpg?lm=1",
  "man-city-walker": "https://img.a.transfermarkt.technology/portrait/header/95424-1668090663.jpg?lm=1",
  "man-city-dias": "https://img.a.transfermarkt.technology/portrait/header/258004-1684921271.jpg?lm=1",
  "man-city-stones": "https://img.a.transfermarkt.technology/portrait/header/186590-1684764261.jpg?lm=1",
  "man-city-ake": "https://img.a.transfermarkt.technology/portrait/header/177476-1666733797.jpg?lm=1",
  "man-city-gvardiol": "https://img.a.transfermarkt.technology/portrait/header/475959-1713391602.jpg?lm=1",
  "man-city-lewis": "https://img.a.transfermarkt.technology/portrait/header/701057-1684856684.jpg?lm=1",
  "man-city-khusanov": "https://img.a.transfermarkt.technology/portrait/header/763079-1740493347.jpg?lm=1",
  "man-city-reis": "https://img.a.transfermarkt.technology/portrait/header/1005575-1680449774.jpg?lm=1",
  "man-city-rodri": "https://img.a.transfermarkt.technology/portrait/header/357565-1682587890.jpg?lm=1",
  "man-city-kovacic": "https://img.a.transfermarkt.technology/portrait/header/51471-1682668192.jpg?lm=1",
  "man-city-silva": "https://img.a.transfermarkt.technology/portrait/header/241641-1684311533.jpg?lm=1",
  "man-city-de-bruyne": "https://img.a.transfermarkt.technology/portrait/header/88755-1713391485.jpg?lm=1",
  "man-city-foden": "https://img.a.transfermarkt.technology/portrait/header/406635-1668524492.jpg?lm=1",
  "man-city-nunes": "https://img.a.transfermarkt.technology/portrait/header/601883-1693561106.jpg?lm=1",
  "man-city-haaland": "https://img.a.transfermarkt.technology/portrait/header/418560-1709108116.png?lm=1",
  "man-city-grealish": "https://img.a.transfermarkt.technology/portrait/header/203460-1676499047.jpg?lm=1",
  "man-city-marmoush": "https://img.a.transfermarkt.technology/portrait/header/445939-1747656490.jpg?lm=1",
  "man-city-doku": "https://img.a.transfermarkt.technology/portrait/header/486049-1743670159.jpg?lm=1",
  "man-city-bobb": "https://img.a.transfermarkt.technology/portrait/header/661207-1709018293.jpg?lm=1",

  // Real Madrid
  "real-madrid-courtois": "https://img.a.transfermarkt.technology/portrait/header/108390-1717280733.jpg?lm=1",
  "real-madrid-lunin": "https://img.a.transfermarkt.technology/portrait/header/404839-1701294131.jpg?lm=1",
  "real-madrid-fran-gonzalez": "https://img.a.transfermarkt.technology/portrait/header/1055220-1704358404.jpg?lm=1",
  "real-madrid-carvajal": "https://img.a.transfermarkt.technology/portrait/header/138927-1721026790.jpg?lm=1",
  "real-madrid-militao": "https://img.a.transfermarkt.technology/portrait/header/401530-1719653438.jpg?lm=1",
  "real-madrid-alaba": "https://img.a.transfermarkt.technology/portrait/header/59016-1684921582.jpeg?lm=1",
  "real-madrid-trent": "https://img.a.transfermarkt.technology/portrait/header/314353-1701680958.jpg?lm=1",
  "real-madrid-rudiger": "https://img.a.transfermarkt.technology/portrait/header/86202-1684484602.jpg?lm=1",
  "real-madrid-mendy": "https://img.a.transfermarkt.technology/portrait/header/291417-1701294025.jpg?lm=1",
  "real-madrid-huijsen": "https://img.a.transfermarkt.technology/portrait/header/890290-1750251451.jpg?lm=1",
  "real-madrid-fran-garcia": "https://img.a.transfermarkt.technology/portrait/header/341264-1688119965.jpg?lm=1",
  "real-madrid-bellingham": "https://img.a.transfermarkt.technology/portrait/header/581678-1748102891.jpg?lm=1",
  "real-madrid-camavinga": "https://img.a.transfermarkt.technology/portrait/header/640428-1668500874.jpg?lm=1",
  "real-madrid-valverde": "https://img.a.transfermarkt.technology/portrait/header/369081-1731018042.jpg?lm=1",
  "real-madrid-tchouameni": "https://img.a.transfermarkt.technology/portrait/header/413112-1668500754.jpg?lm=1",
  "real-madrid-guler": "https://img.a.transfermarkt.technology/portrait/header/861410-1699472585.jpg?lm=1",
  "real-madrid-ceballos": "https://img.a.transfermarkt.technology/portrait/header/319745-1723666162.jpg?lm=1",
  "real-madrid-modric": "https://img.a.transfermarkt.technology/portrait/header/27992-1687776160.jpg?lm=1",
  "real-madrid-vinicius": "https://img.a.transfermarkt.technology/portrait/header/371998-1664869583.jpg?lm=1",
  "real-madrid-mbappe": "https://img.a.transfermarkt.technology/portrait/header/342229-1682683695.jpg?lm=1",
  "real-madrid-rodrygo": "https://img.a.transfermarkt.technology/portrait/header/412363-1746183850.jpg?lm=1",
  "real-madrid-endrick": "https://img.a.transfermarkt.technology/portrait/header/971570-1723665994.jpg?lm=1",
  "real-madrid-brahim": "https://img.a.transfermarkt.technology/portrait/header/314678-1744193327.jpg?lm=1",
  "real-madrid-sergio-mestre": "https://img.a.transfermarkt.technology/portrait/header/973314-1733863531.jpg?lm=1",
  "real-madrid-gonzalo-garcia": "https://img.a.transfermarkt.technology/portrait/header/935230-1701294395.jpg?lm=1",

  // Manchester United
  "man-united-bayindir": "https://img.a.transfermarkt.technology/portrait/header/336077-1699471821.jpg?lm=1",
  "man-united-onana": "https://img.a.transfermarkt.technology/portrait/header/234509-1686929812.jpg?lm=1",
  "man-united-heaton": "https://img.a.transfermarkt.technology/portrait/header/34130-1688121718.jpg?lm=1",
  "man-united-martinez": "https://img.a.transfermarkt.technology/portrait/header/480762-1680681507.jpg?lm=1",
  "man-united-varane": "https://img.a.transfermarkt.technology/portrait/header/164770-1727257324.jpg?lm=1",
  "man-united-shaw": "https://img.a.transfermarkt.technology/portrait/header/183288-1668500175.jpg?lm=1",
  "man-united-dalot": "https://img.a.transfermarkt.technology/portrait/header/357147-1727785546.jpg?lm=1",
  "man-united-maguire": "https://img.a.transfermarkt.technology/portrait/header/177907-1663841733.jpg?lm=1",
  "man-united-lindelof": "https://img.a.transfermarkt.technology/portrait/header/184573-1695244778.jpg?lm=1",
  "man-united-casemiro": "https://img.a.transfermarkt.technology/portrait/header/16306-1699018876.jpg?lm=1",
  "man-united-fernandes": "https://img.a.transfermarkt.technology/portrait/header/240306-1683882766.jpg?lm=1",
  "man-united-eriksen": "https://img.a.transfermarkt.technology/portrait/header/69633-1718628122.jpg?lm=1",
  "man-united-mount": "https://img.a.transfermarkt.technology/portrait/header/346483-1683291495.jpg?lm=1",
  "man-united-mctominay": "https://img.a.transfermarkt.technology/portrait/header/315969-1718626681.jpg?lm=1",
  "man-united-rashford": "https://img.a.transfermarkt.technology/portrait/header/258923-1674473054.jpg?lm=1",
  "man-united-hojlund": "https://img.a.transfermarkt.technology/portrait/header/610442-1699471458.jpg?lm=1",
  "man-united-antony": "https://img.a.transfermarkt.technology/portrait/header/602105-1743410455.jpg?lm=1",
  "man-united-garnacho": "https://img.a.transfermarkt.technology/portrait/header/811779-1703629085.jpg?lm=1",
  "man-united-martial": "https://img.a.transfermarkt.technology/portrait/header/182877-1728416288.png?lm=1",
  "man-united-ugarte": "https://img.a.transfermarkt.technology/portrait/header/476701-1715107512.jpg?lm=1",
  "man-united-mazraoui": "https://img.a.transfermarkt.technology/portrait/header/340456-1700207898.jpg?lm=1",
  "man-united-de-ligt": "https://img.a.transfermarkt.technology/portrait/header/326031-1700659567.jpg?lm=1",
  "man-united-zirkzee": "https://img.a.transfermarkt.technology/portrait/header/435648-1651087961.jpg?lm=1",

  // Aston Villa
  "aston-villa-martinez": "https://img.a.transfermarkt.technology/portrait/header/111873-1668180824.jpg?lm=1",
  "aston-villa-olsen": "https://img.a.transfermarkt.technology/portrait/header/75458-1697721104.jpg?lm=1",
  "aston-villa-gauci": "https://img.a.transfermarkt.technology/portrait/header/591844-1703230842.jpg?lm=1",
  "aston-villa-cash": "https://img.a.transfermarkt.technology/portrait/header/425334-1668091733.jpg?lm=1",
  "aston-villa-konsa": "https://img.a.transfermarkt.technology/portrait/header/413403-1700651779.jpg?lm=1",
  "aston-villa-torres": "https://img.a.transfermarkt.technology/portrait/header/399776-1691079911.jpg?lm=1",
  "aston-villa-digne": "https://img.a.transfermarkt.technology/portrait/header/126664-1736160616.jpg?lm=1",
  "aston-villa-carlos": "https://img.a.transfermarkt.technology/portrait/header/329145-1737106245.jpg?lm=1",
  "aston-villa-moreno": "https://img.a.transfermarkt.technology/portrait/header/193098-1667289023.jpg?lm=1",
  "aston-villa-mcginn": "https://img.a.transfermarkt.technology/portrait/header/193116-1689172405.jpg?lm=1",
  "aston-villa-luiz": "https://img.a.transfermarkt.technology/portrait/header/447661-1696598670.jpg?lm=1",
  "aston-villa-bailey": "https://img.a.transfermarkt.technology/portrait/header/387626-1694712703.jpg?lm=1",
  "aston-villa-ramsey": "https://img.a.transfermarkt.technology/portrait/header/503749-1687975464.jpg?lm=1",
  "aston-villa-tielemans": "https://img.a.transfermarkt.technology/portrait/header/249565-1716886438.jpg?lm=1",
  "aston-villa-watkins": "https://img.a.transfermarkt.technology/portrait/header/324358-1708341279.jpg?lm=1",
  "aston-villa-duran": "https://img.a.transfermarkt.technology/portrait/header/649317-1645958151.jpg?lm=1",
  "aston-villa-diaby": "https://img.a.transfermarkt.technology/portrait/header/395516-1642608355.jpg?lm=1",
  "aston-villa-rogers": "https://img.a.transfermarkt.technology/portrait/header/503743-1706786450.jpg?lm=1",
  "aston-villa-buendia": "https://img.a.transfermarkt.technology/portrait/header/321247-1696604099.jpg?lm=1",

  // Brighton & Hove Albion
  "brighton-verbruggen": "https://img.a.transfermarkt.technology/portrait/header/565093-1716990260.jpg?lm=1",
  "brighton-steele": "https://img.a.transfermarkt.technology/portrait/header/73564-1681383960.jpg?lm=1",
  "brighton-rushworth": "https://img.a.transfermarkt.technology/portrait/header/646353-1664348532.jpg?lm=1",
  "brighton-dunk": "https://img.a.transfermarkt.technology/portrait/header/148153-1716297176.jpg?lm=1",
  "brighton-van-hecke": "https://img.a.transfermarkt.technology/portrait/header/576314-1742501220.jpg?lm=1",
  "brighton-estupinan": "https://img.a.transfermarkt.technology/portrait/header/349599-1668498118.jpg?lm=1",
  "brighton-veltman": "https://img.a.transfermarkt.technology/portrait/header/111195-1700650522.jpg?lm=1",
  "brighton-webster": "https://img.a.transfermarkt.technology/portrait/header/212847-1681737411.jpg?lm=1",
  "brighton-lamptey": "https://img.a.transfermarkt.technology/portrait/header/504148-1692364960.jpg?lm=1",
  "brighton-gilmour": "https://img.a.transfermarkt.technology/portrait/header/423744-1701544195.jpg?lm=1",
  "brighton-caicedo": "https://img.a.transfermarkt.technology/portrait/header/687626-1660729724.jpg?lm=1",
  "brighton-mitoma": "https://img.a.transfermarkt.technology/portrait/header/504849-1731683095.jpg?lm=1",
  "brighton-march": "https://img.a.transfermarkt.technology/portrait/header/209212-1682348330.jpeg?lm=1",
  "brighton-ferguson": "https://img.a.transfermarkt.technology/portrait/header/648046-1681739980.jpg?lm=1",
  "brighton-welbeck": "https://img.a.transfermarkt.technology/portrait/header/67063-1746437656.jpg?lm=1",
  "brighton-pedro": "https://img.a.transfermarkt.technology/portrait/header/626724-1724792744.jpg?lm=1",
  "brighton-enciso": "https://img.a.transfermarkt.technology/portrait/header/660867-1669388786.jpg?lm=1",
  "brighton-adingra": "https://img.a.transfermarkt.technology/portrait/header/658536-1746437487.jpg?lm=1",
  "brighton-rutter": "https://img.a.transfermarkt.technology/portrait/header/538977-1727785742.jpg?lm=1",
  "brighton-minteh": "https://img.a.transfermarkt.technology/portrait/header/1012534-1694774813.jpg?lm=1",
  "brighton-gruda": "https://img.a.transfermarkt.technology/portrait/header/700106-1699001685.jpg?lm=1",
  "brighton-kadioglu": "https://img.a.transfermarkt.technology/portrait/header/369316-1724792538.jpg?lm=1",
  "brighton-oriley": "https://img.a.transfermarkt.technology/portrait/header/406634-1661800636.jpg?lm=1",

  // Tottenham Hotspur
  "tottenham-vicario": "https://img.a.transfermarkt.technology/portrait/header/286047-1725874745.jpg?lm=1",
  "tottenham-kinsky": "https://img.a.transfermarkt.technology/portrait/header/725912-1736157609.jpg?lm=1",
  "tottenham-austin": "https://img.a.transfermarkt.technology/portrait/header/428016-1737735261.jpg?lm=1",
  "tottenham-romero": "https://img.a.transfermarkt.technology/portrait/header/355915-1665609429.jpg?lm=1",
  "tottenham-van-de-ven": "https://img.a.transfermarkt.technology/portrait/header/557459-1744313600.jpg?lm=1",
  "tottenham-udogie": "https://img.a.transfermarkt.technology/portrait/header/556385-1697208468.jpg?lm=1",
  "tottenham-porro": "https://img.a.transfermarkt.technology/portrait/header/553875-1730812390.jpg?lm=1",
  "tottenham-davies": "https://img.a.transfermarkt.technology/portrait/header/192765-1668520095.jpg?lm=1",
  "tottenham-dier": "https://img.a.transfermarkt.technology/portrait/header/175722-1665608595.jpg?lm=1",
  "tottenham-bissouma": "https://img.a.transfermarkt.technology/portrait/header/410425-1665607355.jpg?lm=1",
  "tottenham-sarr": "https://img.a.transfermarkt.technology/portrait/header/568693-1668163083.jpg?lm=1",
  "tottenham-maddison": "https://img.a.transfermarkt.technology/portrait/header/294057-1687982662.jpg?lm=1",
  "tottenham-kulusevski": "https://img.a.transfermarkt.technology/portrait/header/431755-1684943454.jpg?lm=1",
  "tottenham-bentancur": "https://img.a.transfermarkt.technology/portrait/header/354362-1740605779.jpg?lm=1",
  "tottenham-son": "https://img.a.transfermarkt.technology/portrait/header/91845-1669336455.jpg?lm=1",
  "tottenham-richarlison": "https://img.a.transfermarkt.technology/portrait/header/378710-1665608231.jpg?lm=1",
  "tottenham-johnson": "https://img.a.transfermarkt.technology/portrait/header/470607-1692959021.jpg?lm=1",
  "tottenham-solomon": "https://img.a.transfermarkt.technology/portrait/header/396638-1684793985.jpg?lm=1",
  "tottenham-werner": "https://img.a.transfermarkt.technology/portrait/header/170527-1663686137.jpg?lm=1",

  // Newcastle United
  "newcastle-pope": "https://img.a.transfermarkt.technology/portrait/header/192080-1663841362.jpg?lm=1",
  "newcastle-dubravka": "https://img.a.transfermarkt.technology/portrait/header/74960-1700237195.jpg?lm=1",
  "newcastle-gillespie": "https://img.a.transfermarkt.technology/portrait/header/142389-1746646196.jpg?lm=1",
  "newcastle-trippier": "https://img.a.transfermarkt.technology/portrait/header/95810-1696454076.jpg?lm=1",
  "newcastle-schar": "https://img.a.transfermarkt.technology/portrait/header/135343-1667990394.jpg?lm=1",
  "newcastle-botman": "https://img.a.transfermarkt.technology/portrait/header/361093-1683290679.jpg?lm=1",
  "newcastle-burn": "https://img.a.transfermarkt.technology/portrait/header/134270-1682340860.jpg?lm=1",
  "newcastle-livramento": "https://img.a.transfermarkt.technology/portrait/header/503981-1699383321.jpg?lm=1",
  "newcastle-hall": "https://img.a.transfermarkt.technology/portrait/header/670858-1699385942.jpg?lm=1",
  "newcastle-guimaraes": "https://img.a.transfermarkt.technology/portrait/header/520624-1668522672.jpg?lm=1",
  "newcastle-joelinton": "https://img.a.transfermarkt.technology/portrait/header/333241-1674210135.jpg?lm=1",
  "newcastle-longstaff": "https://img.a.transfermarkt.technology/portrait/header/346707-1682341336.jpg?lm=1",
  "newcastle-tonali": "https://img.a.transfermarkt.technology/portrait/header/397033-1688389270.jpg?lm=1",
  "newcastle-miley": "https://img.a.transfermarkt.technology/portrait/header/922769-1696453881.jpg?lm=1",
  "newcastle-isak": "https://img.a.transfermarkt.technology/portrait/header/349066-1680791339.jpg?lm=1",
  "newcastle-gordon": "https://img.a.transfermarkt.technology/portrait/header/503733-1660588736.jpg?lm=1",
  "newcastle-almiron": "https://img.a.transfermarkt.technology/portrait/header/272999-1740822578.jpg?lm=1",
  "newcastle-barnes": "https://img.a.transfermarkt.technology/portrait/header/398065-1700650664.jpg?lm=1",
  "newcastle-wilson": "https://img.a.transfermarkt.technology/portrait/header/123682-1668090039.jpg?lm=1",

  // West Ham United
  "west-ham-fabianski": "https://img.a.transfermarkt.technology/portrait/header/29692-1685709486.jpg?lm=1",
  "west-ham-areola": "https://img.a.transfermarkt.technology/portrait/header/120629-1663243036.jpg?lm=1",
  "west-ham-foderingham": "https://img.a.transfermarkt.technology/portrait/header/61697-1746645554.jpg?lm=1",
  "west-ham-coufal": "https://img.a.transfermarkt.technology/portrait/header/157672-1667897675.jpg?lm=1",
  "west-ham-kilman": "https://img.a.transfermarkt.technology/portrait/header/525247-1688370291.jpg?lm=1",
  "west-ham-mavropanos": "https://img.a.transfermarkt.technology/portrait/header/415912-1691999569.jpg?lm=1",
  "west-ham-emerson": "https://img.a.transfermarkt.technology/portrait/header/181778-1660636930.jpg?lm=1",
  "west-ham-wan-bissaka": "https://img.a.transfermarkt.technology/portrait/header/477758-1617030255.jpg?lm=1",
  "west-ham-johnson": "https://img.a.transfermarkt.technology/portrait/header/468002-1694618190.jpg?lm=1",
  "west-ham-soucek": "https://img.a.transfermarkt.technology/portrait/header/283628-1704184173.jpg?lm=1",
  "west-ham-ward-prowse": "https://img.a.transfermarkt.technology/portrait/header/181579-1684751045.jpg?lm=1",
  "west-ham-paqueta": "https://img.a.transfermarkt.technology/portrait/header/444523-1695370009.jpg?lm=1",
  "west-ham-bowen": "https://img.a.transfermarkt.technology/portrait/header/314875-1662362005.jpg?lm=1",
  "west-ham-kudus": "https://img.a.transfermarkt.technology/portrait/header/543499-1668429218.jpg?lm=1",
  "west-ham-antonio": "https://img.a.transfermarkt.technology/portrait/header/104124-1709884222.jpg?lm=1",
  "west-ham-fullkrug": "https://img.a.transfermarkt.technology/portrait/header/75489-1709560033.jpg?lm=1",
  "west-ham-cornet": "https://img.a.transfermarkt.technology/portrait/header/234781-1739281982.jpg?lm=1",
  "west-ham-ings": "https://img.a.transfermarkt.technology/portrait/header/134294-1674218597.jpg?lm=1",
  "west-ham-summerville": "https://img.a.transfermarkt.technology/portrait/header/474701-1701683744.jpg?lm=1",
  "west-ham-cresswell": "https://img.a.transfermarkt.technology/portrait/header/92571-1700670925.jpg?lm=1",
  "west-ham-todibo": "https://img.a.transfermarkt.technology/portrait/header/605184-1699439806.jpg?lm=1",
  "west-ham-soler": "https://img.a.transfermarkt.technology/portrait/header/372246-1662059930.jpg?lm=1",
  "west-ham-rodriguez": "https://img.a.transfermarkt.technology/portrait/header/342385-1668181269.jpg?lm=1",
  "west-ham-guilherme": "https://img.a.transfermarkt.technology/portrait/header/991800-1736160163.jpg?lm=1",

  // Crystal Palace
  "crystal-palace-henderson": "https://img.a.transfermarkt.technology/portrait/header/258919-1716297478.jpg?lm=1",
  "crystal-palace-johnstone": "https://img.a.transfermarkt.technology/portrait/header/110864-1672915792.jpg?lm=1",
  "crystal-palace-matthews": "https://img.a.transfermarkt.technology/portrait/header/196722-1669021601.jpg?lm=1",
  "crystal-palace-guehi": "https://img.a.transfermarkt.technology/portrait/header/392757-1683030598.jpg?lm=1",
  "crystal-palace-lacroix": "https://img.a.transfermarkt.technology/portrait/header/434224-1657202248.jpg?lm=1",
  "crystal-palace-chalobah": "https://img.a.transfermarkt.technology/portrait/header/346314-1698937171.jpg?lm=1",
  "crystal-palace-mitchell": "https://img.a.transfermarkt.technology/portrait/header/730893-1693826944.jpg?lm=1",
  "crystal-palace-munoz": "https://img.a.transfermarkt.technology/portrait/header/493003-1718642628.jpg?lm=1",
  "crystal-palace-richards": "https://img.a.transfermarkt.technology/portrait/header/578539-1708426272.jpg?lm=1",
  "crystal-palace-clyne": "https://img.a.transfermarkt.technology/portrait/header/85177-1700648209.jpg?lm=1",
  "crystal-palace-ward": "https://img.a.transfermarkt.technology/portrait/header/92572-1737920630.jpg?lm=1",
  "crystal-palace-eze": "https://img.a.transfermarkt.technology/portrait/header/479999-1678466922.jpg?lm=1",
  "crystal-palace-wharton": "https://img.a.transfermarkt.technology/portrait/header/744149-1716297290.jpg?lm=1",
  "crystal-palace-lerma": "https://img.a.transfermarkt.technology/portrait/header/262980-1693334146.jpg?lm=1",
  "crystal-palace-hughes": "https://img.a.transfermarkt.technology/portrait/header/207014-1700672424.jpg?lm=1",
  "crystal-palace-doucoure": "https://img.a.transfermarkt.technology/portrait/header/543387-1693826399.jpg?lm=1",
  "crystal-palace-kamada": "https://img.a.transfermarkt.technology/portrait/header/356141-1707947777.jpg?lm=1",
  "crystal-palace-schlupp": "https://img.a.transfermarkt.technology/portrait/header/157506-1700672108.jpg?lm=1",
  "crystal-palace-mateta": "https://img.a.transfermarkt.technology/portrait/header/420002-1723202650.jpg?lm=1",
  "crystal-palace-nketiah": "https://img.a.transfermarkt.technology/portrait/header/340324-1730795033.jpg?lm=1",
  "crystal-palace-sarr": "https://img.a.transfermarkt.technology/portrait/header/410225-1668162683.jpg?lm=1",
  "crystal-palace-ayew": "https://img.a.transfermarkt.technology/portrait/header/108354-1668429913.jpg?lm=1",
  "crystal-palace-umeh": "https://img.a.transfermarkt.technology/portrait/header/943560-1708422716.jpg?lm=1",
  "crystal-palace-devenny": "https://img.a.transfermarkt.technology/portrait/header/747009-1736159687.jpg?lm=1",

  // Chelsea
  "chelsea-adarabioyo": "https://img.a.transfermarkt.technology/portrait/header/258878-1646903871.jpg?lm=1",
  "chelsea-badiashile": "https://img.a.transfermarkt.technology/portrait/header/463603-1714721596.jpg?lm=1",
  "chelsea-colwill": "https://img.a.transfermarkt.technology/portrait/header/614258-1694614507.jpg?lm=1",
  "chelsea-james": "https://img.a.transfermarkt.technology/portrait/header/472423-1683900849.jpg?lm=1",
  "chelsea-disasi": "https://img.a.transfermarkt.technology/portrait/header/386047-1727785671.jpg?lm=1",
  "chelsea-gusto": "https://img.a.transfermarkt.technology/portrait/header/620322-1752061866.jpg?lm=1",
  "chelsea-fofana": "https://img.a.transfermarkt.technology/portrait/header/475411-1683899212.jpg?lm=1",
  "chelsea-fernandez": "https://img.a.transfermarkt.technology/portrait/header/648195-1669894717.jpg?lm=1",
  "chelsea-mudryk": "https://img.a.transfermarkt.technology/portrait/header/537860-1732822624.jpg?lm=1",
  "chelsea-chukwuemeka": "https://img.a.transfermarkt.technology/portrait/header/659459-1736278010.jpg?lm=1",
  "chelsea-nkunku": "https://img.a.transfermarkt.technology/portrait/header/344381-1663686834.jpg?lm=1",
  "chelsea-palmer": "https://img.a.transfermarkt.technology/portrait/header/568177-1712320986.jpg?lm=1",
  "chelsea-dewsbury-hall": "https://img.a.transfermarkt.technology/portrait/header/475188-1638810238.jpg?lm=1",
  "chelsea-caicedo": "https://img.a.transfermarkt.technology/portrait/header/687626-1660729724.jpg?lm=1",
  "chelsea-jackson": "https://img.a.transfermarkt.technology/portrait/header/776890-1726227971.jpg?lm=1",
  "chelsea-madueke": "https://img.a.transfermarkt.technology/portrait/header/503987-1683102348.jpg?lm=1",
  "chelsea-felix": "https://img.a.transfermarkt.technology/portrait/header/462250-1668165358.jpg?lm=1",
  "chelsea-delap": "https://img.a.transfermarkt.technology/portrait/header/610849-1746646306.jpg?lm=1",
  "chelsea-guiu": "https://img.a.transfermarkt.technology/portrait/header/938158-1719846394.jpg?lm=1",
  "chelsea-neto": "https://img.a.transfermarkt.technology/portrait/header/487465-1709158892.jpg?lm=1",

  // Wolverhampton Wanderers
  "wolves_gk1": "https://img.a.transfermarkt.technology/portrait/header/249994-1696600015.jpg?lm=1", // José Sá
  "wolves_df1": "https://img.a.transfermarkt.technology/portrait/header/171679-1682598455.jpg?lm=1", // Matt Doherty
  "wolves_df2": "https://img.a.transfermarkt.technology/portrait/header/525247-1688370291.jpg?lm=1", // Max Kilman
  "wolves_df3": "https://img.a.transfermarkt.technology/portrait/header/121477-1700673087.jpg?lm=1", // Craig Dawson
  "wolves_df4": "https://img.a.transfermarkt.technology/portrait/header/578391-1695656762.jpg?lm=1", // Rayan Aït-Nouri
  "wolves_mf1": "https://img.a.transfermarkt.technology/portrait/header/29364-1464083394.PNG?lm=1", // João Moutinho
  "wolves_mf2": "https://img.a.transfermarkt.technology/portrait/header/735570-1675092223.jpg?lm=1", // João Gomes
  "wolves_mf3": "https://img.a.transfermarkt.technology/portrait/header/517894-1696599737.jpg?lm=1", // Matheus Cunha
  "wolves_fw1": "https://img.a.transfermarkt.technology/portrait/header/206040-1742820547.jpg?lm=1", // Raúl Jiménez
  "wolves_fw2": "https://img.a.transfermarkt.technology/portrait/header/429983-1743541067.jpg?lm=1", // Jørgen Strand Larsen
  "wolves_fw3": "https://img.a.transfermarkt.technology/portrait/header/292246-1708341416.jpg?lm=1", // Hwang Hee-chan
  "wolves_gk2": "https://img.a.transfermarkt.technology/portrait/header/136401-1700737411.jpg?lm=1", // Daniel Bentley
  "wolves_df5": "https://img.a.transfermarkt.technology/portrait/header/698678-1669020197.jpg?lm=1", // Hugo Bueno
  "wolves_mf4": "https://img.a.transfermarkt.technology/portrait/header/170934-1667549900.jpg?lm=1", // Mario Lemina
  "wolves_mf5": "https://img.a.transfermarkt.technology/portrait/header/433183-1682690588.jpg?lm=1", // Tommy Doyle
  "wolves_fw4": "https://img.a.transfermarkt.technology/portrait/header/225122-1701334424.jpg?lm=1", // Gonçalo Guedes
  "wolves-sa": "https://img.a.transfermarkt.technology/portrait/header/198008-1724336978.jpg?lm=1", // André Silva
  "wolves-semedo": "https://img.a.transfermarkt.technology/portrait/header/231572-1684487147.jpg?lm=1", // Nélson Semedo
  "wolves-lemina": "https://img.a.transfermarkt.technology/portrait/header/170934-1667549900.jpg?lm=1", // Mario Lemina (duplicado)
  "wolves-gomes": "https://img.a.transfermarkt.technology/portrait/header/735570-1675092223.jpg?lm=1", // João Gomes (duplicado)
  "wolves-ait-nouri": "https://img.a.transfermarkt.technology/portrait/header/578391-1695656762.jpg?lm=1", // Rayan Aït-Nouri (duplicado)
  "wolves-dawson": "https://img.a.transfermarkt.technology/portrait/header/121477-1700673087.jpg?lm=1", // Craig Dawson (duplicado)
  "wolves-doyle": "https://img.a.transfermarkt.technology/portrait/header/433183-1682690588.jpg?lm=1", // Tommy Doyle (duplicado)
};

// Leer el archivo gameData.ts
let fileContent = fs.readFileSync("client/lib/gameData.ts", "utf8");

let updatedCount = 0;
let skippedCount = 0;

// Para cada jugador en el archivo centralizado, agregar su avatarUrl
Object.entries(allPlayerAvatars).forEach(([playerId, avatarUrl]) => {
  // Solo hacer el reemplazo si el jugador no tiene ya un avatarUrl
  const playerRegex = new RegExp(
    `(\\s+id: "${playerId}",[\\s\\S]*?isStarter: (?:true|false),)\\n(\\s+)(\\s*})`,
    "g"
  );

  const originalContent = fileContent;
  fileContent = fileContent.replace(
    playerRegex,
    (match, playerBlock, indentation, closingBrace) => {
      // Verificar si ya tiene avatarUrl
      if (match.includes("avatarUrl:")) {
        console.log(`⏭️  Saltando ${playerId}: ya tiene avatarUrl`);
        skippedCount++;
        return match; // Ya tiene avatar, no modificar
      }

      // Agregar avatarUrl antes del closing brace
      console.log(`✅ Actualizando ${playerId}`);
      updatedCount++;
      return (
        playerBlock +
        "\n" +
        indentation +
        `avatarUrl: "${avatarUrl}",` +
        "\n" +
        indentation +
        closingBrace
      );
    }
  );
});

// Escribir el archivo actualizado
fs.writeFileSync("client/lib/gameData.ts", fileContent);

console.log("\n🎉 ¡Actualización completada!");
console.log(`📊 Resumen:`);
console.log(`   ✅ Jugadores actualizados: ${updatedCount}`);
console.log(`   ⏭️  Jugadores saltados (ya tenían avatar): ${skippedCount}`);
console.log(`   📁 Total de avatares disponibles: ${Object.keys(allPlayerAvatars).length}`);
console.log(`\n📝 Archivo actualizado: client/lib/gameData.ts`);
console.log(`\n💡 Para agregar nuevos avatares en el futuro:`);
console.log(`   1. Edita el archivo: client/lib/playerAvatars.ts`);
console.log(`   2. Ejecuta: node client/apply-centralized-avatars.js`);
